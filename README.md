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
  regenerated for the new password rather than editing it by hand. This is
  used as a fallback - if Firebase is connected (see below) and a
  `wedding_admin_password_hash` value exists there, that takes priority
  instead, so the password can be rotated from the Firebase console
  without redeploying.
- `SITE_TITLE` - page title/heading shown on the public page.

## Admin access

Go to `coordinate.html` and enter the password. Once logged in for that
browser tab/session, click any group in the list to mark it as the current
group. The change appears immediately everywhere with no page refresh
needed - instantly on every device once Firebase is connected (see below),
or instantly across tabs on this device otherwise. "Up Next" is worked out
automatically as the next item in the list. Use "Reset / Clear Status" to
go back to "Not started yet".

## Live sync across every device (optional Firebase setup)

By default (no setup needed), the current-group status and the admin
password check both only use this browser/device. To make the status
update live on **everyone's own phone** - with no manual refresh, since
Firebase keeps a live connection open and pushes changes the instant they
happen - and to allow rotating the admin password from the Firebase
console without redeploying, connect a free Firebase Realtime Database. No
server or paid plan needed.

1. Go to <https://console.firebase.google.com/> and create a new project
   (Google Analytics isn't needed for this - you can turn it off).
2. In the project, open **Build → Realtime Database** and click
   **Create Database**.
3. Choose a location, choose **Locked mode** for the starting rules (we'll
   set proper rules next), then click **Enable**.
4. Open the **Rules** tab of the Realtime Database and replace the rules
   with:

   ```json
   {
     "rules": {
       ".read": false,
       ".write": false,
       "wedding_current_status_v1": {
         ".read": true,
         ".write": true
       },
       "wedding_admin_password_hash": {
         ".read": true,
         ".write": false
       }
     }
   }
   ```

   Click **Publish**. This only opens up the one status value (read and
   write, since the admin page needs to update it) and the password hash
   (read-only from the site - you can still change it directly in the
   Firebase console's Data tab, just not website visitors).
5. Go to **Project settings** (gear icon) → **General** tab → scroll to
   **Your apps** → click the **</>** (Web) icon → give it any nickname →
   **Register app** (Firebase Hosting isn't needed).
6. Firebase shows a `firebaseConfig` object - copy those values into
   [`js/firebase-config.js`](js/firebase-config.js), replacing the
   `"PASTE_ME"` placeholders. These values aren't secret - access is
   controlled by the rules above, not by hiding this config, so it's fine
   to commit them.
7. *(Optional)* To store the admin password in Firebase instead of relying
   only on the hash in `js/config.js`: in the Realtime Database **Data**
   tab, add a new key `wedding_admin_password_hash` with the hash as its
   value (generate it with the browser-console snippet mentioned in the
   Settings section above). Update this value any time from the console to
   rotate the password without touching the code.
8. Refresh the site - it automatically detects the config and switches to
   live sync. The admin page shows whether live sync is currently on or
   off.

## Important limitations

- **Password protection is basic.** Because this is a static site, the
  password check happens in the browser. Only a *hash* of the password is
  used (not the plain password), whether it comes from `js/config.js` or
  the optional Firebase value, so it isn't readable at a glance - but
  someone could still get hold of that hash (from the source, or from the
  network request if using Firebase) and try to brute-force a
  short/guessable password offline. It only keeps casual visitors out - do
  not reuse a sensitive password.
- **The current/next status only syncs across every device once you've set
  up the optional Firebase connection above.** Without it, status only
  syncs within the same browser (e.g. multiple tabs open on one
  laptop/kiosk), using `localStorage`.

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
