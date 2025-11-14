"use client";

import Link from "next/link";
import Image from "next/image";
import { formatAUDate } from "@/lib/utils/formatDate";

interface NewsListItemProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  publishDate: string;
}

export default function NewsListItem({
  slug,
  title,
  excerpt,
  coverImageUrl,
  publishDate,
}: NewsListItemProps) {
  return (
    <Link 
      href={`/news/${slug}`}
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
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
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
