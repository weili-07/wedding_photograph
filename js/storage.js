// ---------------------------------------------------------------
// storage.js
// Shared "current group" status, and the admin password check.
//
// If js/firebase-config.js has been filled in with a real Firebase
// project, both of these sync LIVE across every device/browser via
// Firebase Realtime Database - updates appear instantly with no manual
// page refresh, since Firebase keeps a live connection open. Until then,
// status automatically falls back to localStorage + BroadcastChannel
// (still updates instantly, but only across tabs on the SAME
// browser/device), and the password check falls back to the hash baked
// into js/config.js.
//
// Callers use the same API either way:
//   StatusStore.subscribe(callback)   - callback(status) fires immediately
//                                       with the current value, and again
//                                       every time it changes. No polling
//                                       or manual refresh needed.
//   StatusStore.setStatus(status)     - update the shared status.
//   StatusStore.clearStatus()         - reset to "not started".
//   StatusStore.isLive                - true if synced via Firebase,
//                                       false if same-device-only.
// ---------------------------------------------------------------
const FIREBASE_ENABLED =
  typeof FIREBASE_CONFIG !== "undefined" &&
  typeof firebase !== "undefined" &&
  !!FIREBASE_CONFIG.apiKey &&
  !FIREBASE_CONFIG.apiKey.startsWith("PASTE_");

let firebaseDb = null;
if (FIREBASE_ENABLED) {
  const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
  firebaseDb = firebase.database(firebaseApp);
}

const StatusStore = (() => {
  const STATUS_PATH = "wedding_current_status_v1";

  if (FIREBASE_ENABLED) {
    // ----- Firebase Realtime Database backend (syncs across devices) -----
    const statusRef = firebaseDb.ref(STATUS_PATH);

    function setStatus(status) {
      statusRef.set(status);
    }

    function clearStatus() {
      setStatus({ currentId: null });
    }

    function subscribe(callback) {
      statusRef.on("value", (snapshot) => {
        callback(snapshot.val() || { currentId: null });
      });
    }

    return { setStatus, clearStatus, subscribe, isLive: true };
  }

  // ----- localStorage fallback (same browser/device only) -----
  const STORAGE_KEY = STATUS_PATH;
  const CHANNEL_NAME = "wedding_status_channel";
  const listeners = [];

  let channel = null;
  if (typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }

  function readLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { currentId: null };
      const parsed = JSON.parse(raw);
      if (typeof parsed.currentId === "undefined") return { currentId: null };
      return parsed;
    } catch (e) {
      return { currentId: null };
    }
  }

  function notifyListeners(status) {
    listeners.forEach((cb) => cb(status));
  }

  function setStatus(status) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
    if (channel) channel.postMessage(status);
    // The native storage/BroadcastChannel events don't fire in the SAME
    // tab that made the change, so notify this tab's own listeners too.
    notifyListeners(status);
  }

  function clearStatus() {
    setStatus({ currentId: null });
  }

  function subscribe(callback) {
    listeners.push(callback);
    callback(readLocal());
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) callback(readLocal());
    });
    if (channel) {
      channel.onmessage = (e) => callback(e.data);
    }
  }

  return { setStatus, clearStatus, subscribe, isLive: false };
})();

// Returns a Promise resolving to the admin password hash to check a login
// attempt against. Reads from Firebase first (if configured) so the
// password can be rotated from the Firebase console without redeploying;
// falls back to the hash hardcoded in js/config.js otherwise (or if the
// Firebase value hasn't been set).
function fetchAdminPasswordHash() {
  if (FIREBASE_ENABLED) {
    return firebaseDb
      .ref("wedding_admin_password_hash")
      .once("value")
      .then((snapshot) => snapshot.val() || CONFIG.ADMIN_PASSWORD_HASH)
      .catch(() => CONFIG.ADMIN_PASSWORD_HASH);
  }
  return Promise.resolve(CONFIG.ADMIN_PASSWORD_HASH);
}

// Given a current group id, find the current + next group objects from
// PHOTO_GROUPS (next = the item right after current in array order).
function resolveCurrentAndNext(currentId) {
  if (currentId === null || typeof currentId === "undefined") {
    return { current: null, next: null };
  }
  const idx = PHOTO_GROUPS.findIndex((g) => g.id === currentId);
  if (idx === -1) return { current: null, next: null };
  const current = PHOTO_GROUPS[idx];
  const next = idx + 1 < PHOTO_GROUPS.length ? PHOTO_GROUPS[idx + 1] : null;
  return { current, next };
}
