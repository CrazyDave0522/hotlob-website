'use client'

import Image from 'next/image'
import { DishTag } from '@/types/types'
import { CONSTANTS } from '@/lib/constants'
import OrderButton from './order-button'

interface DishCardProps {
  name: string
  description: string
  tier: 'premium' | 'standard'
  imageUrl: string
  tags: DishTag[]
  stores?: {
    id: string
    name: string
    uber_url?: string | null
    latitude?: number | null
    longitude?: number | null
  }[]
}
export default function DishCard(props: DishCardProps) {
  const { name, description, tier, imageUrl, tags, stores } = props;
  return (
    <div className="w-[332px] h-[480px] bg-white rounded-[20px] shadow-[0_0_20px_rgba(0,0,0,0.12)] flex flex-col items-center p-4">
      {/* 菜品图片 */}
      <Image
        src={imageUrl}
        alt={name}
        width={230}
        height={230}
        className="rounded-md object-cover"
      />

      {/* 名称 */}
      <h3 className="mt-4 text-[20px] font-semibold text-[#1D1E1F]">{name}</h3>

      {/* Tag 图标 */}
      <div className="flex gap-3.5 mt-2">
        {tags.map(tag => (
          <Image
            key={tag.id}
            src={tag.icon_url || CONSTANTS.DEFAULT_TAG_ICON}
            alt=""
            width={40}
            height={40}
            className="object-contain"
          />
        ))}
      </div>

      {/* tier */}
      <div className="mt-3 flex justify-center items-center w-[100px] h-[26px] text-[#EA4148] text-[16px]">
        {tier}
      </div>

      {/* 描述 */}
      <p className="mt-2 h-[125px] text-[#86909C] text-[18px] text-center leading-snug overflow-hidden">
        {description}
      </p>

      <OrderButton stores={stores} fallbackUrl={CONSTANTS.ORDER_URL} />
    </div>
  )
}
