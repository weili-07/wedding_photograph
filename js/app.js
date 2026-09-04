// ---------------------------------------------------------------
// app.js - public/guest-facing page logic (index.html)
// ---------------------------------------------------------------
(function () {
  document.getElementById("site-title").textContent = CONFIG.SITE_TITLE;
  document.title = CONFIG.SITE_TITLE;

  function renderGroupList(currentId) {
    const container = document.getElementById("group-list");
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

      const row = document.createElement("div");
      row.className = "group-row";
      if (CONFIG.ENABLE_LIVE_STATUS && group.id === currentId) {
        row.classList.add("is-current");
      }
      row.textContent = group.name;
      container.appendChild(row);
    });
  }

  function renderLiveStatus(status) {
    const section = document.getElementById("live-status");

    if (!CONFIG.ENABLE_LIVE_STATUS) {
      section.hidden = true;
      renderGroupList(null);
      return;
    }

    section.hidden = false;
    const currentId = status ? status.currentId : null;
    const { current, next } = resolveCurrentAndNext(currentId);

    document.getElementById("current-group-name").textContent = current
      ? current.name
      : "Not started yet";
    document.getElementById("next-group-name").textContent = next
      ? next.name
      : current
      ? "All done!"
      : "—";

    renderGroupList(currentId);
  }

  // subscribe() calls back immediately with the current value, then again
  // every time it changes - so this stays live with no manual page refresh
  // needed (instantly on every device when Firebase is configured, or
  // instantly across tabs on this device otherwise).
  if (CONFIG.ENABLE_LIVE_STATUS) {
    StatusStore.subscribe(renderLiveStatus);
  } else {
    renderLiveStatus(null);
  }
})();
