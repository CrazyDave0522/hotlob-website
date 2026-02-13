import React from 'react'
import '@/styles/components/store-skeleton.css'

export default function StoreSkeleton() {
  return (
    <div className="store-skeleton" data-testid="store-skeleton">
      <div className="store-skeleton-map"></div>
      <div className="store-skeleton-info">
        <div className="store-skeleton-title"></div>
        <div className="store-skeleton-rating"></div>
        <div className="store-skeleton-address"></div>
        <div className="store-skeleton-hours"></div>
      </div>
    </div>
  )
}