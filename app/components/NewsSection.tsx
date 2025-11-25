"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NewsCard from "../news/components/news-card";
import { SectionTitle } from "./SectionTitle";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        paddingBottom: isMobile ? "0px" : "min(3.125vw, 60px)", // Mobile: 0px, Desktop: 60/1920
        width: isMobile ? "750px" : "auto",
        height: isMobile ? "972px" : "auto",
      }}
    >
      {/* Title */}
      <SectionTitle>Hot News</SectionTitle>

      {/* Carousel Container */}
      <div
        className="relative mx-auto"
        style={{
          width: isMobile ? "100%" : "72.917%", // Mobile: full width, Desktop: 1400/1920
          maxWidth: isMobile ? "none" : "1400px",
          marginTop: isMobile ? "20px" : "min(2.083vw, 40px)", // Mobile: 20px, Desktop: 40/1920
          overflow: "visible", // allow NewsCard shadow to render outside container
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isMobile ? (
          // Mobile: direct container (no aspect ratio needed since NewsCard has fixed height)
          <div
            className="transition-opacity duration-700 ease-in-out"
            style={{
              opacity: fadeOut ? 0 : 1,
              width: "690px",
              margin: "0 auto",
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
        ) : (
          // Desktop: aspect ratio wrapper
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
        )}
      </div>

      {/* Indicators */}
      <div
        className="flex items-center"
        style={{
          gap: isMobile ? "12px" : "min(0.625vw, 12px)", // Mobile: 12px, Desktop: 12/1920
          marginTop: isMobile ? "30px" : "min(1.563vw, 30px)", // Mobile: 30px, Desktop: 30/1920
        }}
      >
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="button-click transition-all duration-300 cursor-pointer"
            style={{
              width: currentIndex === index ? (isMobile ? "30px" : "min(1.563vw, 30px)") : (isMobile ? "8px" : "min(0.417vw, 8px)"), // Mobile: 30px/8px, Desktop: 30/1920, 8/1920
              height: isMobile ? "8px" : "min(0.417vw, 8px)", // Mobile: 8px, Desktop: 8/1920
              borderRadius: isMobile ? "20px" : "min(1.042vw, 20px)", // Mobile: 20px, Desktop: 20/1920
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
        className={`button-click flex justify-center items-center shrink-0 bg-[#EA4148] text-white font-normal transition-all duration-200 hover:bg-[#C71E25] ${isMobile ? '' : ''}`}
        style={{
          padding: isMobile ? "20px 80px" : "0", // Mobile: 20px 80px, Desktop: use Tailwind
          gap: isMobile ? "10px" : "min(0.521vw, 10px)", // Mobile: 10px, Desktop: 10/1920
          width: isMobile ? "auto" : "min(8.333vw, 160px)", // Mobile: auto, Desktop: 160/1920
          height: isMobile ? "auto" : "min(2.083vw, 40px)", // Mobile: auto, Desktop: 40/1920
          fontSize: isMobile ? "26px" : "min(0.833vw, 16px)", // Mobile: 26px, Desktop: 16/1920
          borderRadius: isMobile ? "30px" : "min(1.563vw, 30px)", // Mobile: 30px, Desktop: 30/1920
          marginTop: isMobile ? "30px" : "min(3.125vw, 60px)", // Mobile: 30px, Desktop: 60/1920
          color: "#FFF",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
          textTransform: "uppercase",
        }}
      >
        Learn More
        <Image
          src="/images/icons/angle-right.svg"
          alt="arrow right"
          width={isMobile ? 24 : 12}
          height={isMobile ? 24 : 12}
          style={{
            width: isMobile ? "24px" : "12px",
            height: isMobile ? "24px" : "12px",
          }}
        />
      </button>
    </section>
  );
}
