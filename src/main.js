// this file runs the main swipe page
// handles city pick, swiping, filters, saved itinerary, chat, tutorial and theme

let swipeHistory = [];
let currentIndex = 0;
let likedAttractions = [];

let selectedCity = null;

let attractions = [];
let filteredAttractions = [];
let selectedCategory = "All";

const imageCache = new Map();


// preloads one image and stores it in a cache
// this helps cards load faster when the user swipes
function preloadImage(url) {
  if (!url) return Promise.resolve(false);
  if (imageCache.has(url)) return imageCache.get(url);

  const p = new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";

    img.onload = async () => {
      try {
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


// preloads a few cards ahead so next places feel instant
function preloadUpcomingImages(list, startIndex, count = 6) {
  const tasks = [];
  for (let i = 0; i < count; i++) {
    const item = list[startIndex + i];
    if (item?.image) tasks.push(preloadImage(item.image));
  }
  return Promise.all(tasks);
}
/*Progress Persistence Indicator*/
function showSavedToast() {
  let toast = document.getElementById("saved-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "saved-toast";
    toast.style.cssText = `
      position: fixed; bottom: 110px; right: 24px;
      background: #1e3a5f; color: #f8fafc;
      padding: 10px 18px; border-radius: 12px;
      font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
      font-weight: 600; opacity: 0; transition: opacity 0.3s ease;
      z-index: 9998; border: 1px solid rgba(248,250,252,0.15);
      pointer-events: none;
    `;
    toast.textContent = "✓ Saved to cloud";
    document.body.appendChild(toast);
  }
  toast.style.opacity = "1";
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => { toast.style.opacity = "0"; }, 2000);
}

// loads the current swipe card into the page
// if there are no more cards it shows the end card instead
async function loadCard() {

  const container = document.getElementById("card-container");
  const fixedUndo = document.getElementById("btn-undo-fixed");
  const currentPlace = filteredAttractions[currentIndex];

  if (!currentPlace) {
    if (fixedUndo) fixedUndo.style.display = "none";
    container.innerHTML = `
      <div id="end-card" class="swipe-card" style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:400px; gap:20px;">
        <div style="font-size:4rem;">🎉</div>
        <h2 style="margin:0; font-family:'Playfair Display',serif;">You've seen all the places!</h2>
        <p style="color:rgba(248,250,252,0.6); font-size:1.15rem; margin:0;">Your itinerary is ready. View it on the map.</p>
        <button onclick="window.location.href='map.html'" class="btn" style="padding:20px 44px; font-size:1.3rem; margin-top:12px; background:var(--navy);">🗺️ View My Itinerary</button>
      </div>
    `;

    let undoWrap = document.getElementById("undo-wrap");
    if (!undoWrap) {
      undoWrap = document.createElement("div");
      undoWrap.id = "undo-wrap";
      undoWrap.style.cssText = "display:flex; justify-content:center; margin-top:14px;";
      container.parentNode.insertBefore(undoWrap, container.nextSibling);
    }
    undoWrap.innerHTML = '<button id="btn-undo" class="btn secondary" title="Undo your last swipe and go back" style="padding:14px 28px; font-size:1.15rem;">↩️ Undo</button>';
    document.getElementById("btn-undo").onclick = () => undoLastSwipe();

    const endCard = document.getElementById("end-card");
    if (endCard) {
      endCard.classList.add("shake");
      setTimeout(() => endCard.classList.remove("shake"), 500);
    }
    return;
  }

  await preloadImage(currentPlace.image);

  container.innerHTML = `
    <div id="swipe-card" class="swipe-card">
      <span id="overlay-like" class="swipe-overlay like">LIKE</span>
      <span id="overlay-skip" class="swipe-overlay skip">SKIP</span>
      <img class="card-img" src="${currentPlace.image}" alt="${currentPlace.name}">
      <h2>${currentPlace.name}</h2>
<div class="progress-bar-wrap">
  <div class="progress-bar" style="width: ${Math.round(((currentIndex + 1) / filteredAttractions.length) * 100)}%"></div>
</div>
<p class="subtle">${currentIndex + 1} / ${filteredAttractions.length}</p>     
<p class="description">${currentPlace.description ?? ""}</p>
      ${currentPlace.wiki ? `<a href="${currentPlace.wiki}" target="_blank" class="learn-more">Learn more ↗</a>` : ""}
      
      </div>
  `;

  const imgEl = container.querySelector(".card-img");
  if (imgEl) {
    imgEl.loading = "eager";
    imgEl.decoding = "async";
    imgEl.fetchPriority = "high";
  }


  // adds swipe logic to the newly created card
  attachSwipeHandlers();

  preloadUpcomingImages(filteredAttractions, currentIndex + 1, 20);
}


// starts the app after a city is picked
// resets state and swaps from city screen to swipe screen
function startCity(cityName) {
  selectedCity = cityName;
  attractions = cityData[cityName] || [];
  selectedCategory = "All";

  likedAttractions = [];
  swipeHistory = [];
  currentIndex = 0;

  localStorage.setItem("selectedCity", cityName);
  localStorage.setItem("likedAttractions", JSON.stringify([]));

  const pageTitle = document.getElementById("page-title");
  if (pageTitle) pageTitle.textContent = `TravelSwipe: Explore ${cityName}`;


  const cityScreen = document.getElementById("city-screen");
  const app = document.getElementById("app");

  cityScreen.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  cityScreen.style.opacity = "0";
  cityScreen.style.transform = "translateY(-20px)";

  setTimeout(() => {
    cityScreen.style.display = "none";
    app.style.display = "block";
    app.style.opacity = "0";
    app.style.transform = "translateY(20px)";

    requestAnimationFrame(() => {
      app.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      app.style.opacity = "1";
      app.style.transform = "translateY(0)";
    });
  }, 300);

  renderFilterUI();
  applyFilter();
  jumpToAttractionIfRequested();
  updateItineraryDisplay();

  if (window.TravelSwipeDB) {
    window.TravelSwipeDB.saveCurrentSession();
  }
  showTutorialIfNeeded();
}


// takes the user back to the city selection screen
// clears current swipe state as well
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

  const app = document.getElementById("app");
  const controlsWrap = document.getElementById("controls-wrap");
  const cityScreen = document.getElementById("city-screen");

  app.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  app.style.opacity = "0";
  app.style.transform = "translateY(-20px)";

  setTimeout(() => {
    app.style.display = "none";
    controlsWrap.style.display = "none";
    cityScreen.style.display = "block";
    cityScreen.style.opacity = "0";
    cityScreen.style.transform = "translateY(20px)";

    requestAnimationFrame(() => {
      cityScreen.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      cityScreen.style.opacity = "1";
      cityScreen.style.transform = "translateY(0)";
    });
  }, 300);
}


// old city button setup
// kept here in case normal city buttons are used instead of tiles
function renderCityButtons() {
  document.querySelectorAll(".city-btn").forEach((btn) => {
    btn.addEventListener("click", () => openDaysModal(btn.dataset.city));
  });
}


// builds the category list for the dropdown
function getUniqueCategories() {
  return ["All", ...new Set(attractions.map((a) => a.category))];
}


// creates the category filter UI
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


// applies selected filter and reloads card stack
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


// handles what happens after a swipe
// right = save place   left = skip place
function handleSwipe(direction) {
  const place = filteredAttractions[currentIndex];
  if (!place) return;

  swipeHistory.push({ place, direction });

  if (direction === "right") {
    const alreadyLiked = likedAttractions.some((p) => p.id === place.id);
    if (!alreadyLiked) {
      likedAttractions.push(place);
    }

    saveItinerary();
    updateItineraryDisplay();
  }

  currentIndex++;
  loadCard();
}


// user gets 1 priority star for every 3 liked places
function getMaxPriorities() {
  return Math.floor(likedAttractions.length / 3) || 0;
}


// redraws the itinerary list on the right side
// includes stars badges and remove buttons
function updateItineraryDisplay() {
  const list = document.getElementById("itinerary-list");
  list.innerHTML = "";

  const maxPri = getMaxPriorities();
  const priorities = JSON.parse(localStorage.getItem("priorities") || "[]");

  likedAttractions.forEach((place) => {
    const li = document.createElement("li");

    const name = document.createElement("span");
    name.textContent = place.name;

    const rightSide = document.createElement("span");
    rightSide.style.display = "flex";
    rightSide.style.alignItems = "center";
    rightSide.style.gap = "8px";

    const isPriority = priorities.includes(place.id);
    const currentCount = priorities.filter(id => likedAttractions.some(a => a.id === id)).length;

    const priorityBtn = document.createElement("button");
    priorityBtn.className = "priority-btn" + (isPriority ? " active" : "");
    priorityBtn.textContent = "⭐";
    priorityBtn.title = isPriority ? "Remove from top choices" : "Mark as top choice";
    priorityBtn.onclick = () => {
      let updated = JSON.parse(localStorage.getItem("priorities") || "[]");
      if (updated.includes(place.id)) {
        updated = updated.filter(id => id !== place.id);
      } else {
        const activeCount = updated.filter(id => likedAttractions.some(a => a.id === id)).length;
        if (activeCount >= maxPri) {
          alert("You can mark " + maxPri + " top choice(s) for " + likedAttractions.length + " attractions (1 per 3).");
          return;
        }
        updated.push(place.id);
      }
      localStorage.setItem("priorities", JSON.stringify(updated));
      if (window.TravelSwipeDB) window.TravelSwipeDB.saveCurrentSession();
      updateItineraryDisplay();
    };

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = place.category || "Place";

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "✕";
    removeBtn.title = "Remove from itinerary";
    removeBtn.onclick = () => {
      likedAttractions = likedAttractions.filter((p) => p.id !== place.id);
      let pri = JSON.parse(localStorage.getItem("priorities") || "[]");
      pri = pri.filter(id => id !== place.id);
      localStorage.setItem("priorities", JSON.stringify(pri));
      saveItinerary();
      updateItineraryDisplay();
    };

    rightSide.appendChild(priorityBtn);
    rightSide.appendChild(badge);
    rightSide.appendChild(removeBtn);

    li.appendChild(name);
    li.appendChild(rightSide);
    list.appendChild(li);
  });
}


// adds drag/swipe behaviour to the current card
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
    if (e.target.closest(".learn-more")) return;

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

    // live swipe feedback while dragging
    const progress = Math.min(Math.abs(dx) / SWIPE_THRESHOLD, 1);
    const likeOverlay = document.getElementById("overlay-like");
    const skipOverlay = document.getElementById("overlay-skip");

    if (dx > 0) {
      card.style.boxShadow = `inset 0 0 ${60 * progress}px rgba(34,197,94,${0.25 * progress})`;
      if (likeOverlay) likeOverlay.style.opacity = progress;
      if (skipOverlay) skipOverlay.style.opacity = 0;
    } else if (dx < 0) {
      card.style.boxShadow = `inset 0 0 ${60 * progress}px rgba(239,68,68,${0.25 * progress})`;
      if (skipOverlay) skipOverlay.style.opacity = progress;
      if (likeOverlay) likeOverlay.style.opacity = 0;
    } else {
      card.style.boxShadow = "";
      if (likeOverlay) likeOverlay.style.opacity = 0;
      if (skipOverlay) skipOverlay.style.opacity = 0;
    }
  });

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove("dragging");

    card.style.boxShadow = "";
    const likeOv = document.getElementById("overlay-like");
    const skipOv = document.getElementById("overlay-skip");
    if (likeOv) likeOv.style.opacity = 0;
    if (skipOv) skipOv.style.opacity = 0;

    card.style.transition = "transform 200ms ease";

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


// undoes the last swipe action
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


// saves current selected city and itinerary locally
// and also syncs to firebase if available
function saveItinerary() {
  localStorage.setItem("selectedCity", selectedCity ?? "");
  localStorage.setItem("likedAttractions", JSON.stringify(likedAttractions));

  if (window.TravelSwipeDB) {
    window.TravelSwipeDB.saveCurrentSession();
  }
}


// helper to read liked attractions from storage
function loadItinerary() {
  try {
    return JSON.parse(localStorage.getItem("likedAttractions") || "[]");
  } catch {
    return [];
  }
}


// used when the user clicks a place from the map popup
// jumps back to the matching attraction card
function jumpToAttractionIfRequested() {
  const jumpIdRaw = localStorage.getItem("jumpToAttractionId");
  if (!jumpIdRaw) return;

  const jumpId = Number(jumpIdRaw);
  if (!Number.isFinite(jumpId)) {
    localStorage.removeItem("jumpToAttractionId");
    return;
  }

  const idx = filteredAttractions.findIndex((a) => Number(a.id) === jumpId);

  if (idx >= 0) {
    currentIndex = idx;
  }

  localStorage.removeItem("jumpToAttractionId");
}


// opens the trip days modal before starting a city
function openDaysModal(cityName){
  pendingCity = cityName;

  const modal = document.getElementById("days-modal");
  const input = document.getElementById("tripDays");

  const saved = Number(localStorage.getItem("tripDays"));
  if (Number.isFinite(saved) && saved >= 1) input.value = String(saved);

  modal.style.display = "flex";
}


// closes the trip days modal
function closeDaysModal(){
  const modal = document.getElementById("days-modal");
  modal.style.display = "none";
  pendingCity = null;
}


// confirms day count and starts the selected city
function confirmDaysAndStart(){
  const input = document.getElementById("tripDays");
  const days = Math.max(1, Math.min(14, Number(input.value || 1)));

  tripDays = days;
  localStorage.setItem("tripDays", String(days));

  if (pendingCity) startCity(pendingCity);
  closeDaysModal();
}


// fixed undo button under the card
const undoFixed = document.getElementById("btn-undo-fixed");
if (undoFixed) undoFixed.onclick = () => undoLastSwipe();


// chat assistant setup for the main page
function initChatAssistant(){
  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const messagesEl = document.getElementById("chat-messages");
  const inputEl = document.getElementById("chat-text");
  const sendBtn = document.getElementById("chat-send");
  const suggEl = document.getElementById("chat-suggestions");
  const helpBtn = document.getElementById("chat-help");

  if (helpBtn){
    helpBtn.onclick = () => {
      suggEl.style.display = (suggEl.style.display === "none") ? "flex" : "none";
    };
  }

  if (!fab || !panel || !messagesEl || !inputEl || !sendBtn || !suggEl || !closeBtn) return;

  // predefined questions and answers for the chatbot
  const QA = [
    { q: "How do I swipe?", keywords: ["swipe","like","dislike","left","right"], a: "Swipe right to like a place and add it to your itinerary. Swipe left to skip. You can also use Undo if you make a mistake." },
    { q: "How do I change city?", keywords: ["city","change city","switch city","back"], a: "Click the page title (TravelSwipe: Explore …) to go back to the city selection screen, then choose another city." },
    { q: "How does the category filter work?", keywords: ["filter","category","museum","park"], a: "Use the Category dropdown in the top-right. It will show only places from that category. Choosing 'All' shows everything." },
    { q: "How do I plan multiple days?", keywords: ["days","plan","multiple days","day 1","day 2"], a: "Open the map, set the number of days, then click Apply. The app groups nearby places into the same day so you don't travel back and forth." },
    { q: "What does 'Set Start' do on the map?", keywords: ["start","set start","hotel","starting point"], a: "Set Start lets you pin where you begin (e.g., hotel). The route is then planned starting from that point." },
    { q: "Walking vs Car mode?", keywords: ["car","driving","walking","mode"], a: "Mode changes the route type. Walking uses walking paths. Car uses driving roads and the travel time estimate updates accordingly." },
    { q: "Why is the route order like this?", keywords: ["order","route order","algorithm","optimize"], a: "The app orders stops using a nearest-neighbour route and improves it with a 2-opt step to reduce unnecessary backtracking." },
    { q: "My map shows no route", keywords: ["no route","not showing","error","route missing"], a: "If there are fewer than 2 places in a day, a route won't appear. Also check your internet connection since routing uses an online service." },
    { q: "How do I remove a place from my itinerary?", keywords: ["remove","delete","take off","get rid"], a: "Each place in your itinerary has a small ✕ button on the right side. Click it to remove that attraction from your list." },
    { q: "What are the priority stars?", keywords: ["star","priority","favourite","favorite","top choice"], a: "You can mark your top choices with a ⭐ star. You get 1 star for every 3 attractions you've liked. Starred places get prioritised in the route." },
    { q: "How do I switch theme?", keywords: ["theme","dark","light","night","mode","colour"], a: "Click the moon or sun icon in the top right corner of the page to switch between dark and light mode." },
    { q: "What does Learn more do?", keywords: ["learn more","wikipedia","wiki","read more","info"], a: "The Learn more link on each card opens the Wikipedia page for that attraction in a new tab so you can read more about it." },
    { q: "How many cities are there?", keywords: ["cities","city","how many","which cities","available"], a: "There are currently 4 cities available: London, New York, Tokyo and Krakow. Each has between 10 and 12 attractions." },
    { q: "What does the weather show?", keywords: ["weather","temperature","rain","sun","forecast"], a: "The city selection screen shows live weather for each city using the OpenWeatherMap API. It shows the current temperature and conditions." },
    { q: "How do I remove a place from my itinerary?", keywords: ["remove","delete","take off","get rid"], a: "Each place in your itinerary has a small ✕ button on the right side. Click it to remove that attraction from your list." },
    { q: "What are the priority stars?", keywords: ["star","priority","favourite","favorite","top choice"], a: "You can mark your top choices with a ⭐ star. You get 1 star for every 3 attractions you've liked. Starred places get prioritised in the route." },
    { q: "How do I switch theme?", keywords: ["theme","dark","light","night","mode","colour"], a: "Click the moon or sun icon in the top right corner of the page to switch between dark and light mode." },
    { q: "What does Learn more do?", keywords: ["learn more","wikipedia","wiki","read more","info"], a: "The Learn more link on each card opens the Wikipedia page for that attraction in a new tab so you can read more about it." },
    { q: "How many cities are there?", keywords: ["cities","city","how many","which cities","available"], a: "There are currently 4 cities available: London, New York, Tokyo and Krakow. Each has between 10 and 12 attractions." },
    { q: "What does the weather show?", keywords: ["weather","temperature","rain","sun","forecast"], a: "The city selection screen shows live weather for each city using the OpenWeatherMap API. It shows the current temperature and conditions." },
    { q: "How does the timeline work?", keywords: ["timeline","schedule","day schedule","panel","side"], a: "The timeline panel on the map page shows your stops in order for the selected day, with the distance and estimated travel time between each one." },
    { q: "How does the timeline work?", keywords: ["timeline","schedule","day schedule","panel","side"], a: "The timeline panel on the map page shows your stops in order for the selected day, with the distance and estimated travel time between each one." },
  ];

  // default question chips shown in chat
  const DEFAULT_SUGGESTIONS = ["How do I swipe?","What are the priority stars?","How do I plan multiple days?","How does the timeline work?"];

  // adds a message bubble into the chat window
  function addBubble(text, who){
    const div = document.createElement("div");
    div.className = "chat-bubble " + who;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // finds the best answer for what the user typed
  function bestAnswer(userText){
    const t = (userText || "").toLowerCase();
    const liked = JSON.parse(localStorage.getItem("likedAttractions") || "[]");
    const city = localStorage.getItem("selectedCity") || "this city";

    if (t.includes("saved") || t.includes("how many") || t.includes("places")) {
      return "You currently have " + liked.length + " saved places in " + city + ". Open the map to generate your itinerary.";
    }

    const exact = QA.find(x => x.q.toLowerCase() === t);
    if (exact) return exact.a;

    let best = null, bestScore = 0;
    for (const item of QA){
      let score = 0;
      for (const kw of item.keywords){ if (t.includes(kw)) score++; }
      if (score > bestScore){ bestScore = score; best = item; }
    }

    if (best && bestScore >= 1) return best.a;

    return "I can help with swiping, filters, map days, start point, and walking/car mode. Try one of the suggested questions below.";
  }

  // shows the suggested question buttons
  function renderSuggestions(){
    suggEl.innerHTML = "";
    DEFAULT_SUGGESTIONS.forEach((label) => {
      const b = document.createElement("button");
      b.className = "chat-chip";
      b.textContent = label;
      b.onclick = () => { addBubble(label,"user"); addBubble(bestAnswer(label),"bot"); suggEl.style.display = "none"; };
      suggEl.appendChild(b);
    });
  }

  // opens the chat panel
  function openChat(){
    panel.style.display = "flex";
    renderSuggestions();
    if (messagesEl.childElementCount === 0){ addBubble("Hi! I'm the TravelSwipe Assistant. Ask me how to use the app.","bot"); }
    inputEl.focus();
  }

  // closes the chat panel
  function closeChat(){ panel.style.display = "none"; }

  // sends user message and bot reply
  function send(){
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = "";
    addBubble(text,"user");
    addBubble(bestAnswer(text),"bot");
  }

  fab.addEventListener("click", () => {
    if (panel.style.display === "none" || !panel.style.display) openChat();
    else closeChat();
  });

  closeBtn.addEventListener("click", closeChat);
  sendBtn.addEventListener("click", send);

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
    if (e.key === "Escape") closeChat();
  });
}


// shows the tutorial overlay
function showTutorialIfNeeded() {
  const overlay = document.getElementById("tutorial-overlay");
  if (overlay) overlay.style.display = "flex";
}


// hides the tutorial overlay
function dismissTutorial() {
  const overlay = document.getElementById("tutorial-overlay");
  if (overlay) overlay.style.display = "none";
}




// app startup
// restores session, wires main buttons and starts chat
window.onload = async () => {
  console.log("[TravelSwipe] boot ✅");

  if (window.TravelSwipeDB) {
    await window.TravelSwipeDB.restoreSessionToLocalStorage();
  }

  const mapBtn = document.getElementById("btn-map");
  if (mapBtn) {
    mapBtn.addEventListener("click", () => (window.location.href = "map.html"));
  }

  const title = document.getElementById("page-title");
  if (title) {
    title.style.cursor = "pointer";
    title.addEventListener("click", goBackToCitySelection);
  }

  document.addEventListener("click", (e) => {
    const cityBtn = e.target.closest(".city-tile") || e.target.closest(".city-btn");
    if (!cityBtn || cityBtn.disabled) return;
    try {
      openDaysModal(cityBtn.dataset.city);
    } catch (err) {
      console.error(err);
      alert("Error starting city. Check Console for details.");
    }
  });

  initChatAssistant();
};




// applies dark or light theme and updates icon
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const btn = document.getElementById("btn-theme");
  if (btn) btn.textContent = theme === "light" ? "☀️" : "🌙";
}


// load saved theme when script starts
const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);


// theme toggle button listener
const themeBtn = document.getElementById("btn-theme");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const current = localStorage.getItem("theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}



/*
========================================
main.js content order
========================================

1. global state variables
2. image preloading helpers
3. card loading and end screen
4. city start and return to city screen
5. category filter setup
6. swipe handling logic
7. itinerary display and priority stars
8. undo and storage helpers
9. jump back from map to a specific attraction
10. trip days modal
11. chat assistant
12. tutorial open / close
13. page startup
14. theme setup and toggle

*/