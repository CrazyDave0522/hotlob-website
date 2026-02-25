import Image from "next/image";

import type { AllergenTag, Dish, MediaAsset } from "@/types/dish";

interface DishCardProps {
  dish: Dish;
  image: MediaAsset | null;
  allergens: AllergenTag[];
  expanded: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  onOrder?: () => void;
}

export function DishCard({
  dish,
  image,
  allergens,
  expanded,
  onHover,
  onLeave,
  onOrder,
}: DishCardProps) {
  const tierLabel = dish.tier
    ? `${dish.tier.charAt(0).toUpperCase()}${dish.tier.slice(1)}`
    : "";
  const tagClass =
    dish.tier === "premium"
      ? "DishCard-tag--premium"
      : "DishCard-tag--standard";

  return (
    <article
      className={`DishCard${expanded ? " DishCard--expanded" : ""}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="DishCard-wrapper">
        {image ? (
          <Image
            className="DishCard-image"
            src={image.image_url}
            alt={image.caption ?? dish.name}
            width={230}
            height={230}
          />
        ) : null}
        <div className="DishCard-content">
          <h3 className="DishCard-title">{dish.name}</h3>
          <div className="DishCard-icons" aria-label="Allergen icons">
            {allergens.slice(0, 5).map((allergen) => (
              <Image
                key={allergen.id}
                className="DishCard-icon"
                src={allergen.icon_url}
                alt={allergen.name}
                width={50}
                height={50}
              />
            ))}
          </div>
          <div className={`DishCard-tag ${tagClass}`}>{tierLabel}</div>
          {dish.description ? (
            <p className="DishCard-description">{dish.description}</p>
          ) : null}
        </div>
        <button
          className="DishCard-button"
          type="button"
          aria-label={`Order Now for ${dish.name}`}
          onClick={onOrder}
        >
          Order Now
        </button>
      </div>
    </article>
  );
}
