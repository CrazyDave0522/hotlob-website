import React from 'react';
import Image from 'next/image';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  availableCategories: string[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
  availableCategories,
}) => {
  const categories = [null, ...availableCategories]; // null for "All"

  return (
    <div className="CategoryFilter-wrapper" role="region" aria-label="Food category filter">
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        const displayName = category === null ? 'All' : category.charAt(0).toUpperCase() + category.slice(1);
        const iconSrc = category
          ? `/images/icons/food-category/${category}${isActive ? '-active' : ''}.svg`
          : `/images/icons/food-category/all${isActive ? '-active' : ''}.svg`;

        return (
          <button
            key={category ?? 'all'}
            className={`CategoryFilter-button ${
              isActive ? 'CategoryFilter-button--active' : ''
            }`}
            onClick={() => onCategoryChange(category)}
          >
            <div className="CategoryFilter-button-content">
              <Image src={iconSrc} alt={displayName} width={50} height={50} />
              <span>{displayName}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;