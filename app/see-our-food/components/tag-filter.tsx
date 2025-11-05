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

  // 点击 tag 的逻辑
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

  // 计算要显示的 tag（前 MAX_VISIBLE_TAGS 个 + all）
  const visibleTags = showAll
    ? tags
    : tags.slice(0, CONSTANTS.MAX_VISIBLE_TAGS);

  return (
    <div className="w-full bg-white min-h-[116px] flex flex-col justify-center">
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 mx-auto w-full max-w-[1920px] px-[30px] md:px-0">
        {/* All 按钮 */}
        <button
          onClick={() => toggleTag("all")}
          className={`tag-button ${
            selectedIds.length === 0
              ? "tag-button--active"
              : "tag-button--inactive"
          }`}
        >
          {/* ALL 的图标（28x28），支持选中/未选中两套素材 */}
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

        {/* 动态标签按钮 */}
        {visibleTags.map((tag) => {
          const isSelected = selectedIds.includes(tag.id);
          // 根据选中状态选择 icon，有 fallback 逻辑
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

        {/* 展开/收起箭头 */}
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
