"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import NewsCard from "../news/components/news-card";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  publishDate: string;
};

interface NewsSectionProps {
  news: NewsItem[];
}

export default function NewsSection({ news }: NewsSectionProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play logic
  useEffect(() => {
    if (isPaused || news.length <= 1) return;

    autoPlayRef.current = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
        setFadeOut(false);
      }, 400); // Fade out duration
    }, 3500); // 3.5 seconds interval

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPaused, news.length, currentIndex]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    
    setFadeOut(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setFadeOut(false);
    }, 400);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (news.length === 0) return null;

  return (
    <section
      className="relative w-full"
      style={{
        background: "linear-gradient(180deg, #FBF3F3 0%, #FFF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "60px",
      }}
    >
      {/* Title */}
      <h2
        className="text-[34px] font-semibold text-[#1D1E1F] text-center leading-normal"
        style={{ marginTop: "60px" }}
      >
        Hot News
      </h2>

      {/* Carousel Container */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "1400px",
          height: "340px",
          marginTop: "40px",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="transition-opacity duration-700 ease-in-out"
          style={{
            opacity: fadeOut ? 0 : 1,
          }}
        >
          <NewsCard
            slug={news[currentIndex].slug}
            title={news[currentIndex].title}
            excerpt={news[currentIndex].excerpt}
            coverImageUrl={news[currentIndex].coverImageUrl}
            publishDate={news[currentIndex].publishDate}
            variant="home"
          />
        </div>
      </div>

      {/* Indicators */}
      <div className="flex items-center gap-3 mt-[30px]">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="transition-all duration-300 cursor-pointer"
            style={{
              width: currentIndex === index ? "30px" : "8px",
              height: "8px",
              borderRadius: "20px",
              background: currentIndex === index ? "#EA4148" : "#000",
              opacity: currentIndex === index ? 1 : 0.2,
            }}
            aria-label={`Go to news ${index + 1}`}
          />
        ))}
      </div>

      {/* Learn More Button */}
      <button
        onClick={() => router.push("/news")}
        className="flex justify-center items-center gap-2.5 shrink-0 rounded-[30px] bg-[#EA4148] text-white font-normal transition-opacity hover:opacity-90"
        style={{
          width: "160px",
          height: "40px",
          fontSize: "16px",
          marginTop: "60px",
        }}
      >
        Learn More
      </button>
    </section>
  );
}
