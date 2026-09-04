// ---------------------------------------------------------------
// storage.js
// Shared "current group" status.
//
// Synced across tabs/windows in the SAME browser via localStorage
// plus BroadcastChannel (e.g. the admin page and the public page open
// as two tabs on one laptop/kiosk will stay in sync instantly).
//
// NOTE - LIMITATION: this does NOT sync across different devices or
// phones. Each visitor's own phone will only show whatever was last
// set on THAT phone's browser. If you need every guest's phone to
// update live from one admin action, you would need a small backend
// (e.g. Firebase). This file is kept separate/self-contained so a
// real backend could be swapped in here later without touching the
// rest of the code.
// ---------------------------------------------------------------
const StatusStore = (() => {
  const STORAGE_KEY = "wedding_current_status_v1";
  const CHANNEL_NAME = "wedding_status_channel";

  let channel = null;
  if (typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }

  function getStatus() {
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

  function setStatus(status) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
    if (channel) channel.postMessage(status);
  }

  function clearStatus() {
    setStatus({ currentId: null });
  }

  function subscribe(callback) {
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) callback(getStatus());
    });
    if (channel) {
      channel.onmessage = (e) => callback(e.data);
    }
  }

  return { getStatus, setStatus, clearStatus, subscribe };
})();

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
