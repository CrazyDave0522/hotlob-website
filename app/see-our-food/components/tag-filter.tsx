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
    <div className="w-full bg-white py-6 flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-4 max-w-[1600px] px-8">
        {/* All 按钮 */}
        <button
          onClick={() => toggleTag('all')}
          className={`flex items-center gap-3 px-5 py-3 h-[46px] rounded-full border transition 
          ${
            selectedIds.length === 0
              ? 'bg-linear-to-r from-[#EA4148] to-[#FFA159] text-white border-transparent'
              : 'bg-white text-[#1D1E1F] border border-gray-300 hover:border-[#EA4148]'
          }`}
        >
          <span className="text-[18px] font-normal">All</span>
        </button>

        {/* 动态标签按钮 */}
        {visibleTags.map(tag => {
          const isSelected = selectedIds.includes(tag.id)
          return (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`flex items-center gap-3 px-5 py-3 h-[46px] rounded-full border transition
                ${
                  isSelected
                    ? 'bg-linear-to-r from-[#EA4148] to-[#FFA159] text-white border-transparent'
                    : 'bg-white text-[#1D1E1F] border border-gray-300 hover:border-[#EA4148]'
                }`}
            >
              {tag.icon_url && (
                <Image
                  src={tag.icon_url}
                  alt={tag.name}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              )}
              <span className="text-[18px] font-normal">{tag.name}</span>
            </button>
          )
        })}

        {/* 展开/收起箭头 */}
        {tags.length > CONSTANTS.MAX_VISIBLE_TAGS && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center justify-center w-[46px] h-[46px] rounded-full border border-gray-300 hover:border-[#EA4148] text-[#1D1E1F]"
          >
            {showAll ? '▲' : '▼'}
          </button>
        )}
      </div>
    </div>
  )
}
