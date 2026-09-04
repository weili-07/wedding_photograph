# Wedding Photo Shoot Arrangement

A simple static webpage to help organize the family/group photo order at the
wedding. Built with plain HTML, CSS and JavaScript - no build step, no
dependencies - so it can be hosted directly on GitHub Pages.

## Pages

- `index.html` - public page guests can view. Shows the full photo group
  list, and (optionally) which group is currently being photographed and
  who's up next.
- `coordinate.html` - password-protected page for the photographer/coordinator
  to set which group is currently being photographed. It is not linked from
  anywhere on the site - share the URL directly with whoever is running it.

## Editing the group list

Open [`js/data.js`](js/data.js) and edit the `PHOTO_GROUPS` array. Each entry
looks like:

```js
{ id: 1, category: "Groom's Direct Family", name: "Groom + Parents" }
```

- `id` - must be unique. Don't reuse an id once the event has started (the
  "current group" is remembered by its id).
- `category` - used as a section heading to group related rows together.
- `name` - the label shown on the page.

The order of items in the array is the photo-taking order, used to work out
"Up Next".

## Settings

Open [`js/config.js`](js/config.js) to change:

- `ENABLE_LIVE_STATUS` - `true`/`false`. Turns the "Now Photographing / Up
  Next" section on or off (compile-time switch - edit the source and
  re-deploy). Set to `false` if no one will be running the admin page yet -
  the site will then just show the plain group list, and the admin page will
  show a "disabled" notice instead of controls.
- `ADMIN_PASSWORD_HASH` - a hashed version of the admin password for
  `coordinate.html`, so the real password isn't sitting in plain text in the
  source code. To change the password, ask for `ADMIN_PASSWORD_HASH` to be
  regenerated for the new password rather than editing it by hand.
- `SITE_TITLE` - page title/heading shown on the public page.

## Admin access

Go to `coordinate.html` and enter the password. Once logged in for that
browser tab/session, click any group in the list to mark it as the current group.
"Up Next" is worked out automatically as the next item in the list. Use
"Reset / Clear Status" to go back to "Not started yet".

## Important limitations

- **Password protection is basic.** Because this is a static site, the
  password check happens in the browser. Only a *hash* of the password is
  stored in the source (not the plain password), so it isn't readable at a
  glance - but someone with the source code could still try to brute-force a
  short/guessable password offline. It only keeps casual visitors out - do
  not reuse a sensitive password.
- **The current/next status only syncs within the same browser** (e.g.
  multiple tabs open on one laptop/kiosk), using `localStorage`. It does
  **not** sync automatically across different phones/devices. If you need
  every guest's own phone to update live from one admin action, you would
  need to add a small backend (e.g. Firebase) - this can be added later
  without redesigning the site.

## Deploying to GitHub Pages

1. Create a new GitHub repository and push these files to it.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select
   the `main` branch and `/ (root)` folder, then **Save**.
4. After a minute, your site will be live at
   `https://<your-username>.github.io/<repo-name>/`.
5. The admin page will be at
   `https://<your-username>.github.io/<repo-name>/coordinate.html`.

## Running locally

Just open `index.html` directly in a browser - everything runs client-side.
