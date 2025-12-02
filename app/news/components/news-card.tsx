"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
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
  // Responsive handled via CSS/media queries

  if (variant === "home") {
    // Mobile: use the dedicated mobile card (no wrapping Link outside)
    return (
      <>
        <div className="block md:hidden w-full">
          <MobileNewsCard
            slug={slug}
            title={title}
            excerpt={excerpt}
            coverImageUrl={coverImageUrl}
            publishDate={publishDate}
          />
        </div>
        {/* Desktop: left-right layout as a single Link */}
        <div className="hidden md:block w-full h-full">
          <Link
            href={`/news/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-full h-full bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_0_rgba(0,0,0,0.1)] transition-shadow cursor-pointer overflow-hidden"
            style={{ borderRadius: "min(1.042vw, 20px)", border: "1px solid #E1E4E9" }}
          >
            <div className="flex w-full h-full">
              {/* Cover Image */}
              <div
                className="relative shrink-0 overflow-hidden"
                style={{
                  width: "42.857%",
                  height: "100%",
                  borderRadius: "min(1.042vw, 20px) 0 0 min(1.042vw, 20px)",
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
                style={{ padding: "min(2.083vw, 40px)" }}
              >
                <h2
                  className="text-[#1D1E1F] font-semibold leading-normal group-hover:text-[#EA4148] transition-colors line-clamp-1"
                  style={{ fontSize: "min(1.25vw, 24px)" }}
                >
                  {title}
                </h2>
                <p
                  className="text-[#86909C] font-normal leading-normal line-clamp-4"
                  style={{
                    fontSize: "min(0.938vw, 18px)",
                    marginTop: "min(0.833vw, 16px)",
                  }}
                >
                  {excerpt}
                </p>
                <div className="mt-auto">
                  <div
                    className="text-[#86909C] font-normal leading-normal"
                    style={{ fontSize: "min(0.729vw, 14px)" }}
                  >
                    {formatAUDate(publishDate)}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </>
    );
  }

  // List variant (for news page)
  // List variant: mobile uses stacked card; desktop uses left image + right text
  return (
    <>
      {/* Mobile stacked card */}
      <div className="block md:hidden w-full">
        <MobileNewsCard
          slug={slug}
          title={title}
          excerpt={excerpt}
          coverImageUrl={coverImageUrl}
          publishDate={publishDate}
        />
      </div>
      {/* Desktop left-right layout */}
      <div className="hidden md:block w-full">
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
      </div>
    </>
  );
}
