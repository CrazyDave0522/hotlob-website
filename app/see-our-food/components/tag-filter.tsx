// app/see-our-food/components/tag-filter.tsx
"use client";

import React, { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    <div
      className={`w-full flex flex-col justify-center ${
        isMobile ? "bg-transparent" : "bg-white"
      }`}
      style={{
        minHeight: isMobile ? "auto" : "min(6.042vw, 116px)",
        paddingTop: isMobile ? "40px" : undefined,
      }}
    >
      {/* Width controlled by layout.tsx max-w-[1920px] wrapper */}
      <div
        className="flex flex-wrap items-center justify-center gap-y-3 mx-auto w-full px-[30px] md:px-0"
        style={isMobile ? { gap: "12px 20px" } : { gap: "12px 40px" }}
      >
        {/* All button */}
        <button
          onClick={() => toggleTag("all")}
          onMouseDown={() => setPressedButton("all")}
          onMouseUp={() => setPressedButton(null)}
          onMouseLeave={() => setPressedButton(null)}
          className={`tag-button ${
            selectedIds.length === 0
              ? "tag-button--active"
              : "tag-button--inactive"
          }`}
          style={
            isMobile
              ? {
                  display: "flex",
                  padding: "12px 20px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "6px",
                  borderRadius: "10px",
                  border:
                    selectedIds.length === 0
                      ? "2px solid #EA4148"
                      : "2px solid #FFF",
                  background:
                    selectedIds.length === 0
                      ? "#EA4148"
                      : "rgba(255, 255, 255, 0.60)",
                  color: selectedIds.length === 0 ? "#FFF" : "#1D1E1F",
                  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.12)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)", // Safari support
                  height: "auto",
                  minWidth: "116px",
                  transform: pressedButton === "all" ? "scale(0.95)" : "scale(1)",
                  transition: "transform 0.15s",
                }
              : {}
          }
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
            width={isMobile ? 50 : 28}
            height={isMobile ? 50 : 28}
          />
          <span
            className={`text-[18px] font-normal leading-none ${
              isMobile ? "text-[26px]" : ""
            }`}
          >
            All
          </span>
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
              className={`tag-button ${
                isSelected ? "tag-button--active" : "tag-button--inactive"
              }`}
              style={
                isMobile
                  ? {
                      display: "flex",
                      padding: "12px 20px",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "6px",
                      borderRadius: "10px",
                      border: isSelected
                        ? "2px solid #EA4148"
                        : "2px solid #FFF",
                      background: isSelected
                        ? "#EA4148"
                        : "rgba(255, 255, 255, 0.60)",
                      color: isSelected ? "#FFF" : "#1D1E1F",
                      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.12)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)", // Safari support
                      height: "auto",
                      minWidth: "116px",
                      transform: pressedButton === tag.id ? "scale(0.95)" : "scale(1)",
                      transition: "transform 0.15s",
                    }
                  : {}
              }
            >
              {iconUrl && (
                <Image
                  src={iconUrl}
                  alt={tag.name}
                  width={isMobile ? 50 : 40}
                  height={isMobile ? 50 : 40}
                  className="object-contain"
                />
              )}
              <span
                className={`text-[18px] font-normal leading-none ${
                  isMobile ? "text-[26px]" : ""
                }`}
              >
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
            className="tag-button tag-button--inactive w-[46px] h-[46px] justify-center"
            style={
              isMobile
                ? {
                    display: "flex",
                    padding: "12px 20px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "6px",
                    borderRadius: "10px",
                    border: "2px solid #FFF",
                    background: "rgba(255, 255, 255, 0.60)",
                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.12)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)", // Safari support
                    width: "auto",
                    height: "auto",
                    minWidth: "116px",
                    transform: pressedButton === "showAll" ? "scale(0.95)" : "scale(1)",
                    transition: "transform 0.15s",
                  }
                : {}
            }
          >
            {showAll ? "▲" : "▼"}
          </button>
        )}
      </div>
    </div>
  );
}
