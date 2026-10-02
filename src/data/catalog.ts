import images from "./catalog-images.json";

export type Img = { src: string; w: number; h: number };
export type Variant = { label: string; image: Img };
export type Design = {
  slug: string;
  name: string;
  quoteName: string; // the name in the quote form; tells a bedwrapper from the play-screen of the same name
  tagline: string;
  description: string;
  price?: string;
  hero: Img;
  variants: Variant[]; // main + 2 more
  rooms: Img[]; // in a hotel room
};
export type Section = {
  slug: string;
  name: string;
  kicker: string;
  intro: string;
  items: Design[];
  world?: { city: string; note: string; image: Img }[]; // "Around the world" strip under the cards
};

const shots = images as Record<string, (Img | null)[]>;

/** Placeholder images: hero, v2, v3, then room shots. The owner replaces these later. */
function design(
  section: string,
  slug: string,
  name: string,
  tagline: string,
  description: string,
  labels: [string, string, string],
  price?: string,
): Design {
  const [hero, v2, v3, ...rooms] = shots[`${section}/${slug}`];
  return {
    slug,
    name,
    quoteName: section === "bedwrappers" ? `${name} bedwrapper` : name,
    tagline,
    description,
    price: price ?? "Price on enquiry",
    hero: hero as Img,
    // null entries in catalog-images.json mark a slot with no approved image yet
    variants: [
      { label: labels[0], image: hero },
      { label: labels[1], image: v2 },
      { label: labels[2], image: v3 },
    ].filter((v): v is Variant => v.image !== null),
    rooms: rooms.filter((r): r is Img => r !== null),
  };
}

const ST = ["Front", "Back", "In a room"] as [string, string, string];

export const sections: Section[] = [
  {
    slug: "standard",
    name: "The Collection",
    kicker: "Standard models",
    intro:
      "Twelve themed worlds, ready to ship. Each one unfolds into a play area in minutes and packs flat when the guests check out.",
    items: [
      design("standard", "castle", "Castle", "Standard edition", "A fortress of imagination stands tall. Perfect for kids who believe every room should come with a throne.", ["Front", "Back", "In a room"], "From £1,150"),
      design("standard", "castle-xl", "Castle XL", "Grand edition", "The castle, scaled up for lobbies, kids clubs and events. Room inside for a whole group of little knights.", ["Front", "Back", "In a lobby"]),
      design("standard", "birthday", "Birthday", "Celebration time", "An explosion of colour and fun for a birthday surprise. No glitter or confetti needed.", ST, "From £995"),
      design("standard", "marine", "Marine Life", "Underwater kingdom", "Starfish, manta rays and coral gardens: the wonders of the sea on dry land.", ["Front", "Back", "Bali edition"], "From £995"),
      design("standard", "princess", "Princess Palace", "Fairytale magic", "For children who dream of glass slippers and enchanted forests.", ["Front", "Back", "In a suite"], "From £995"),
      design("standard", "space", "Spaceship", "Mission control", "For children who dream of touching the stars. Sends space adventurers zooming into orbit.", ["Front", "Back", "In a room"], "From £995"),
      design("standard", "police", "Police Station", "On patrol", "Blue lights, a patrol car and a lookout tower. Little officers keep the suite safe and sound.", ["With a cadet", "Studio", "On duty"]),
      design("standard", "fire-station", "Fire Station", "To the rescue", "A red fire engine, a bell tower and big arched doors. Ready for the next call-out, siren optional.", ["Two firefighters", "Studio", "Wide"]),
      design("standard", "hospital", "Hospital", "Little doctors", "An emergency bay with its ambulance, a rooftop helipad and a park bench for recovering teddies.", ["Studio", "", "In a room"]),
      design("standard", "reading", "Reading Corner", "Storybook retreat", "After a long day of travel, the young ones need a cosy moment to relax.", ["Studio", "", "In a room"], "From £1,250"),
      design("standard", "arabian", "Arabian Nights", "Luxe edition", "Shimmering palaces, starlit deserts and treasures untold. No lamp-rubbing required.", ["Front", "Angled", "In a room"], "From £1,350"),
      design("standard", "cafe", "Kids Cafe", "Sweet delights", "Every day is opening day at the sweetest spot in town.", ["Front", "Back", "In a hotel restaurant"], "From £1,250"),
    ],
  },
  {
    slug: "bespoke",
    name: "Bespoke",
    kicker: "Made for one hotel",
    intro:
      "Your building, your mascot, your colour palette. A selection of sets our creative team designed for one hotel each, and that exist nowhere else.",
    items: [
      design("bespoke", "forte", "Forte Village", "Sardinia", "Pine woods, peacocks and zebras, front and back.", ["In a suite", "Front", "Back"]),
      design("bespoke", "great-wall", "Great Wall", "Beijing", "The Great Wall winding over the hills, made for a Beijing family suite.", ["In a suite", "", ""]),
      design("bespoke", "mallorca", "Cap Rocat, Mallorca", "Cathedral of Palma", "La Seu and the old city walls in gold and blue.", ["In a suite", "Front", "With a guest"]),
      design("bespoke", "sandcastle", "Sand Castle", "Surf Club", "Sandcastle towers with shells and starfish, made for a beach club garden.", ["In the garden", "", ""]),
      design("bespoke", "radisson", "Radisson", "Rad Family", "A submarine and a treehouse, each wrapping an extra bed in one family suite.", ["In a suite", "", ""]),
      design("bespoke", "munich-airport", "Munich Airport", "Hilton Munich Airport", "A little aeroplane for young travellers waiting to take off.", ["In the terminal", "", ""]),
    ],
  },
  {
    slug: "cities",
    name: "Cities",
    kicker: "Skyline collection",
    intro:
      "Your city, at child height. Landmark skylines illustrated for the hotel that wants guests to know exactly where they woke up.",
    items: [
      design("cities", "london", "London", "Skyline", "Big Ben, the Shard and Tower Bridge, with a window to peek through.", ["Raffles London edition", "In a suite", "With the bus"], "From £1,250"),
      design("cities", "paris", "Paris", "Skyline", "Notre-Dame, the Arc de Triomphe and the Eiffel Tower in watercolour.", ["In a suite", "Studio", ""], "From £1,250"),
      design("cities", "new-york", "New York", "Skyline", "The Manhattan skyline, from the Empire State to Lady Liberty.", ["Studio", "", "In a hotel lobby"], "From £1,250"),
      design("cities", "san-francisco", "San Francisco", "Skyline", "Cable cars, painted ladies and the Golden Gate.", ["In a suite", "Cable car", ""], "From £1,250"),
    ],
    world: [
      { city: "Chicago", note: "Trump International Hotel & Tower", image: { src: "/catalog/world/chicago.jpg", w: 1536, h: 1024 } },
      { city: "Zurich", note: "Lake Zurich and the old town", image: { src: "/catalog/world/zurich-day-2.jpg", w: 1536, h: 1024 } },
      { city: "Washington, D.C.", note: "The Capitol", image: { src: "/catalog/world/washington.jpg", w: 1536, h: 1024 } },
    ],
  },
  {
    slug: "bedwrappers",
    name: "Bedwrappers",
    kicker: "Bed collection",
    intro:
      "A themed wrap for the bed itself. The room stays as it is; the bed becomes part of the story.",
    items: [
      design("bedwrappers", "marine", "Marine Life", "Twin beds", "Coral and clownfish for a twin room.", ["In a suite", "Twin beds", "Twin room"], "From £850"),
    ],
  },
];

export const bySlug = (slug: string) => sections.find((s) => s.slug === slug);
