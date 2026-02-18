"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface Testimonial {
  quote: string;
  author: string;
  hotel: string;
  photo: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "This is the next generation in family\u00A0accommodation!",
    author: "Jason Pirock",
    hotel: "Outrigger Hospitality",
    photo: "/images/testimonial pics/testimonial-pics09.jpg",
  },
  {
    quote:
      "The perfect hotel room amenity for kids\u2026 and their\u00A0parents.",
    author: "Ian Pask",
    hotel: "Marriott Grosvenor Square",
    photo: "/images/testimonial pics/testimonial-pics07.jpg",
  },
  {
    quote:
      "I LOVE it! Such a fun way to make something\u00A0unique.",
    author: "Katerina Wolfe",
    hotel: "Aman Hotels",
    photo: "/images/testimonial pics/testimonial-pics08.jpg",
  },
  {
    quote:
      "I rarely come across such inspiring and creative\u00A0vendors.",
    author: "Angie Mouroussia",
    hotel: "Shangri-La",
    photo: "/images/testimonial pics/testimonial-pics11.jpg",
  },
  {
    quote:
      "It\u2019s well-designed and genuinely elevates kids\u2019 hospitality. Exactly the kind of differentiator we look\u00A0for.",
    author: "Amit Malhotra",
    hotel: "St. Regis",
    photo: "/images/testimonial pics/testimonial-pics10.jpg",
  },
  {
    quote:
      "What a fun concept! I love knowing there are companies like yours who just get\u00A0it.",
    author: "Paola Camacho",
    hotel: "Hyatt",
    photo: "/images/testimonial pics/testimonial-pics06.jpg",
  },
  {
    quote:
      "I absolutely LOVE this! What a beautiful concept. The perfect hotel room amenity for\u00A0kids.",
    author: "Ali Mansi",
    hotel: "Sheraton Hotels & Resorts",
    photo: "/images/testimonial pics/testimonial-pics12.jpg",
  },
  {
    quote:
      "Very clever idea. It ticks all the\u00A0boxes!",
    author: "Jean Pierre Mifsud",
    hotel: "Corinthia Hotels",
    photo: "/images/testimonial pics/testimonial-pics01.jpg",
  },
  {
    quote:
      "One of the coolest children\u2019s amenities. An absolute WOW\u00A0moment.",
    author: "Kevin Kellehr",
    hotel: "Actabl",
    photo: "/images/testimonial pics/testimonial-pics02.jpg",
  },
  {
    quote:
      "A great product. I can already see it in our\u00A0hotels.",
    author: "Louise Tiet",
    hotel: "Novotel",
    photo: "/images/testimonial pics/testimonial-pics05.jpg",
  },
  {
    quote:
      "This is wonderful. Our guest experience team are going to love\u00A0it!",
    author: "Alexandra Hobson",
    hotel: "Four Seasons",
    photo: "/images/testimonial pics/testimonial-pics04.jpg",
  },
  {
    quote:
      "Amazing. LOVE it!! This is so brilliantly\u00A0simple.",
    author: "Laure Caron",
    hotel: "Mandarin Oriental",
    photo: "/images/testimonial pics/testimonial-pics03.jpg",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-[#f0ede8] flex flex-col items-center text-center h-full">
      {/* Photo */}
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden mb-5 relative flex-shrink-0 ring-2 ring-[#c4a97d]/40">
        <Image
          src={testimonial.photo}
          alt={testimonial.author}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      {/* Quote */}
      <blockquote className="text-[15px] md:text-base leading-relaxed text-[#1a1a1a] font-light italic flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="mt-5 pt-4 border-t border-[#f0ede8] w-full">
        <p className="text-xs tracking-[0.15em] uppercase text-[#1a1a1a] font-medium">
          {testimonial.author}
        </p>
        <p className="text-xs tracking-[0.08em] uppercase text-[#8b7355] mt-1 font-light">
          {testimonial.hotel}
        </p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for card count
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cardsPerPage = isMobile ? 3 : 4;
  const totalPages = Math.ceil(testimonials.length / cardsPerPage);

  const nextPage = useCallback(() => {
    setDirection(1);
    setPage((p) => (p + 1) % totalPages);
  }, [totalPages]);

  const goToPage = useCallback(
    (target: number) => {
      setDirection(target > page ? 1 : -1);
      setPage(target);
    },
    [page]
  );

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextPage, 5000);
    return () => clearInterval(interval);
  }, [nextPage]);

  const currentCards = testimonials.slice(
    page * cardsPerPage,
    page * cardsPerPage + cardsPerPage
  );

  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 60 : -60,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -60 : 60,
    }),
  };

  return (
    <section className="py-24 md:py-32 px-8 md:px-16 lg:px-24" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[13px] tracking-[0.3em] uppercase text-[#8b7355]">
            What Our Partners Say
          </p>
        </motion.div>

        {/* Cards container */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
            >
              {currentCards.map((t, i) => (
                <motion.div
                  key={t.author}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <TestimonialCard testimonial={t} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === page
                  ? "bg-[#8b7355] scale-110"
                  : "bg-[#e5e2dc] hover:bg-[#c4a97d]"
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
