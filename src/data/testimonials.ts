/**
 * Hotel testimonials for the moving bar under "Trusted by": the top 10 from
 * docs/marketing/screenery-testimonials.md in the codex repo, in that order, wording as sourced.
 * Logos of these hotels are left out of the "Trusted by" wall so no brand shows twice.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  org: string; // the hotel; its logo shows it, so the card prints only the role
  logo: { src: string; w: number; h: number; alt: string; scale?: number }; // trimmed to the ink; scale evens out visual weight
};

export const testimonials: Testimonial[] = [
  {
    quote: "We are happy with the screens we have. They have certainly created a ‘wow moment’ for our younger guests.",
    name: "Karim El Berkchi",
    role: "Hotel Manager",
    org: "Kempinski Hotel Muscat",
    logo: { src: "/images/testimonial-logos/kempinski.png", w: 427, h: 168, alt: "Kempinski", scale: 1.15 },
  },
  {
    quote: "The planes have safely arrived and look stunning! Ready for our little guests to explore 😊",
    name: "Lukas Wechselberger",
    role: "Rooms Division Manager",
    org: "Hilton Munich Airport",
    logo: { src: "/images/testimonial-logos/hilton.png", w: 220, h: 168, alt: "Hilton", scale: 1.2 },
  },
  {
    quote:
      "The screenery is being used for a regular guest who stays for a few weeks over the summer. We always try and find new ways to wow their 4-year-old boy and this will add to the “playroom” we are creating for them!",
    name: "Shane Logan",
    role: "Guest Service Manager",
    org: "The Langham, London",
    logo: { src: "/images/testimonial-logos/langham.png", w: 500, h: 114, alt: "The Langham" },
  },
  {
    quote: "I love it. It’s thoughtful, well-designed, and genuinely elevates kids’ hospitality. It’s exactly the kind of differentiator we look for.",
    name: "Amit Malhotra",
    role: "Hotel Manager",
    org: "The St. Regis Goa Resort",
    logo: { src: "/images/testimonial-logos/st-regis.png", w: 500, h: 134, alt: "St. Regis" },
  },
  {
    quote: "I LOVE this idea. It’s such a fun way to step away from the teepee tents everyone is doing and make something unique.",
    name: "Katerina Wolfe",
    role: "Director of Guest Relations",
    org: "AMAN Hotels",
    logo: { src: "/images/testimonial-logos/aman.png", w: 500, h: 133, alt: "Aman" },
  },
  {
    quote: "This is one of the coolest children’s amenities I have ever seen. An absolute WOW moment for anyone that enters the room.",
    name: "Kevin Kelleher",
    role: "Hotel Operations Leader",
    org: "Actabl",
    logo: { src: "/images/testimonial-logos/actabl.png", w: 500, h: 128, alt: "Actabl", scale: 0.7 },
  },
  {
    quote:
      "It provides a genuine “wow moment” upon arrival and can be easily marketed as a premium feature or integrated into special family packages, potentially allowing for increased room rates.",
    name: "Caroline King",
    role: "Regional Director",
    org: "Bespoke Hotels",
    logo: { src: "/images/testimonial-logos/bespoke-hotels.png", w: 464, h: 134, alt: "Bespoke Hotels" },
  },
  {
    quote: "It is truly a work of art, and the craftsmanship and attention to detail are evident.",
    name: "Aoife Galgey",
    role: "Guest Experience Manager",
    org: "Dromoland Castle",
    logo: { src: "/images/testimonial-logos/dromoland.png", w: 500, h: 33, alt: "Dromoland Castle" },
  },
  {
    quote:
      "This product is very relevant to families traveling with children, as it offers both privacy and an engaging space that can enhance the guest experience.",
    name: "Jimmy Lopez",
    role: "General Manager",
    org: "Hoiana Resort & Golf",
    logo: { src: "/images/testimonial-logos/hoiana.png", w: 500, h: 118, alt: "Hoiana" },
  },
  {
    quote: "Amazing, LOVE the screenery concept!! This is so brilliantly simple.",
    name: "Laure Caron",
    role: "Senior Manager, Customer & Market Insights",
    org: "Mandarin Oriental",
    logo: { src: "/images/testimonial-logos/mandarin-oriental.png", w: 200, h: 157, alt: "Mandarin Oriental", scale: 1.35 },
  },
];
