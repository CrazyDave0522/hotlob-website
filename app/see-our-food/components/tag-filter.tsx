// app/see-our-food/components/tag-filter.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Tag } from "@/types/types";
import { CONSTANTS } from "@/lib/constants";

interface TagFilterProps {
  tags: Tag[];
  onChange?: (selectedIds: string[]) => void;
}

export default function TagFilter({ tags, onChange }: TagFilterProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Tag click logic
  const toggleTag = (id: string) => {
    if (id === "all") {
      setSelectedIds([]);
      onChange?.([]);
      return;
    }

    let updated: string[] = [];
    if (selectedIds.includes(id)) {
      updated = selectedIds.filter((tid) => tid !== id);
    } else {
      updated = [...selectedIds, id];
    }
    setSelectedIds(updated);
    onChange?.(updated);
  };

  // Calculate tags to display (first MAX_VISIBLE_TAGS + all)
  const visibleTags = showAll
    ? tags
    : tags.slice(0, CONSTANTS.MAX_VISIBLE_TAGS);

  return (
    <div className="w-full bg-white min-h-[116px] flex flex-col justify-center">
      {/* Width controlled by layout.tsx max-w-[1920px] wrapper */}
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 mx-auto w-full px-[30px] md:px-0">
        {/* All button */}
        <button
          onClick={() => toggleTag("all")}
          className={`tag-button ${
            selectedIds.length === 0
              ? "tag-button--active"
              : "tag-button--inactive"
          }`}
        >
          {/* ALL icon (28x28), supports selected/unselected assets */}
          <Image
            src={
              selectedIds.length === 0
                ? CONSTANTS.ALL_TAG_ICON_ACTIVE ||
                  "/images/icons/tag-all-active.svg"
                : CONSTANTS.ALL_TAG_ICON || "/images/icons/tag-all.svg"
            }
            alt="All"
            width={28}
            height={28}
          />
          <span className="text-[18px] font-normal leading-none">All</span>
        </button>

        {/* Dynamic tag buttons */}
        {visibleTags.map((tag) => {
          const isSelected = selectedIds.includes(tag.id);
          // Select icon based on selected state, with fallback logic
          const iconUrl = isSelected
            ? tag.icon_url_active ||
              tag.icon_url ||
              CONSTANTS.DEFAULT_TAG_ICON_ACTIVE
            : tag.icon_url || CONSTANTS.DEFAULT_TAG_ICON;

          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`tag-button ${
                isSelected ? "tag-button--active" : "tag-button--inactive"
              }`}
            >
              {iconUrl && (
                <Image
                  src={iconUrl}
                  alt={tag.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
              <span className="text-[18px] font-normal leading-none">
                {tag.name}
              </span>
            </button>
          );
        })}

        {/* Expand/collapse arrow */}
        {tags.length > CONSTANTS.MAX_VISIBLE_TAGS && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="tag-button tag-button--inactive w-[46px] h-[46px] justify-center"
          >
            {showAll ? "▲" : "▼"}
          </button>
        )}
      </div>
    </div>
  );
}
