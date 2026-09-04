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

  function renderAdminPanel() {
    const { currentId } = StatusStore.getStatus();
    const { current, next } = resolveCurrentAndNext(currentId);

    document.getElementById("admin-current-name").textContent = current
      ? current.name
      : "Not started yet";
    document.getElementById("admin-next-name").textContent = next
      ? next.name
      : current
      ? "All done!"
      : "—";

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
        renderAdminPanel();
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
    renderAdminPanel();
    StatusStore.subscribe(renderAdminPanel);
  }

  document.getElementById("reset-status-btn").addEventListener("click", () => {
    StatusStore.clearStatus();
    renderAdminPanel();
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
    const hashed = await hashText(value);
    if (hashed === CONFIG.ADMIN_PASSWORD_HASH) {
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
