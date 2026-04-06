// firebase setup for saving session data in the cloud
// this lets the app remember a users choices even after refresh or coming back later

const firebaseConfig = {
  apiKey: "AIzaSyDu5jtOKChkc6MTS7f4wyc28yTcFk76AUU",
  authDomain: "travelswipe-b2a56.firebaseapp.com",
  projectId: "travelswipe-b2a56",
  storageBucket: "travelswipe-b2a56.firebasestorage.app",
  messagingSenderId: "773410174037",
  appId: "1:773410174037:web:96eb0d76e178ace0f7d0dc"
};


// start firebase and connect to firestore database
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// makes a random anonymous session id
// this is used instead of user accounts
function createAnonymousSessionId() {
  if (window.crypto && window.crypto.randomUUID) {
    return "ts_" + window.crypto.randomUUID();
  }

  // fallback if randomUUID is not available
  return "ts_" + Math.random().toString(36).slice(2) + "_" + Date.now();
}


// gets the existing session id from localStorage
// if there isnt one yet it creates a new one and saves it
function getOrCreateSessionId() {
  let sessionId = localStorage.getItem("travelSwipeSessionId");

  if (!sessionId) {
    sessionId = createAnonymousSessionId();
    localStorage.setItem("travelSwipeSessionId", sessionId);
  }

  return sessionId;
}


// collects the current state of the app
// this is the data that gets pushed to firestore
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


// saves the current session into the firestore sessions collection
// merge true means it updates the existing document instead of replacing everthing
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


// reads saved session data from firestore
// then puts it back into localStorage so the rest of the app can use it normally
async function restoreSessionToLocalStorage() {
  const sessionId = getOrCreateSessionId();

  try {
    const doc = await db.collection("sessions").doc(sessionId).get();

    // if no saved session exists just stop here
    if (!doc.exists) return null;

    const data = doc.data();

    // restore selected city if valid
    if (typeof data.selectedCity === "string") {
      localStorage.setItem("selectedCity", data.selectedCity);
    }

    // restore liked attractions if valid
    if (Array.isArray(data.likedAttractions)) {
      localStorage.setItem("likedAttractions", JSON.stringify(data.likedAttractions));
    }

    // restore trip length
    if (data.tripDays !== undefined && data.tripDays !== null) {
      localStorage.setItem("tripDays", String(data.tripDays));
    }

    // restore travel mode like walking or driving
    if (typeof data.travelMode === "string") {
      localStorage.setItem("travelMode", data.travelMode);
    }

    return data;
  } catch (err) {
    console.error("Error restoring session:", err);
    return null;
  }
}


// expose these helper functions globally
// so main.js and map.html can call them
window.TravelSwipeDB = {
  getOrCreateSessionId,
  saveCurrentSession,
  restoreSessionToLocalStorage
};