'use client';

import React, { useState } from 'react';

export interface CardItem {
  title: string;
  description: string;
}

interface ExpandableCardGridProps {
  items: CardItem[];
}

export const ExpandableCardGrid: React.FC<ExpandableCardGridProps> = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState(0); // Desktop: first card expanded by default

  // Map index to card images
  const getCardImage = (index: number, isActive: boolean, isMobile: boolean): string => {
    const cardNum = index + 1;
    if (isMobile) {
      return `/images/expandable-card-grid/card${cardNum}-active-mb.png`;
    }
    return isActive
      ? `/images/expandable-card-grid/card${cardNum}-active.png`
      : `/images/expandable-card-grid/card${cardNum}.png`;
  };

  return (
    <div className="ExpandableCardGrid-root">
      <div className="ExpandableCardGrid-container">
        {items.map((item, index) => {
          const isActive = expandedIndex === index;
          const mobileImage = getCardImage(index, true, true);
          const desktopImage = getCardImage(index, isActive, false);

          return (
            <div
              key={index}
              className={`ExpandableCardGrid-card ${isActive ? 'ExpandableCardGrid-card--active' : ''}`}
              onMouseEnter={() => setExpandedIndex(index)}
              style={{
                '--mobile-bg': `url('${mobileImage}')`,
                '--desktop-bg': `url('${desktopImage}')`,
              } as React.CSSProperties & { '--mobile-bg': string; '--desktop-bg': string }}
            >
              <div className="ExpandableCardGrid-content">
                <h3 className="ExpandableCardGrid-title">{item.title}</h3>
                <p className="ExpandableCardGrid-description">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
