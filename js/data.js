// ---------------------------------------------------------------
// data.js
// EDIT ME: this is the full list of photo groups.
//
// Just add, remove or rename entries below - the page updates
// automatically. Each entry looks like:
//
//   { id: 1, category: "Groom's Direct Family", name: "Groom + Parents" }
//
//   id       - a unique number. Never reuse an id once the event has
//              started (the "current group" is remembered by its id).
//   category - section heading used to group related rows together
//              on the page (rows with the same category are grouped).
//   name     - the label shown on the page for this photo group.
//
// The ORDER of items in this array is the photo-taking order, and is
// used to work out "Up Next" (the item right after the current one).
// ---------------------------------------------------------------
const PHOTO_GROUPS = [
  { id: 1, category: "Groom's Direct Family", name: "Groom alone" },
  { id: 2, category: "Groom's Direct Family", name: "Groom + Parents" },
  { id: 3, category: "Groom's Direct Family", name: "Groom + Parents + Siblings" },
  { id: 4, category: "Groom's Extended Family", name: "Groom + Grandparents" },
  { id: 5, category: "Groom's Extended Family", name: "Groom + Aunts & Uncles" },
  { id: 6, category: "Groom's Extended Family", name: "Groom + Cousins" },
  { id: 7, category: "Bride's Direct Family", name: "Bride alone" },
  { id: 8, category: "Bride's Direct Family", name: "Bride + Parents" },
  { id: 9, category: "Bride's Direct Family", name: "Bride + Parents + Siblings" },
  { id: 10, category: "Bride's Extended Family", name: "Bride + Grandparents" },
  { id: 11, category: "Bride's Extended Family", name: "Bride + Aunts & Uncles" },
  { id: 12, category: "Bride's Extended Family", name: "Bride + Cousins" },
  { id: 13, category: "Couple", name: "Bride & Groom together" },
  { id: 14, category: "Friends", name: "Groom's Friends" },
  { id: 15, category: "Friends", name: "Bride's Friends" },
  { id: 16, category: "Everyone", name: "Full Group Photo" },
];
