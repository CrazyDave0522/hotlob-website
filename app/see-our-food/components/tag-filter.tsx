// app/see-our-food/components/tag-filter.tsx
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Tag } from '@/types/types'
import { CONSTANTS } from '@/lib/constants'

interface TagFilterProps {
  tags: Tag[]
  onChange?: (selectedIds: string[]) => void
}

export default function TagFilter({ tags, onChange }: TagFilterProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)

  // 点击 tag 的逻辑
  const toggleTag = (id: string) => {
    if (id === 'all') {
      setSelectedIds([])
      onChange?.([])
      return
    }

    let updated: string[] = []
    if (selectedIds.includes(id)) {
      updated = selectedIds.filter(tid => tid !== id)
    } else {
      updated = [...selectedIds, id]
    }
    setSelectedIds(updated)
    onChange?.(updated)
  }

  // 计算要显示的 tag（前 MAX_VISIBLE_TAGS 个 + all）
  const visibleTags = showAll ? tags : tags.slice(0, CONSTANTS.MAX_VISIBLE_TAGS)

  return (
    <div className="w-full bg-white min-h-[116px] flex flex-col justify-center">
  <div className="flex flex-wrap items-center gap-x-10 gap-y-3 pl-[30px] md:pl-[260px] pr-[30px]">
        {/* All 按钮 */}
        <button
          onClick={() => toggleTag('all')}
          className={`inline-flex items-center h-[46px] px-5 py-3 gap-3 rounded-[30px] transition-all duration-150
          ${
            selectedIds.length === 0
              ? 'bg-[#EA4148] text-white'
              : 'bg-transparent text-[#1D1E1F] hover:bg-[rgba(234,65,72,0.08)] hover:text-[#EA4148]'
          } active:scale-95`}
        >
          {/* ALL 的图标（28x28），支持选中/未选中两套素材 */}
          <Image
            src={selectedIds.length === 0 ? (CONSTANTS.ALL_TAG_ICON_ACTIVE || '/images/icons/tag-all-active.svg') : (CONSTANTS.ALL_TAG_ICON || '/images/icons/tag-all.svg')}
            alt="All"
            width={28}
            height={28}
          />
          <span className="text-[18px] font-normal leading-none">All</span>
        </button>

        {/* 动态标签按钮 */}
        {visibleTags.map(tag => {
          const isSelected = selectedIds.includes(tag.id)
          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`inline-flex items-center h-[46px] px-5 py-3 gap-3 rounded-[30px] transition-all duration-150
                ${
                  isSelected
                    ? 'bg-[#EA4148] text-white'
                    : 'bg-transparent text-[#1D1E1F] hover:bg-[rgba(234,65,72,0.08)] hover:text-[#EA4148]'
                } active:scale-95`}
            >
              {tag.icon_url && (
                <Image
                  src={tag.icon_url}
                  alt={tag.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
              <span className="text-[18px] font-normal leading-none">{tag.name}</span>
            </button>
          )
        })}

        {/* 展开/收起箭头 */}
        {tags.length > CONSTANTS.MAX_VISIBLE_TAGS && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center justify-center w-[46px] h-[46px] rounded-[30px] text-[#1D1E1F] hover:bg-[rgba(234,65,72,0.08)] hover:text-[#EA4148] active:scale-95 transition-all duration-150"
          >
            {showAll ? '▲' : '▼'}
          </button>
        )}
      </div>
    </div>
  )
}
