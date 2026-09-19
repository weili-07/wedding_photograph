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
  { id: 1, category: "Photo Groups", name: "Groom Direct Family" },
  { id: 2, category: "Photo Groups", name: "Groom Extended Family" },
  { id: 3, category: "Photo Groups", name: "Bride Direct Family" },
  { id: 4, category: "Photo Groups", name: "Bride Parental Extended Family" },
  { id: 5, category: "Photo Groups", name: "Bride Maternal Extended Family" },
  { id: 6, category: "Photo Groups", name: "Groomsmen" },
  { id: 7, category: "Photo Groups", name: "Bridesmaids" },
  { id: 8, category: "Photo Groups", name: "Groomsmen & Bridesmaids" },
  { id: 9, category: "Photo Groups", name: "Wedding Team" },
  { id: 10, category: "Photo Groups", name: "Lap Sap Heng Dai" },
  { id: 11, category: "Photo Groups", name: "UTM friends" },
  { id: 12, category: "Photo Groups", name: "USM coursemates" },
  { id: 13, category: "Photo Groups", name: "Faith & Chills Girls + FED + Vonosaur" },
  { id: 14, category: "Photo Groups", name: "CGL friends" },
  { id: 15, category: "Photo Groups", name: "Musica Sinfonietta" },
  { id: 16, category: "Photo Groups", name: "ENCP Leaders" },
  { id: 17, category: "Photo Groups", name: "ENCP LG (Tropicana/Middleton)" },
  { id: 18, category: "Photo Groups", name: "ENCP Teens" },
  { id: 19, category: "Photo Groups", name: "Other ENCP" },
  { id: 20, category: "Photo Groups", name: "428" },
  { id: 21, category: "Photo Groups", name: "Mixed Signal" },
  { id: 22, category: "Photo Groups", name: "Platform SW & HW" },
  { id: 23, category: "Photo Groups", name: "ex-NIer" },
  { id: 24, category: "Photo Groups", name: "Other Friends" },
  { id: 25, category: "Photo Groups", name: "GHA" },
  { id: 26, category: "Photo Groups", name: "Bride Family Friends" },
];

