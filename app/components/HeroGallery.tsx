"use client";

import { useState } from "react";

const galleryImages = [
  { src: "/Headshoty gallery/web p versions/image 726.webp", alt: "Portrait variation 1" },
  { src: "/Headshoty gallery/web p versions/image 727.webp", alt: "Portrait variation 2" },
  { src: "/Headshoty gallery/web p versions/image 728.webp", alt: "Portrait variation 3" },
  { src: "/Headshoty gallery/web p versions/image 729.webp", alt: "Portrait variation 4" },
  { src: "/Headshoty gallery/web p versions/image 730.webp", alt: "Portrait variation 5" },
  { src: "/Headshoty gallery/web p versions/image 731.webp", alt: "Portrait variation 6" },
  { src: "/Headshoty gallery/web p versions/image 732.webp", alt: "Portrait variation 7" },
  { src: "/Headshoty gallery/web p versions/image 733.webp", alt: "Portrait variation 8" },
  { src: "/Headshoty gallery/web p versions/image 734.webp", alt: "Portrait variation 9" },
  { src: "/Headshoty gallery/web p versions/image 735.webp", alt: "Portrait variation 10" },
  { src: "/Headshoty gallery/web p versions/image 736.webp", alt: "Portrait variation 11" },
  { src: "/Headshoty gallery/web p versions/image 737.webp", alt: "Portrait variation 12" },
];

export default function HeroGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="hero-gallery">
      {/* Left Half - BW Portrait */}
      <div className="hero-gallery-left">
        <img
          src="/Headshoty gallery/web p versions/bw portait.webp"
          alt="Luke Niccol"
          className="hero-gallery-portrait"
        />
      </div>

      {/* Right Half - Stacked Images Grid */}
      <div className="hero-gallery-right">
        <div className="hero-gallery-grid">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`hero-gallery-item ${
                hoveredIndex === index ? "hero-gallery-item--expanded" : ""
              } ${hoveredIndex !== null && hoveredIndex !== index ? "hero-gallery-item--hidden" : ""}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="hero-gallery-image"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
