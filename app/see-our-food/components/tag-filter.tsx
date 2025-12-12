// app/see-our-food/components/tag-filter.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CategoryOption } from "@/types/types";
import { CONSTANTS } from "@/lib/constants";

interface TagFilterProps {
  tags: CategoryOption[];
  onChange?: (selectedIds: string[]) => void;
}

export default function TagFilter({ tags, onChange }: TagFilterProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

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
    <div className="w-full flex flex-col justify-center bg-transparent md:bg-white tag-filter-root">
      {/* Width controlled by layout.tsx max-w-[1920px] wrapper */}
      <div
        className="flex flex-wrap items-center justify-center tag-filter-container tag-filter-group md:tag-filter-group-desktop mx-auto w-full"
      >
        {/* All button */}
        <button
          onClick={() => toggleTag("all")}
          onMouseDown={() => setPressedButton("all")}
          onMouseUp={() => setPressedButton(null)}
          onMouseLeave={() => setPressedButton(null)}
            className={`button-click tag-button tag-button-all ${
              selectedIds.length === 0 ? "tag-button--active" : "tag-button--inactive"
            } ${pressedButton === "all" ? "button-pressed" : ""}`}
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
            width={50}
            height={50}
            className="tag-button-icon object-contain"
          />
          <span className="tag-button-text font-normal leading-none">All</span>
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
              onMouseDown={() => setPressedButton(tag.id)}
              onMouseUp={() => setPressedButton(null)}
              onMouseLeave={() => setPressedButton(null)}
              className={`button-click tag-button tag-button-item ${
                isSelected ? "tag-button--active" : "tag-button--inactive"
              } ${pressedButton === tag.id ? "button-pressed" : ""}`}
            >
              {iconUrl && (
                <Image
                  src={iconUrl}
                  alt={tag.name}
                  width={50}
                  height={50}
                  className="tag-button-icon object-contain"
                />
              )}
              <span className="tag-button-text font-normal leading-none">
                {tag.name}
              </span>
            </button>
          );
        })}

        {/* Expand/collapse arrow */}
        {tags.length > CONSTANTS.MAX_VISIBLE_TAGS && (
          <button
            onClick={() => setShowAll(!showAll)}
            onMouseDown={() => setPressedButton("showAll")}
            onMouseUp={() => setPressedButton(null)}
            onMouseLeave={() => setPressedButton(null)}
            className={`button-click tag-button tag-button--inactive ${
              pressedButton === "showAll" ? "button-pressed" : ""
            }`}
          >
            {showAll ? "▲" : "▼"}
          </button>
        )}
      </div>
    </div>
  );
}
