"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { formatAUDate } from "@/lib/utils/formatDate";

interface NewsCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  publishDate: string;
  variant?: "home" | "list";
}

// Mobile layout component (shared between home and list variants)
function MobileNewsCard({
  slug,
  title,
  excerpt,
  coverImageUrl,
  publishDate
}: Omit<NewsCardProps, 'variant'>) {
  return (
    <Link
      href={`/news/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col w-full bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_0_rgba(0,0,0,0.1)] transition-shadow cursor-pointer overflow-hidden"
      style={{
        borderRadius: "20px",
        height: "550px",
      }}
    >
      {/* Cover Image */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "690px",
          height: "340px",
          flexShrink: 0,
          borderRadius: "20px 20px 0 0",
        }}
      >
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          sizes="(max-width:750px) calc((690 / 750) * 100vw), 690px"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div
        className="flex flex-col flex-1"
        style={{
          padding: "30px 20px 20px 20px",
        }}
      >
        {/* Title */}
        <h2
          className="text-[#1D1E1F] font-semibold leading-normal group-hover:text-[#EA4148] transition-colors"
          style={{
            fontSize: "24px",
            marginBottom: "20px",
          }}
        >
          {title}
        </h2>

        {/* Date */}
        <div
          className="text-[#86909C] font-normal leading-normal"
          style={{
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          {formatAUDate(publishDate)}
        </div>

        {/* Excerpt */}
        <p
          className="text-[#86909C] font-normal leading-normal line-clamp-3"
          style={{
            fontSize: "16px",
          }}
        >
          {excerpt}
        </p>
      </div>
    </Link>
  );
}

export default function NewsCard({
  slug,
  title,
  excerpt,
  coverImageUrl,
  publishDate,
  variant = "list",
}: NewsCardProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (variant === "home") {
    if (isMobile) {
      return <MobileNewsCard
        slug={slug}
        title={title}
        excerpt={excerpt}
        coverImageUrl={coverImageUrl}
        publishDate={publishDate}
      />;
    }

    // Desktop: left-right layout
    return (
      <Link
        href={`/news/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-full h-full bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_0_rgba(0,0,0,0.1)] transition-shadow cursor-pointer overflow-hidden"
        style={{
          borderRadius: "min(1.042vw, 20px)", // 20/1920
        }}
      >
        {/* Cover Image */}
        <div
          className="relative shrink-0 overflow-hidden"
          style={{
            width: "42.857%", // 600/1400 保持比例
            height: "100%",
            borderRadius: "min(1.042vw, 20px) 0 0 min(1.042vw, 20px)", // 20/1920
          }}
        >
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            sizes="(max-width: 1920px) 42.857vw, 600px"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div
          className="flex-1 flex flex-col"
          style={{
            padding: "min(2.083vw, 40px)", // 40/1920
          }}
        >
          {/* Title */}
          <h2
            className="text-[#1D1E1F] font-semibold leading-normal group-hover:text-[#EA4148] transition-colors line-clamp-1"
            style={{ fontSize: "min(1.25vw, 24px)" }} // 24/1920
          >
            {title}
          </h2>

          {/* Excerpt */}
          <p
            className="text-[#86909C] font-normal leading-normal line-clamp-4"
            style={{
              fontSize: "min(0.938vw, 18px)", // 18/1920
              marginTop: "min(0.833vw, 16px)", // 16/1920
            }}
          >
            {excerpt}
          </p>

          {/* Date at bottom */}
          <div className="mt-auto">
            <div
              className="text-[#86909C] font-normal leading-normal"
              style={{ fontSize: "min(0.729vw, 14px)" }} // 14/1920
            >
              {formatAUDate(publishDate)}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // List variant (for news page)
  if (isMobile) {
    return <MobileNewsCard
      slug={slug}
      title={title}
      excerpt={excerpt}
      coverImageUrl={coverImageUrl}
      publishDate={publishDate}
    />;
  }

  // Desktop: left-right layout
  return (
    <Link
      href={`/news/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-5 px-5 py-[30px] hover:bg-gray-50 transition-colors cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative w-[280px] h-40 shrink-0 overflow-hidden rounded">
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          sizes="280px"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between pr-16">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-5 group-hover:text-[#EA4148] transition-colors">
            {title}
          </h2>
          <p
            className="text-[#4E5969] text-base leading-relaxed line-clamp-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {excerpt}
          </p>
        </div>

        <div className="text-[#86909C] text-sm mt-5">
          {formatAUDate(publishDate)}
        </div>
      </div>
    </Link>
  );
}
