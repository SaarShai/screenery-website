"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FadeInWhenVisible from "./fade-in-when-visible";

interface ModelItem {
  name: string;
  subtitle: string;
  description: string;
  price?: string;
  thumbnail: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  heroImage: { src: string; width: number; height: number };
  diagram: { src: string; width: number; height: number };
}

const models: ModelItem[] = [
  {
    name: "Castle",
    subtitle: "Standard & XL\u00A0Editions",
    description:
      "A fortress of imagination stands tall. Perfect for kids who believe every room should come with a\u00A0throne.",
    price: "From \u00A31,150",
    thumbnail: "/images/model thumbnails/model-thumbnails-castle.jpg",
    thumbnailWidth: 753,
    thumbnailHeight: 552,
    heroImage: {
      src: "/images/best-boy-in-castle-pod-(large).jpg",
      width: 3800,
      height: 3198,
    },
    diagram: {
      src: "/images/model diagrams/diagrams-castle.jpg",
      width: 904,
      height: 663,
    },
  },
  {
    name: "Princess Palace",
    subtitle: "Fairytale\u00A0Magic",
    description:
      "A kingdom of magic awaits. Perfect for children who dream of fairytale stories, glass slippers, and enchanted\u00A0forests.",
    price: "From \u00A3995",
    thumbnail: "/images/model thumbnails/model-thumbnails-princess.jpg",
    thumbnailWidth: 753,
    thumbnailHeight: 552,
    heroImage: {
      src: "/images/best-princess-in-room-w-girl-(large).jpg",
      width: 3800,
      height: 3205,
    },
    diagram: {
      src: "/images/model diagrams/diagrams-princess.jpg",
      width: 904,
      height: 663,
    },
  },
  {
    name: "Spaceship",
    subtitle: "Mission\u00A0Control",
    description:
      "For children who dream of touching the stars or walking on the moon. Spaceship Screenery sends space adventurers zooming into\u00A0orbit.",
    price: "From \u00A3995",
    thumbnail: "/images/model thumbnails/model-thumbnails-space.jpg",
    thumbnailWidth: 753,
    thumbnailHeight: 552,
    heroImage: {
      src: "/images/best-space-in-room-w-boy-(large).jpg",
      width: 2750,
      height: 2021,
    },
    diagram: {
      src: "/images/model diagrams/diagrams-space.jpg",
      width: 904,
      height: 663,
    },
  },
  {
    name: "Birthday",
    subtitle: "Celebration\u00A0Time",
    description:
      "The perfect way to celebrate a special day. Bringing an explosion of colour and fun to a birthday surprise. No glitter or confetti\u00A0needed!",
    price: "From \u00A3995",
    thumbnail: "/images/model thumbnails/model-thumbnails-birthday.jpg",
    thumbnailWidth: 753,
    thumbnailHeight: 552,
    heroImage: {
      src: "/images/best-birthday-in-room-w-boy-(large).jpg",
      width: 2800,
      height: 2417,
    },
    diagram: {
      src: "/images/model diagrams/diagrams-birthday.jpg",
      width: 904,
      height: 663,
    },
  },
  {
    name: "Reading Corner",
    subtitle: "Storybook\u00A0Retreat",
    description:
      "Sometimes, after a long day of travel, guests need a cosy little moment to relax\u2026 Especially the young\u00A0ones.",
    price: "From \u00A31,250",
    thumbnail: "/images/model thumbnails/model-thumbnails-reading.jpg",
    thumbnailWidth: 753,
    thumbnailHeight: 552,
    heroImage: {
      src: "/images/best-reading-corner-with-boy.jpg",
      width: 2048,
      height: 2080,
    },
    diagram: {
      src: "/images/model diagrams/diagrams-reading.jpg",
      width: 904,
      height: 663,
    },
  },
  {
    name: "Marine Life",
    subtitle: "Underwater\u00A0Kingdom",
    description:
      "Where the wonders of the sea come to life on dry land. A vibrant underwater kingdom with spectacular starfish, graceful manta rays, and incredible coral\u00A0gardens.",
    thumbnail: "/images/model thumbnails/model-thumbnails-marine-pod.jpg",
    thumbnailWidth: 753,
    thumbnailHeight: 552,
    heroImage: {
      src: "/images/better-girl-in-marine-pod-(small).jpg",
      width: 3118,
      height: 2334,
    },
    diagram: {
      src: "/images/model diagrams/diagrams-marine.jpg",
      width: 904,
      height: 662,
    },
  },
  {
    name: "Arabian Nights",
    subtitle: "Luxe\u00A0Edition",
    description:
      "A world of wonders, with shimmering palaces, starlit deserts, soaring minarets, and treasures untold. No lamp-rubbing\u00A0required!",
    price: "From \u00A31,350",
    thumbnail: "/images/model thumbnails/model-thumbnails-arabian.jpg",
    thumbnailWidth: 753,
    thumbnailHeight: 552,
    heroImage: {
      src: "/images/best-arabian-nights-w--boy-in-room-(large-not-stretched).jpg",
      width: 3118,
      height: 2340,
    },
    diagram: {
      src: "/images/model diagrams/diagrams-arabian.jpg",
      width: 904,
      height: 663,
    },
  },
  {
    name: "Gingerbread House",
    subtitle: "Festive\u00A0Edition",
    description:
      "The most delicious way to celebrate the festive season, with no sticky fingers or biscuit crumbs. A cosy, magical, festive cabin\u00A0awaits.",
    price: "From \u00A31,150",
    thumbnail: "/images/model thumbnails/model-thumbnails-festive.jpg",
    thumbnailWidth: 753,
    thumbnailHeight: 552,
    heroImage: {
      src: "/images/best-new-gingerbread-house.jpg",
      width: 2600,
      height: 1883,
    },
    diagram: {
      src: "/images/model diagrams/diagrams-festive.jpg",
      width: 904,
      height: 663,
    },
  },
  {
    name: "Kids Cafe",
    subtitle: "Sweet\u00A0Delights",
    description:
      "Where every day is opening day at the sweetest spot in town. A delicious world of make-believe, fully stocked with sundaes, fresh pastries and rivers of hot\u00A0chocolate.",
    price: "From \u00A31,250",
    thumbnail: "/images/model thumbnails/model-thumbnails-cafe.jpg",
    thumbnailWidth: 753,
    thumbnailHeight: 552,
    heroImage: {
      src: "/images/new-cafe-model-beveled-with-girl-(white-background).jpg",
      width: 2800,
      height: 1861,
    },
    diagram: {
      src: "/images/model diagrams/diagrams-cafe.jpg",
      width: 904,
      height: 663,
    },
  },
];

function Lightbox({
  model,
  onClose,
}: {
  model: ModelItem;
  onClose: () => void;
}) {
  const [showDiagram, setShowDiagram] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
        aria-label="Close gallery"
      >
        <X size={28} />
      </button>

      <div
        className="relative w-full max-w-5xl mx-6 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Model name */}
        <p className="text-white/60 text-center text-sm tracking-[0.2em] uppercase mb-6">
          {model.name}
        </p>

        {/* Hero image with floating diagram */}
        <div className="relative w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={model.heroImage.src}
              alt={`${model.name} in a hotel room`}
              width={model.heroImage.width}
              height={model.heroImage.height}
              className="w-full h-auto max-h-[70vh] object-contain rounded-sm"
              sizes="(max-width: 768px) 95vw, 960px"
              priority
            />
          </motion.div>

          {/* Floating diagram overlay — bottom-right corner */}
          <AnimatePresence>
            {showDiagram && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="absolute bottom-3 right-3 md:bottom-5 md:right-5"
              >
                <button
                  onClick={() => setShowDiagram(false)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors z-10"
                  aria-label="Hide diagram"
                >
                  <X size={12} />
                </button>
                <div className="bg-white rounded-md shadow-2xl shadow-black/40 overflow-hidden border border-white/20">
                  <Image
                    src={model.diagram.src}
                    alt={`${model.name} diagram`}
                    width={model.diagram.width}
                    height={model.diagram.height}
                    className="w-32 h-auto md:w-48 lg:w-56"
                    sizes="224px"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Show diagram button (if hidden) */}
        {!showDiagram && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowDiagram(true)}
            className="mt-4 text-white/40 hover:text-white/70 text-xs tracking-[0.15em] uppercase transition-colors"
          >
            Show Diagram
          </motion.button>
        )}

        {/* Full description text */}
        <div className="mt-8 max-w-2xl mx-auto text-center">
          <div className="w-12 h-[1px] bg-white/20 mx-auto mb-5" />
          <p className="text-white/70 text-sm md:text-[15px] leading-relaxed font-light italic">
            {model.description}
          </p>
          {model.price && (
            <p className="text-white/50 text-xs tracking-[0.15em] uppercase mt-3">
              {model.price}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Collection() {
  const [activeModel, setActiveModel] = useState<ModelItem | null>(null);

  return (
    <>
      <section
        id="collection"
        className="py-24 md:py-32 px-8 md:px-16 lg:px-24 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <FadeInWhenVisible>
            <p className="text-[13px] tracking-[0.3em] uppercase text-[#8b7355] mb-6">
              Screenery™ 2026 Collection
            </p>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.1}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extralight leading-tight max-w-3xl mb-6">
              &lsquo;Mini-kingdoms&rsquo; in any&nbsp;room.
            </h2>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <p
              className="text-[#6b6b6b] text-lg max-w-xl leading-relaxed font-light mb-14"
              style={{ textWrap: "balance" }}
            >
              Each Screenery model is a unique themed experience, beautifully
              illustrated and crafted to transform any space into
              a&nbsp;destination.
            </p>
          </FadeInWhenVisible>

          {/* Models Grid — 3 columns */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {models.map((model, i) => (
              <FadeInWhenVisible key={model.name} delay={i * 0.08}>
                <button
                  onClick={() => setActiveModel(model)}
                  className="group relative w-full text-left"
                >
                  {/* Separator line above each card */}
                  <div className="w-full h-[1px] bg-[#e5e2dc] mb-5" />

                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#f5f3ef]">
                    <Image
                      src={model.thumbnail}
                      alt={model.name}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-105 p-2"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                      <span className="text-white/0 group-hover:text-white/90 text-sm tracking-[0.2em] uppercase transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        View
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-base tracking-wide">{model.name}</h3>
                    <p className="text-[#8b7355] text-xs tracking-wider uppercase mt-0.5 font-light">
                      {model.subtitle}
                    </p>
                    <p className="text-[#6b6b6b] text-[13px] mt-2 leading-relaxed font-light line-clamp-2 group-hover:text-[#8b7355] transition-colors duration-300">
                      {model.description}
                    </p>
                    {model.price && (
                      <p className="text-[13px] mt-2 tracking-wide text-[#1a1a1a]">
                        {model.price}
                      </p>
                    )}
                  </div>
                </button>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {activeModel && (
          <Lightbox
            model={activeModel}
            onClose={() => setActiveModel(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
