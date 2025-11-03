// app/see-our-food/components/hero.tsx
'use client'

import React from 'react'
import Image from 'next/image'

interface HeroProps {
  title: string
  description: string
  imageUrl: string
  size?: 'large' | 'medium' // large = 820px (Home), medium = 420px (others)
}

export default function Hero({
  title,
  description,
  imageUrl,
  size = 'medium',
}: HeroProps) {
  const heroHeight = size === 'large' ? 'h-[820px]' : 'h-[420px]'

  return (
    <section
      className={`relative w-full overflow-hidden ${heroHeight}`}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 通用透明蒙层 */}
      <Image
        src="/images/overlay.png"
        alt=""
        fill
        priority
        style={{ objectFit: 'cover' }}
      />

      {/* 文本区域 */}
      <div className="relative z-10 flex flex-col justify-center h-full pl-[264px] text-white">
        <h1 className="font-custom text-[38px] font-semibold leading-[154%] drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] mb-4 max-w-[900px]">
          {title}
        </h1>
        <p className="font-custom text-[30px] font-normal leading-[154%] drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] max-w-[850px]">
          {description}
        </p>
      </div>
    </section>
  )
}
