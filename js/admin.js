// ---------------------------------------------------------------
// admin.js - admin page logic (coordinate.html)
// ---------------------------------------------------------------
(function () {
  const SESSION_KEY = "wedding_admin_authed";

  const loginSection = document.getElementById("login-section");
  const adminPanel = document.getElementById("admin-panel");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const featureDisabledMsg = document.getElementById("feature-disabled-msg");
  const adminControls = document.getElementById("admin-controls");

  function renderAdminPanel(status) {
    const currentId = status ? status.currentId : null;
    const { current, next } = resolveCurrentAndNext(currentId);

    document.getElementById("admin-current-name").textContent = current
      ? current.name
      : "Not started yet";
    document.getElementById("admin-next-name").textContent = next
      ? next.name
      : current
      ? "All done!"
      : "—";

    const syncNote = document.getElementById("sync-mode-note");
    if (syncNote) {
      syncNote.textContent = StatusStore.isLive
        ? "Live sync is ON - updates reach every device instantly."
        : "Live sync is OFF - only updates browsers/tabs on this device (Firebase not configured).";
      syncNote.classList.toggle("sync-live", StatusStore.isLive);
      syncNote.classList.toggle("sync-local", !StatusStore.isLive);
    }

    const container = document.getElementById("admin-group-list");
    container.innerHTML = "";

    let lastCategory = null;
    PHOTO_GROUPS.forEach((group) => {
      if (group.category !== lastCategory) {
        const heading = document.createElement("h3");
        heading.className = "category-heading";
        heading.textContent = group.category;
        container.appendChild(heading);
        lastCategory = group.category;
      }

      const row = document.createElement("button");
      row.type = "button";
      row.className = "group-row group-row-btn";
      if (group.id === currentId) row.classList.add("is-current");
      row.textContent = group.name;
      row.addEventListener("click", () => {
        StatusStore.setStatus({ currentId: group.id });
      });
      container.appendChild(row);
    });
  }

  function showAdminPanel() {
    loginSection.hidden = true;
    adminPanel.hidden = false;

    if (!CONFIG.ENABLE_LIVE_STATUS) {
      featureDisabledMsg.hidden = false;
      adminControls.hidden = true;
      return;
    }

    featureDisabledMsg.hidden = true;
    adminControls.hidden = false;
    // subscribe() calls back immediately with the current value, then again
    // every time it changes - the panel updates live with no manual page
    // refresh needed.
    StatusStore.subscribe(renderAdminPanel);
  }

  document.getElementById("reset-status-btn").addEventListener("click", () => {
    StatusStore.clearStatus();
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });

  // Hashes text via the browser's built-in Web Crypto API and returns it as
  // a lowercase hex string, so we never have to compare/store the plain
  // password itself.
  async function hashText(text) {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const value = document.getElementById("password").value;
    // Checks against Firebase first (if configured), falling back to the
    // hash hardcoded in js/config.js otherwise - see fetchAdminPasswordHash
    // in storage.js.
    const [hashed, expectedHash] = await Promise.all([
      hashText(value),
      fetchAdminPasswordHash(),
    ]);
    if (hashed === expectedHash) {
      sessionStorage.setItem(SESSION_KEY, "1");
      loginError.hidden = true;
      showAdminPanel();
    } else {
      loginError.hidden = false;
    }
  });

  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    showAdminPanel();
  }
})();
