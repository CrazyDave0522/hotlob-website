"use client";

import { useState, useEffect } from "react";
import Avatar from "@/components/Avatar";
import Rating from "@/components/Rating";
import type { CuratedReview } from "@/types/review";
import { fetchReviews } from "@/lib/reviews";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<CuratedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const data = await fetchReviews();
        setReviews(data);
      } catch (err) {
        console.error("Error loading reviews:", err);
        setError("Failed to load customer reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Don't render component if no reviews and no error
  if (!loading && reviews.length === 0 && !error) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div
        className="customer-reviews-loading"
        aria-label="Loading customer reviews"
      >
        <div className="customer-reviews-spinner" />
        <span>Loading customer reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-reviews-error">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="customer-reviews-retry"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="customer-reviews">
      {reviews.map((review) => (
        <div key={review.id} className="customer-review-item">
          <div className="customer-review-header">
            <Avatar
              photoUrl={review.author_photo_url}
              name={review.author_name}
              size="md"
              className="customer-review-avatar"
            />
            <div className="customer-review-meta">
              <h4 className="customer-review-author">{review.author_name}</h4>
              <time
                className="customer-review-date"
                dateTime={review.review_time}
              >
                {formatDate(review.review_time)}
              </time>
              <div className="customer-review-rating">
                <Rating value={review.rating} size="md" />
              </div>
              <p className="customer-review-text">{review.review_text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
