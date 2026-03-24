'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const mockHeroes = [
  { hero_image: '/images/about.jpg', hero_title: 'Slide 1' },
  { hero_image: '/images/impact.jpg', hero_title: 'Slide 2' },
  { hero_image: '/images/about2.jpg', hero_title: 'Slide 3' },
];

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {mockHeroes.map((hero, index) => (
          <div key={index} className="flex-[0_0_100%] min-w-0 relative h-[520px]">
            <Image
              src={hero.hero_image}
              alt={hero.hero_title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="container mx-auto px-4 text-center text-white max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                  Supporting Zambian communities to lead their own development
                </h1>
                <p className="text-lg md:text-xl mb-8 text-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                  We help Zambian civil society and community-based organisations (CSOs and CBOs) become more effective through funding and targeted capacity development support
                </p>
                <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                  <Link
                    href="/donate"
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors"
                  >
                    Donate
                  </Link>
                  <Link
                    href="/get-involved"
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-dark transition-all"
                  >
                    Get Involved
                  </Link>
                  <Link
                    href="/initiatives"
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-dark transition-all"
                  >
                    Support an Initiative
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors hidden md:block"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors hidden md:block"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {mockHeroes.map((_, index) => (
          <button
            key={index}
            className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors"
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
