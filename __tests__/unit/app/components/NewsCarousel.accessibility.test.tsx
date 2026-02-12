import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NewsCarousel } from "../../../../components/NewsCarousel";
import { NewsListItem } from "../../../../types/news";

// Mock the carousel sizing utilities
vi.mock("../../../../utils/carousel-sizing", () => ({
  getDesktopImageSize: vi.fn(() => ({ width: 600, height: 340 })),
  getMobileImageSize: vi.fn(() => ({ width: 690, height: 340 })),
  getDesktopTitleFontSize: vi.fn(() => 24),
  getMobileTitleFontSize: vi.fn(() => 36),
  getDesktopExcerptFontSize: vi.fn(() => 18),
  getMobileExcerptFontSize: vi.fn(() => 30),
}));

const mockNewsItems: NewsListItem[] = [
  {
    id: "1",
    title: "First News Article",
    cover_image_url: "/images/news/1.jpg",
    excerpt: "This is the first news article excerpt.",
    author: "Author 1",
    publish_date: "2024-01-01",
    slug: "first-news-article",
  },
  {
    id: "2",
    title: "Second News Article",
    cover_image_url: "/images/news/2.jpg",
    excerpt: "This is the second news article excerpt.",
    author: "Author 2",
    publish_date: "2024-01-02",
    slug: "second-news-article",
  },
];

describe("NewsCarousel - Accessibility", () => {
  it("has proper ARIA labels and roles", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    // Carousel should have proper region role
    const carousel = screen.getByRole("region", { name: /news carousel/i });
    expect(carousel).toBeInTheDocument();

    // Indicators should have proper labels
    expect(screen.getByLabelText("Go to slide 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to slide 2")).toBeInTheDocument();

    // News items should have proper button roles and labels
    const newsItem = screen.getByRole("button", {
      name: /read news article: first news article/i,
    });
    expect(newsItem).toHaveAttribute("tabIndex", "0");
    expect(newsItem).toHaveAttribute(
      "aria-label",
      "Read news article: First News Article",
    );
  });

  it("supports keyboard navigation with arrow keys", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    const carousel = screen.getByRole("region", { name: /news carousel/i });

    // Initially shows first item
    expect(screen.getByText("First News Article")).toBeInTheDocument();

    // Right arrow should go to next item
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    expect(screen.getByText("Second News Article")).toBeInTheDocument();

    // Right arrow again should loop to first item
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    expect(screen.getByText("First News Article")).toBeInTheDocument();

    // Left arrow should go to previous (last) item
    fireEvent.keyDown(carousel, { key: "ArrowLeft" });
    expect(screen.getByText("Second News Article")).toBeInTheDocument();
  });

  it("supports keyboard navigation with Home and End keys", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    const carousel = screen.getByRole("region", { name: /news carousel/i });

    // Start from second item
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    expect(screen.getByText("Second News Article")).toBeInTheDocument();

    // Home key should go to first item
    fireEvent.keyDown(carousel, { key: "Home" });
    expect(screen.getByText("First News Article")).toBeInTheDocument();

    // End key should go to last item
    fireEvent.keyDown(carousel, { key: "End" });
    expect(screen.getByText("Second News Article")).toBeInTheDocument();
  });

  it("ignores irrelevant keyboard keys", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    const carousel = screen.getByRole("region", { name: /news carousel/i });

    // Initially shows first item
    expect(screen.getByText("First News Article")).toBeInTheDocument();

    // Pressing irrelevant keys should not change the carousel
    fireEvent.keyDown(carousel, { key: "a" });
    fireEvent.keyDown(carousel, { key: "Enter" });
    fireEvent.keyDown(carousel, { key: " " });

    // Should still show first item
    expect(screen.getByText("First News Article")).toBeInTheDocument();
  });

  it("maintains focus management during keyboard navigation", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    const carousel = screen.getByRole("region", { name: /news carousel/i });

    // Focus should be managed properly
    carousel.focus();
    expect(document.activeElement).toBe(carousel);

    // Navigation should not change focus unexpectedly
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    expect(document.activeElement).toBe(carousel);
  });

  it("provides proper focus indicators", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    const carousel = screen.getByRole("region", { name: /news carousel/i });

    // Focus the carousel
    carousel.focus();

    // Should have visible focus indicator (outline)
    expect(carousel).toHaveStyle({
      outline: expect.stringContaining("2px solid"),
    });
  });

  it("handles focus on individual news items", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    const newsItem = screen.getByRole("button", {
      name: /read news article: first news article/i,
    });

    // Focus the news item
    newsItem.focus();
    expect(document.activeElement).toBe(newsItem);

    // Should have focus outline
    expect(newsItem).toHaveStyle({
      outline: expect.stringContaining("2px solid"),
    });
  });

  it("supports screen reader navigation with proper live regions", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    // The carousel should be properly structured for screen readers
    const carousel = screen.getByRole("region", { name: /news carousel/i });
    expect(carousel).toHaveAttribute("aria-live", "polite");
  });
});
