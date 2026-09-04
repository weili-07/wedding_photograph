// ---------------------------------------------------------------
// config.js
// Site-wide settings. Edit these values to customize the site.
// ---------------------------------------------------------------
const CONFIG = {
  // Turns the "Now Photographing / Up Next" live status feature on or off.
  // Set this to false if there's no one running the admin page (e.g. you
  // haven't found an admin yet) - the site will then just show the plain
  // group list with no current/next banner and no admin controls.
  // This is a compile-time (source code) switch - just edit and re-deploy.
  ENABLE_LIVE_STATUS: true,

  // Hashed admin password for coordinate.html (not stored in plain text so
  // it isn't readable at a glance). To change the password, have this value
  // regenerated for the new password rather than editing it by hand.
  //
  // NOTE: this is still not strong security - this is a static site, so
  // anyone with the source code could still try to brute-force a
  // short/guessable password offline. It just stops the password from
  // being visible at a glance. Don't reuse a sensitive password here.
  ADMIN_PASSWORD_HASH: "176a4270a9a37e7fbbabafe2fe0eca50d9da68b7ad88d30f876a1fd5b9d679cf",

  // Shown as the page title / heading on the public page.
  SITE_TITLE: "Wedding Photo Shoot Arrangement",
};
