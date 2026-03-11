// Firebase setup + anonymous session storage

const firebaseConfig = {
  apiKey: "AIzaSyDu5jtOKChkc6MTS7f4wyc28yTcFk76AUU",
  authDomain: "travelswipe-b2a56.firebaseapp.com",
  projectId: "travelswipe-b2a56",
  storageBucket: "travelswipe-b2a56.firebasestorage.app",
  messagingSenderId: "773410174037",
  appId: "1:773410174037:web:96eb0d76e178ace0f7d0dc"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function createAnonymousSessionId() {
  if (window.crypto && window.crypto.randomUUID) {
    return "ts_" + window.crypto.randomUUID();
  }
  return "ts_" + Math.random().toString(36).slice(2) + "_" + Date.now();
}

function getOrCreateSessionId() {
  let sessionId = localStorage.getItem("travelSwipeSessionId");
  if (!sessionId) {
    sessionId = createAnonymousSessionId();
    localStorage.setItem("travelSwipeSessionId", sessionId);
  }
  return sessionId;
}

function getCurrentSessionData() {
  return {
    sessionId: getOrCreateSessionId(),
    selectedCity: localStorage.getItem("selectedCity") || "",
    likedAttractions: JSON.parse(localStorage.getItem("likedAttractions") || "[]"),
    tripDays: Number(localStorage.getItem("tripDays") || "1"),
    travelMode: localStorage.getItem("travelMode") || "walking",
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };
}

async function saveCurrentSession() {
  const sessionId = getOrCreateSessionId();
  const payload = getCurrentSessionData();

  try {
    await db.collection("sessions").doc(sessionId).set(payload, { merge: true });
    console.log("Session saved to Firestore:", sessionId);
  } catch (err) {
    console.error("Error saving session:", err);
  }
}

async function restoreSessionToLocalStorage() {
  const sessionId = getOrCreateSessionId();

  try {
    const doc = await db.collection("sessions").doc(sessionId).get();

    if (!doc.exists) return null;

    const data = doc.data();

    if (typeof data.selectedCity === "string") {
      localStorage.setItem("selectedCity", data.selectedCity);
    }

    if (Array.isArray(data.likedAttractions)) {
      localStorage.setItem("likedAttractions", JSON.stringify(data.likedAttractions));
    }

    if (data.tripDays !== undefined && data.tripDays !== null) {
      localStorage.setItem("tripDays", String(data.tripDays));
    }

    if (typeof data.travelMode === "string") {
      localStorage.setItem("travelMode", data.travelMode);
    }

    return data;
  } catch (err) {
    console.error("Error restoring session:", err);
    return null;
  }
}

window.TravelSwipeDB = {
  getOrCreateSessionId,
  saveCurrentSession,
  restoreSessionToLocalStorage
};