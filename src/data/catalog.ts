import images from "./catalog-images.json";

export type Img = { src: string; w: number; h: number };
export type Variant = { label: string; image: Img };
export type Design = {
  slug: string;
  name: string;
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
};

const shots = images as Record<string, Img[]>;

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
    tagline,
    description,
    price,
    hero,
    variants: [
      { label: labels[0], image: hero },
      { label: labels[1], image: v2 },
      { label: labels[2], image: v3 },
    ],
    rooms,
  };
}

const ST = ["Front", "Back", "Folded"] as [string, string, string];

export const sections: Section[] = [
  {
    slug: "standard",
    name: "The Collection",
    kicker: "Standard models",
    intro:
      "Nine themed worlds, ready to ship. Each one unfolds into a play area in minutes and packs flat when the guests check out.",
    items: [
      design("standard", "castle", "Castle", "Standard & XL editions", "A fortress of imagination stands tall. Perfect for kids who believe every room should come with a throne.", ["Standard", "Front", "Back"], "From £1,150"),
      design("standard", "birthday", "Birthday", "Celebration time", "An explosion of colour and fun for a birthday surprise. No glitter or confetti needed.", ST, "From £995"),
      design("standard", "marine", "Marine Life", "Underwater kingdom", "Starfish, manta rays and coral gardens: the wonders of the sea on dry land.", ["Front", "Back", "Bali edition"], "From £995"),
      design("standard", "princess", "Princess Palace", "Fairytale magic", "For children who dream of glass slippers and enchanted forests.", ["Palace", "Den, lit", "Den, flipped"], "From £995"),
      design("standard", "space", "Spaceship", "Mission control", "For children who dream of touching the stars. Sends space adventurers zooming into orbit.", ["Studio", "Girl in space", "Angled"], "From £995"),
      design("standard", "reading", "Reading Corner", "Storybook retreat", "After a long day of travel, the young ones need a cosy moment to relax.", ["Front", "Back", "In a line"], "From £1,250"),
      design("standard", "arabian", "Arabian Nights", "Luxe edition", "Shimmering palaces, starlit deserts and treasures untold. No lamp-rubbing required.", ["Folded", "Tall", "Ramadan edition"], "From £1,350"),
      design("standard", "festive", "Gingerbread House", "Festive edition", "The most delicious way to celebrate the season, with no sticky fingers.", ["House", "Evening", "With kids"], "From £1,150"),
      design("standard", "cafe", "Kids Cafe", "Sweet delights", "Every day is opening day at the sweetest spot in town.", ["Studio", "With girl", "Thumbnail"], "From £1,250"),
    ],
  },
  {
    slug: "cities",
    name: "Cities",
    kicker: "Skyline collection",
    intro:
      "Your city, at child height. Landmark skylines illustrated for the hotel that wants guests to know exactly where they woke up.",
    items: [
      design("cities", "london", "London", "Skyline", "Big Ben, the Shard and Tower Bridge, with a window to peek through.", ["Skyline", "Alternate", "In room"], "From £1,250"),
      design("cities", "paris", "Paris", "Skyline", "Notre-Dame, the Arc de Triomphe and the Eiffel Tower in watercolour.", ["Skyline", "Alternate", "Detail"], "From £1,250"),
      design("cities", "new-york", "New York", "Skyline", "The Manhattan skyline, from the Empire State to Lady Liberty.", ["Skyline", "Photoshoot", "Alternate"], "From £1,250"),
      design("cities", "san-francisco", "San Francisco", "Skyline", "Cable cars, painted ladies and the Golden Gate.", ["Cable car", "Skyline", "In room"], "From £1,250"),
      design("cities", "berlin", "Berlin", "Skyline", "The Brandenburg Gate, the TV tower and the Reichstag dome.", ["With kids", "Texture", "Layers"], "From £1,250"),
    ],
  },
  {
    slug: "bedwrappers",
    name: "Bedwrappers",
    kicker: "Bed collection",
    intro:
      "A themed wrap for the bed itself. The room stays as it is; the bed becomes a dragon, a planet or a night sky.",
    items: [
      design("bedwrappers", "chinese-dragon", "Chinese Dragon", "Lunar New Year", "A red and gold dragon that coils around the whole bed.", ["Wrap", "On bed", "In room"], "From £850"),
      design("bedwrappers", "petit-prince", "Le Petit Prince", "Storybook", "The little prince, his rose and his planet.", ["Wrap 1", "Wrap 2", "Wrap 3"], "From £850"),
      design("bedwrappers", "arabian-nights", "Arabian Nights", "Ramadan edition", "Lanterns and crescent moons for the holy month.", ["On bed", "In room", "Alternate"], "From £850"),
      design("bedwrappers", "marine", "Marine Life", "Twin beds", "Coral and clownfish for a twin room.", ["Bali", "Twin beds", "Twin room"], "From £850"),
      design("bedwrappers", "san-francisco", "San Francisco", "City edition", "The Golden Gate at the foot of the bed.", ["With girl", "Alebrijes", "Alternate"], "From £850"),
    ],
  },
  {
    slug: "bespoke",
    name: "Bespoke",
    kicker: "Made for one hotel",
    intro:
      "Your building, your mascot, your colour palette. Our creative team designs a set that exists nowhere else.",
    items: [
      design("bespoke", "forte", "Forte Village", "Sardinia", "The resort's own skyline, front and back.", ["Front", "Back", "Front"]),
      design("bespoke", "mallorca", "Cap Rocat, Mallorca", "Cathedral of Palma", "La Seu and the old city walls in gold and blue.", ["Cathedral", "Detail", "Angled"]),
      design("bespoke", "orlando", "Orlando", "Theme park city", "Rockets and castles for the theme park capital.", ["Set", "In room", "Set"]),
      design("bespoke", "zurich", "Zurich", "Swans and the Alps", "Lake swans and a yellow tram.", ["Yellow", "Yellow", "Yellow"]),
      design("bespoke", "chinese-new-year", "Chinese New Year", "Seasonal", "Lanterns and lions for the festival.", ["With kids", "In room", "With kids"]),
      design("bespoke", "football", "Football Stadium", "Club edition", "The home ground, in the club colours.", ["Render", "Render", "Render"]),
    ],
  },
];

export const bySlug = (slug: string) => sections.find((s) => s.slug === slug);
