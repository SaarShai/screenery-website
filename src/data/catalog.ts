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
  soon?: boolean; // shows "Coming soon" in place of the photos
};
export type Section = {
  slug: string;
  name: string;
  subtitle?: string; // one line under the section name
  items: Design[];
  moreCities?: { city: string; note: string; image: Img }[];
};

const shots = images as Record<string, (Img | null)[]>;

/** Placeholder images: hero, v2, v3, then room shots. The owner replaces these later.
 * Prices: owner price list October 2026 (GBP); Police, Fire Station and Hospital as Castle; bedwrappers from the single-bed price. */
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
    items: [
      design("standard", "castle", "Castle", "Standard edition", "A fortress of imagination stands tall. Perfect for kids who believe every room should come with a throne.", ["Front", "Back", "In a room"], "From £1,250"),
      design("standard", "gingerbread", "Gingerbread House", "Festive edition", "The most delicious way to celebrate the festive season, with no sticky fingers or biscuit crumbs. Candy canes, pine trees and snowflakes around a cosy cabin with a double door.", ["With children", "", ""], "From £1,150"),
      design("standard", "birthday", "Birthday", "Celebration time", "An explosion of colour and fun for a birthday surprise. No glitter or confetti needed.", ST, "From £995"),
      design("standard", "marine", "Marine Life", "Underwater kingdom", "Whales, dolphins, sea turtles and coral gardens: the wonders of the sea on dry land.", ["Studio", "By the pool", ""], "From £1,050"),
      design("standard", "princess", "Princess Palace", "Fairytale magic", "For children who dream of glass slippers and enchanted forests.", ["Front", "Back", "In a suite"], "From £995"),
      design("standard", "space", "Spaceship", "Mission control", "For children who dream of touching the stars. Sends space adventurers zooming into orbit.", ["Front", "Back", "In a room"], "From £995"),
      design("standard", "reading", "Reading Corner", "Storybook retreat", "After a long day of travel, the young ones need a cosy moment to relax.", ["Studio", "", "In a room"], "From £1,050"),
      design("standard", "arabian", "Arabian Nights", "Luxe edition", "Shimmering palaces, starlit deserts and treasures untold. No lamp-rubbing required.", ["Front", "Angled", "In a room"], "From £1,350"),
      design("standard", "cafe", "Kids Cafe", "Sweet delights", "Every day is opening day at the sweetest spot in town.", ["Front", "Back", "In a hotel restaurant"], "From £1,250"),
      design("standard", "police", "Police Station", "On patrol", "Blue lights, a patrol car and a lookout tower. Little officers keep the suite safe and sound.", ["With a cadet", "", "In a hotel suite"], "From £1,250"),
      design("standard", "fire-station", "Fire Station", "To the rescue", "A red fire engine, a bell tower and big arched doors. Ready for the next call-out, siren optional.", ["Two firefighters", "", "In a hotel suite"], "From £1,250"),
      design("standard", "hospital", "Hospital", "Little doctors", "An emergency bay with its ambulance, a rooftop helipad and a park bench for recovering teddies.", ["Studio", "", "In a room"], "From £1,250"),
    ],
  },
  {
    slug: "bespoke",
    name: "Bespoke",
    subtitle: "Order a design made only for your hotel: your theme, artwork, colours, sizes and branding.",
    items: [
      design("bespoke", "forte", "Forte Village", "Sardinia", "Pine woods, peacocks and zebras, front and back.", ["In a suite", "Front", "Back"]),
      design("bespoke", "great-wall", "Great Wall", "Beijing", "The Great Wall winding over the hills, made for a Beijing family suite.", ["In a suite", "", ""]),
      design("bespoke", "mallorca", "Cap Rocat, Mallorca", "Cathedral of Palma", "La Seu and the old city walls in gold and blue.", ["In a suite", "Front", "With a guest"]),
      design("bespoke", "sandcastle", "Sand Castle", "Surf Club", "Sandcastle towers with shells and starfish, made for a beach club garden.", ["In the garden", "", ""]),
      design("bespoke", "munich-airport", "Munich Airport", "Hilton Munich Airport", "A little aeroplane for young travellers waiting to take off.", ["In the terminal", "", ""]),
      design("bespoke", "the-charles", "The Charles", "MUNICH", "Munich landmarks in watercolour, separating two junior beds in a family suite.", ["In a suite", "", ""]),
    ],
  },
  {
    slug: "cities",
    name: "Cities",
    items: [
      design("cities", "london", "London", "Skyline", "Big Ben, the Shard and Tower Bridge, with a window to peek through.", ["Raffles London edition", "In a suite", "With the bus"], "From £1,250"),
      design("cities", "paris", "Paris", "Skyline", "Notre-Dame, the Arc de Triomphe and the Eiffel Tower in watercolour.", ["In a suite", "Studio", ""], "From £1,250"),
      design("cities", "new-york", "New York", "Skyline", "The Manhattan skyline, from the Empire State to Lady Liberty.", ["Studio", "", "In a hotel lobby"], "From £1,250"),
      design("cities", "san-francisco", "San Francisco", "Skyline", "Cable cars, painted ladies and the Golden Gate.", ["In a suite", "Cable car", ""], "From £1,250"),
    ],
    moreCities: [
      { city: "Chicago", note: "Trump International Hotel & Tower", image: { src: "/catalog/cities/chicago/chicago.jpg", w: 1536, h: 1024 } },
      { city: "Zurich", note: "Lake Zurich and the old town", image: { src: "/catalog/cities/zurich/zurich-day-2.jpg", w: 1536, h: 1024 } },
      { city: "Washington, D.C.", note: "The Capitol", image: { src: "/catalog/cities/washington/washington.jpg", w: 1536, h: 1024 } },
      { city: "Las Vegas", note: "Welcome to Fabulous Las Vegas", image: { src: "/catalog/cities/las-vegas/room-option-c.png", w: 1536, h: 1024 } },
    ],
  },
  {
    slug: "bedwrappers",
    name: "Bedwrappers",
    subtitle: "Around every bed. Single and double sizes, panels 75 cm high.",
    items: [
      design("bedwrappers", "marine", "Marine Life", "Single bed", "Whales, turtles and coral.", ["In a suite", "", ""], "From £950"),
      design("bedwrappers", "chinese-dragon", "Chinese Dragon", "Lunar New Year", "A red and gold dragon curls around the bed.", ["In a suite", "", ""], "From £950"),
      design("bedwrappers", "arabian-nights", "Arabian Nights", "Ramadan and Eid", "Domes, arches and lanterns around the bed.", ["In a suite", "", ""], "From £950"),
      design("bedwrappers", "alebrijes", "Alebrijes", "Mexican folk art", "Winged cats, jaguars and dragons in bright folk-art colours.", ["In a suite", "", ""], "From £950"),
      design("bedwrappers", "twin-room", "Twin room", "Meadow and autumn", "A lamb in a clover meadow and a fox in autumn leaves, one for each bed.", ["In a twin room", "", ""], "From £950"),
    ],
  },
  {
    slug: "pods",
    name: "Pods",
    subtitle: "A room within the room: freestanding play pods for lobbies, kids clubs and events.",
    items: [
      design("pods", "castle-xl", "Castle XL", "W 216 × D 200 × H 170 cm", "The castle, scaled up for lobbies, kids clubs and events. Room inside for a whole group of little knights.", ["With children", "", ""], "From £1,550"),
      design("pods", "marine-pod", "Marine Pod", "About 2.4 m across · panels 1.2 m high", "An ocean ring of whales, turtles and coral, open to the sky.", ["With children", "Studio", ""]),
      design("pods", "gingerbread-cottage", "Gingerbread Cottage", "W 158 × D 166 × H 147 cm", "A gingerbread cottage children can play inside: iced biscuit roof, candy canes and a door that really opens.", ["With children", "", ""], "From £1,950"),
      design("pods", "jungle-treehouse", "Jungle Treehouse", "W 158 × D 166 × H 147 cm", "A hideaway in the trees, with monkeys, a lion cub and an elephant around it.", ["With children", "", ""]),
    ],
  },
];

export const bySlug = (slug: string) => sections.find((s) => s.slug === slug);
