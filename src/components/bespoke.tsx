"use client";

import Image from "next/image";
import FadeInWhenVisible from "./fade-in-when-visible";

const carouselImages = [
  {
    src: "/images/ChatGPT-Image-Jan-25,-2026,-03_18_29-PM.jpg",
    alt: "Bespoke Screenery design concept",
    width: 1536,
    height: 1101,
  },
  {
    src: "/images/best-chinese-new-year-w-kids.jpg",
    alt: "Chinese New Year themed Screenery with children",
    width: 2800,
    height: 1878,
  },
  {
    src: "/images/football render 03.jpeg",
    alt: "Football themed Screenery room divider",
    width: 2496,
    height: 1664,
  },
  {
    src: "/images/best-bali-07.jpg",
    alt: "Bali themed Screenery design",
    width: 1984,
    height: 1428,
  },
  {
    src: "/images/Gemini_Generated_Image_bsy4arbsy4arbsy4.jpg",
    alt: "Custom Screenery design concept",
    width: 2800,
    height: 1546,
  },
  {
    src: "/images/gpt-image-1.5-high-fidelity_a_the_first_uploaded_i.jpg",
    alt: "High fidelity Screenery bespoke render",
    width: 1536,
    height: 1024,
  },
  {
    src: "/images/ramadan-bed-wrapper-in-room-(small).jpg",
    alt: "Ramadan themed Screenery in a hotel room",
    width: 2700,
    height: 1960,
  },
  {
    src: "/images/new-orlando.jpg",
    alt: "Orlando themed Screenery design",
    width: 2400,
    height: 1610,
  },
  {
    src: "/images/best-marriott-pod-in-room.jpg",
    alt: "Marriott hotel Screenery pod in room",
    width: 1483,
    height: 1024,
  },
  {
    src: "/images/best-marriott-lobby-pod-with-elephant.jpg",
    alt: "Marriott lobby Screenery pod with elephant design",
    width: 1984,
    height: 1428,
  },
  {
    src: "/images/NEW-Zurich-(yellow).jpg",
    alt: "Zurich themed Screenery design",
    width: 2800,
    height: 1871,
  },
];

export default function Bespoke() {
  return (
    <section className="py-24 md:py-32 bg-[#f5f3ef] overflow-hidden">
      <div className="px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            {/* Left — text */}
            <div>
              <FadeInWhenVisible>
                <p className="text-[13px] tracking-[0.3em] uppercase text-[#8b7355] mb-6">
                  Bespoke Design
                </p>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={0.1}>
                <h2 className="text-3xl md:text-5xl font-extralight leading-tight mb-8">
                  Exclusively made for your&nbsp;hotel
                </h2>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={0.2}>
                <p
                  className="text-[#6b6b6b] text-lg leading-relaxed font-light mb-6"
                  style={{ textWrap: "balance" }}
                >
                  Choose your design, theme, size, and dimensions. Add your branding
                  or mascot characters, or adapt any of our existing&nbsp;designs.
                </p>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={0.3}>
                <div className="space-y-4 mb-10">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8b7355] mt-2 flex-shrink-0" />
                    <p className="text-[15px] text-[#1a1a1a] font-light">
                      Work with our creative team to design your&nbsp;theme
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8b7355] mt-2 flex-shrink-0" />
                    <p className="text-[15px] text-[#1a1a1a] font-light">
                      Choose from our premium colour&nbsp;palette
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8b7355] mt-2 flex-shrink-0" />
                    <p className="text-[15px] text-[#1a1a1a] font-light">
                      Luxury designs crafted to match your brand&nbsp;identity
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={0.4}>
                <p className="text-sm tracking-wide text-[#8b7355] italic">
                  Prices upon&nbsp;request
                </p>
              </FadeInWhenVisible>
            </div>

            {/* Right — colour swatches image */}
            <FadeInWhenVisible delay={0.2}>
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src="/images/model thumbnails/model-thumbnails-bespoke.jpg"
                  alt="Bespoke Screenery colour palette — premium French cotton and recycled PET colours"
                  width={1506}
                  height={744}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </div>

      {/* Auto-scrolling image carousel — full width */}
      <FadeInWhenVisible delay={0.3}>
        <div className="mt-16 relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[#f5f3ef] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[#f5f3ef] to-transparent z-10 pointer-events-none" />

          {/* Scrolling track — duplicated for seamless loop */}
          <div className="flex animate-[bespoke-scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
            {[...carouselImages, ...carouselImages].map((img, i) => (
              <div
                key={`${img.src}-${i}`}
                className="flex-shrink-0 w-[calc(25vw-12px)] min-w-[260px] max-w-[340px] mx-2"
              >
                <div className="relative aspect-[3/2] rounded-lg overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 340px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
}
