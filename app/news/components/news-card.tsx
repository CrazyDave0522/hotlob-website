"use client";

import Link from "next/link";
import Image from "next/image";
import { formatAUDate } from "@/lib/utils/formatDate";

interface NewsCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  publishDate: string;
  variant?: "home" | "list";
}

export default function NewsCard({
  slug,
  title,
  excerpt,
  coverImageUrl,
  publishDate,
  variant = "list",
}: NewsCardProps) {
  if (variant === "home") {
    return (
      <Link
        href={`/news/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex w-[1400px] h-[340px] rounded-[20px] bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-[0_0_30px_0_rgba(0,0,0,0.1)] transition-shadow cursor-pointer overflow-hidden"
      >
        {/* Cover Image */}
        <div className="relative w-[600px] h-[340px] shrink-0 overflow-hidden rounded-l-[20px]">
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            sizes="600px"
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-10">
          {/* Title */}
          <h2
            className="text-[#1D1E1F] font-semibold leading-normal group-hover:text-[#EA4148] transition-colors line-clamp-1"
            style={{ fontSize: "24px" }}
          >
            {title}
          </h2>

          {/* Excerpt */}
          <p
            className="text-[#86909C] font-normal leading-normal mt-4 line-clamp-4"
            style={{ fontSize: "18px" }}
          >
            {excerpt}
          </p>

          {/* Date at bottom */}
          <div className="mt-auto">
            <div
              className="text-[#86909C] font-normal leading-normal"
              style={{ fontSize: "14px" }}
            >
              {formatAUDate(publishDate)}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // List variant (for news page)
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
