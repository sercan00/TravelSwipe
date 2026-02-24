let swipeHistory = [];
let currentIndex = 0;
let likedAttractions = [];

let selectedCity = null;

let attractions = [];
let filteredAttractions = [];
let selectedCategory = "All";

const imageCache = new Map();

function preloadImage(url) {
  if (!url) return Promise.resolve(false);
  if (imageCache.has(url)) return imageCache.get(url);

  const p = new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";

    img.onload = async () => {
      try {
        // decode makes it appear instantly when inserted into DOM
        if (img.decode) await img.decode();
      } catch {}
      resolve(true);
    };

    img.onerror = () => resolve(false);
    img.src = url;
  });

  imageCache.set(url, p);
  return p;
}
let pendingCity = null;
let tripDays = 1;


function preloadUpcomingImages(list, startIndex, count = 6) {
  const tasks = [];
  for (let i = 0; i < count; i++) {
    const item = list[startIndex + i];
    if (item?.image) tasks.push(preloadImage(item.image));
  }
  return Promise.all(tasks);
}

async function loadCard() {
  const container = document.getElementById("card-container");
  const currentPlace = filteredAttractions[currentIndex];

  if (!currentPlace) {
    container.innerHTML = "<h3>No more places! Check your list.</h3>";
    return;
  }

  // Preload current image if not cached
  await preloadImage(currentPlace.image);

  container.innerHTML = `
    <div id="swipe-card" class="swipe-card">
      <img class="card-img" src="${currentPlace.image}" alt="${currentPlace.name}">
      <h2>${currentPlace.name}</h2>
      <p class="subtle">${currentIndex + 1} / ${filteredAttractions.length}</p>
      <p class="description">${currentPlace.description ?? ""}</p>

      <div class="actions">
        <button id="btn-skip" class="btn secondary">👎 Skip</button>
        <button id="btn-like" class="btn">👍 Like</button>
        <button id="btn-undo" class="btn secondary">↩️ Undo</button>
      </div>
    </div>
  `;

  // Improve image loading priority
  const imgEl = container.querySelector(".card-img");
  if (imgEl) {
    imgEl.loading = "eager";
    imgEl.decoding = "async";
    imgEl.fetchPriority = "high";
  }

  // Button actions
  const likeBtn = document.getElementById("btn-like");
  const skipBtn = document.getElementById("btn-skip");
  const undoBtn = document.getElementById("btn-undo");

  if (likeBtn) likeBtn.onclick = () => handleSwipe("right");
  if (skipBtn) skipBtn.onclick = () => handleSwipe("left");
  if (undoBtn) undoBtn.onclick = undoLastSwipe;

  // Keep swipe gestures
  attachSwipeHandlers();

  // Preload next images
  preloadUpcomingImages(filteredAttractions, currentIndex + 1, 20);
}
function startCity(cityName) {
  selectedCity = cityName;

  attractions = cityData[cityName] || [];
  selectedCategory = "All";

  likedAttractions = [];
  swipeHistory = [];
  currentIndex = 0;

  localStorage.setItem("selectedCity", cityName);
  localStorage.setItem("likedAttractions", "[]");

  const pageTitle = document.getElementById("page-title");
  if (pageTitle) pageTitle.textContent = `TravelSwipe: Explore ${cityName}`;

  document.getElementById("city-screen").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("controls-wrap").style.display = "block";
  document.getElementById("controls").style.display = "flex";
  renderFilterUI();
  applyFilter();
  jumpToAttractionIfRequested();
  loadCard();
  updateItineraryDisplay();

  localStorage.setItem("selectedCity", cityName);
  localStorage.setItem("likedAttractions", "[]");
}
function goBackToCitySelection() {
  // reset state
  selectedCity = null;
  currentIndex = 0;
  likedAttractions = [];
  swipeHistory = [];
  filteredAttractions = [];
  attractions = [];

  // UI reset
  const pageTitle = document.getElementById("page-title");
  if (pageTitle) pageTitle.textContent = "TravelSwipe";

  document.getElementById("app").style.display = "none";
  document.getElementById("controls-wrap").style.display = "none";
  document.getElementById("city-screen").style.display = "block";
}
function renderCityButtons() {
  document.querySelectorAll(".city-btn").forEach((btn) => {
    btn.addEventListener("click", () => openDaysModal(btn.dataset.city));
  });
}

function getUniqueCategories() {
  return ["All", ...new Set(attractions.map((a) => a.category))];
}

function renderFilterUI() {
  const controls = document.getElementById("controls");
  const categories = getUniqueCategories();

  controls.innerHTML = `
    <label for="categoryFilter">Category</label>
    <select id="categoryFilter"></select>
  `;

  const select = document.getElementById("categoryFilter");

  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  select.value = selectedCategory;

  select.addEventListener("change", (e) => {
    selectedCategory = e.target.value;
    applyFilter();
  });

  select.disabled = attractions.length === 0;
}

function applyFilter() {
  filteredAttractions =
    selectedCategory === "All"
      ? attractions
      : attractions.filter((a) => a.category === selectedCategory);

  currentIndex = 0;
  swipeHistory = [];

  preloadUpcomingImages(filteredAttractions, 0, 20);
  loadCard();
}

function handleSwipe(direction) {
  const place = filteredAttractions[currentIndex];
  if (!place) return;

  swipeHistory.push({ place, direction });

  if (direction === "right") {
    likedAttractions.push(place);
    saveItinerary();
    updateItineraryDisplay();
  }

  currentIndex++;
  loadCard();
}

function updateItineraryDisplay() {
  const list = document.getElementById("itinerary-list");
  list.innerHTML = "";

  likedAttractions.forEach((place) => {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = place.name;

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = place.category || "Place";

    li.appendChild(name);
    li.appendChild(badge);
    list.appendChild(li);
  });
}

function attachSwipeHandlers() {
  const card = document.getElementById("swipe-card");
  if (!card) return;

  let startX = 0;
  let startY = 0;
  let dx = 0;
  let dy = 0;
  let isDragging = false;

  const SWIPE_THRESHOLD = 120;

  card.addEventListener("pointerdown", (e) => {
    isDragging = true;
    card.classList.add("dragging");

    startX = e.clientX;
    startY = e.clientY;
    dx = 0;
    dy = 0;

    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    dx = e.clientX - startX;
    dy = e.clientY - startY;

    const rotate = dx * 0.05;
    card.style.transform = `translate(${dx}px, ${dy * 0.2}px) rotate(${rotate}deg)`;
  });

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove("dragging");

    if (dx > SWIPE_THRESHOLD) {
      card.style.transform = `translate(600px, 0px) rotate(20deg)`;
      setTimeout(() => handleSwipe("right"), 120);
      return;
    }

    if (dx < -SWIPE_THRESHOLD) {
      card.style.transform = `translate(-600px, 0px) rotate(-20deg)`;
      setTimeout(() => handleSwipe("left"), 120);
      return;
    }

    card.style.transform = "translate(0px, 0px) rotate(0deg)";
  }

  card.addEventListener("pointerup", endDrag);
  card.addEventListener("pointercancel", endDrag);
}

function undoLastSwipe() {
  if (swipeHistory.length === 0) return;

  const last = swipeHistory.pop();
  currentIndex = Math.max(0, currentIndex - 1);

  if (last.direction === "right") {
    likedAttractions = likedAttractions.filter((p) => p.id !== last.place.id);
    saveItinerary();
    updateItineraryDisplay();
  }

  loadCard();
}

function saveItinerary() {
  localStorage.setItem("selectedCity", selectedCity ?? "");
  localStorage.setItem("likedAttractions", JSON.stringify(likedAttractions));
}

function loadItinerary() {
  try {
    return JSON.parse(localStorage.getItem("likedAttractions") || "[]");
  } catch {
    return [];
  }
}

function jumpToAttractionIfRequested() {
  const jumpIdRaw = localStorage.getItem("jumpToAttractionId");
  if (!jumpIdRaw) return;

  const jumpId = Number(jumpIdRaw);
  if (!Number.isFinite(jumpId)) {
    localStorage.removeItem("jumpToAttractionId");
    return;
  }

  // find index in current filtered list
  const idx = filteredAttractions.findIndex((a) => Number(a.id) === jumpId);

  if (idx >= 0) {
    currentIndex = idx;
  }

  // clear so it doesn't keep jumping forever
  localStorage.removeItem("jumpToAttractionId");
}

function openDaysModal(cityName){
  pendingCity = cityName;

  const modal = document.getElementById("days-modal");
  const input = document.getElementById("tripDays");

  const saved = Number(localStorage.getItem("tripDays"));
  if (Number.isFinite(saved) && saved >= 1) input.value = String(saved);

  modal.style.display = "flex";
}

function closeDaysModal(){
  const modal = document.getElementById("days-modal");
  modal.style.display = "none";
  pendingCity = null;
}

function confirmDaysAndStart(){
  const input = document.getElementById("tripDays");
  const days = Math.max(1, Math.min(14, Number(input.value || 1)));

  tripDays = days;
  localStorage.setItem("tripDays", String(days));

  if (pendingCity) startCity(pendingCity);
  closeDaysModal();
}
document.addEventListener("DOMContentLoaded", () => {
  renderCityButtons();

  const mapBtn = document.getElementById("btn-map");
  if (mapBtn) {
    mapBtn.addEventListener("click", () => {
      window.location.href = "map.html";
    });
  }
});
// --- Boot (do this ONCE, keep at bottom of file) ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("[TravelSwipe] boot ✅");

  // Map button
  const mapBtn = document.getElementById("btn-map");
  if (mapBtn) {
    mapBtn.addEventListener("click", () => (window.location.href = "map.html"));
  }

  // City buttons (works even if UI changes)
  document.addEventListener("click", (e) => {
    const cityBtn = e.target.closest(".city-btn");
    if (!cityBtn) return;

    const city = cityBtn.dataset.city;
    console.log("[TravelSwipe] city:", city);

    try {
      startCity(city);
    } catch (err) {
      console.error(err);
      alert("Error starting city. Check Console for details.");
    }
  });
});const title = document.getElementById("page-title");
if (title) {
  title.style.cursor = "pointer";
  title.addEventListener("click", goBackToCitySelection);
}