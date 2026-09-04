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

  function renderLiveStatus() {
    const section = document.getElementById("live-status");

    if (!CONFIG.ENABLE_LIVE_STATUS) {
      section.hidden = true;
      renderGroupList(null);
      return;
    }

    section.hidden = false;
    const { currentId } = StatusStore.getStatus();
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

  renderLiveStatus();

  if (CONFIG.ENABLE_LIVE_STATUS) {
    StatusStore.subscribe(renderLiveStatus);
  }
})();
