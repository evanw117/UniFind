// src/data/lost-items.ts

export type LostItem = {
  id: string;
  campusSlug: "atu-galway" | "nuig-galway";
  title: string;
  description?: string;
  locationHint?: string;     // where it was last seen
  when?: string;             // ISO date
  image?: string;            // public path (optional)
};

export const LOST_ITEMS: LostItem[] = [
  {
    id: "atu-1",
    campusSlug: "atu-galway",
    title: "Black Wallet",
    description: "Leather wallet with ATM and student cards.",
    locationHint: "Library ground floor",
    when: "2025-11-08",
    image: "/file.svg",
  },
  {
    id: "atu-2",
    campusSlug: "atu-galway",
    title: "Calculator (Casio FX-991EX)",
    description: "Name ‘Evan’ on the back with a sticker.",
    locationHint: "E-block classroom",
    when: "2025-11-06",
  },
  {
    id: "nuig-1",
    campusSlug: "nuig-galway",
    title: "White Earbuds",
    description: "In a small square case.",
    locationHint: "Concourse seating",
    when: "2025-11-07",
  },
  {
    id: "nuig-2",
    campusSlug: "nuig-galway",
    title: "Navy Hoodie",
    description: "UG crest; medium size.",
    locationHint: "Engineering building",
    when: "2025-11-05",
    image: "/globe.svg",
  },
];
