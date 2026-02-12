import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NewsCarousel } from "../../../../components/NewsCarousel";
import { NewsListItem } from "../../../types/news";

// Mock the carousel sizing utilities
vi.mock("../../../utils/carousel-sizing", () => ({
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
  {
    id: "3",
    title: "Third News Article",
    cover_image_url: "/images/news/3.jpg",
    excerpt: "This is the third news article excerpt.",
    author: "Author 3",
    publish_date: "2024-01-03",
    slug: "third-news-article",
  },
];

describe("NewsCarousel - Home Page Integration", () => {
  it("renders news carousel with multiple news items", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    // Verify news items are displayed
    expect(screen.getByText("First News Article")).toBeInTheDocument();
    expect(screen.getByText("This is the first news article excerpt.")).toBeInTheDocument();

    // Verify carousel indicators are shown (3 items = 3 indicators)
    const indicators = screen.getAllByRole("button", { name: /go to slide/i });
    expect(indicators).toHaveLength(3);

    // Navigation is available via indicators and keyboard
    expect(screen.getByRole("region", { name: /news carousel/i })).toBeInTheDocument();
  });

  it("handles carousel navigation between news items", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    // Initially shows first item
    expect(screen.getByText("First News Article")).toBeInTheDocument();

    // Use keyboard navigation to go to second item
    const carousel = screen.getByRole("region", { name: /news carousel/i });
    fireEvent.keyDown(carousel, { key: "ArrowRight" });

    // Should now show second item
    expect(screen.getByText("Second News Article")).toBeInTheDocument();

    // Press right arrow again to go to third item
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    expect(screen.getByText("Third News Article")).toBeInTheDocument();

    // Press right arrow again to loop back to first item
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    expect(screen.getByText("First News Article")).toBeInTheDocument();
  });

  it("handles carousel indicator navigation", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    // Click on second indicator
    const secondIndicator = screen.getByLabelText("Go to slide 2");
    fireEvent.click(secondIndicator);

    // Should show second item
    expect(screen.getByText("Second News Article")).toBeInTheDocument();
  });

  it("opens news article in new tab when clicked", () => {
    const mockOpen = vi.fn();
    global.open = mockOpen;

    render(<NewsCarousel news={mockNewsItems} />);

    // Click on the news item
    const newsItem = screen.getByRole("button", {
      name: /read news article: first news article/i,
    });
    fireEvent.click(newsItem);

    // Should open in new tab
    expect(mockOpen).toHaveBeenCalledWith(
      "/news/first-news-article",
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("handles empty news data gracefully", () => {
    const { container } = render(<NewsCarousel news={[]} />);

    // Component should not render anything
    expect(container.firstChild).toBeNull();
  });

  it("handles single news item (no indicators/arrows)", () => {
    render(<NewsCarousel news={[mockNewsItems[0]]} />);

    // Should show the news item
    expect(screen.getByText("First News Article")).toBeInTheDocument();

    // Should not show indicators or arrows for single item
    expect(screen.queryByLabelText("Previous slide")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Next slide")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /go to slide/i })).toBeNull();
  });

  it("handles keyboard navigation", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    const carouselContainer = screen.getByRole("region", { name: /news carousel/i });

    // Focus on carousel and use arrow keys
    carouselContainer.focus();

    // Right arrow should go to next item
    fireEvent.keyDown(carouselContainer, { key: "ArrowRight" });
    expect(screen.getByText("Second News Article")).toBeInTheDocument();

    // Left arrow should go back
    fireEvent.keyDown(carouselContainer, { key: "ArrowLeft" });
    expect(screen.getByText("First News Article")).toBeInTheDocument();
  });
});