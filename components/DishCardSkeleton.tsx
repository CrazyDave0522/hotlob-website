export function DishCardSkeleton() {
  return (
    <div className="DishCard DishCard--skeleton">
      <div className="DishCard-wrapper">
        <div className="DishCard-image DishCard-image--skeleton" />
        <div className="DishCard-content">
          <div className="DishCard-title DishCard-title--skeleton" />
          <div className="DishCard-icons DishCard-icons--skeleton" />
          <div className="DishCard-tag DishCard-tag--skeleton" />
          <div className="DishCard-description DishCard-description--skeleton" />
        </div>
        <div className="DishCard-button DishCard-button--skeleton" />
      </div>
    </div>
  );
}
