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
        paddingBottom: "min(3.125vw, 60px)", // 60/1920
      }}
    >
      {/* Title */}
      <h2
        className="font-semibold text-[#1D1E1F] text-center leading-normal"
        style={{ 
          marginTop: "min(3.125vw, 60px)", // 60/1920
          fontSize: 'clamp(24px, 1.771vw, 34px)'
        }}
      >
        Hot News
      </h2>

      {/* Carousel Container */}
      <div
        className="relative mx-auto"
        style={{
          width: "72.917%", // 1400/1920
          maxWidth: "1400px",
          marginTop: "min(2.083vw, 40px)", // 40/1920
          overflow: "visible", // allow NewsCard shadow to render outside container
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Aspect ratio wrapper: 340/1400 = 24.286% */}
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "24.286%", // 340/1400 maintain aspect ratio
          }}
        >
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
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
      </div>

      {/* Indicators */}
      <div
        className="flex items-center"
        style={{
          gap: "min(0.625vw, 12px)", // 12/1920
          marginTop: "min(1.563vw, 30px)", // 30/1920
        }}
      >
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="transition-all duration-300 cursor-pointer"
            style={{
              width: currentIndex === index ? "min(1.563vw, 30px)" : "min(0.417vw, 8px)", // 30/1920, 8/1920
              height: "min(0.417vw, 8px)", // 8/1920
              borderRadius: "min(1.042vw, 20px)", // 20/1920
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
        className="flex justify-center items-center shrink-0 bg-[#EA4148] text-white font-normal transition-colors duration-200 hover:bg-[#C71E25]"
        style={{
          width: "min(8.333vw, 160px)", // 160/1920
          height: "min(2.083vw, 40px)", // 40/1920
          fontSize: "min(0.833vw, 16px)", // 16/1920
          borderRadius: "min(1.563vw, 30px)", // 30/1920
          gap: "min(0.521vw, 10px)", // 10/1920
          marginTop: "min(3.125vw, 60px)", // 60/1920
        }}
      >
        Learn More
      </button>
    </section>
  );
}
