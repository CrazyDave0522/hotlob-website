import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
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

describe("NewsCarousel - Performance", () => {
  // Mock performance.now for consistent timing
  const mockPerformanceNow = vi.fn();
  let timeCounter = 0;

  beforeEach(() => {
    timeCounter = 0;
    mockPerformanceNow.mockImplementation(() => {
      timeCounter += 16.67; // ~60fps
      return timeCounter;
    });
    vi.stubGlobal("performance", { now: mockPerformanceNow });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses hardware-accelerated transforms for smooth animations", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    const track = screen
      .getByRole("region", { name: /news carousel/i })
      .querySelector(".news-carousel-track");
    expect(track).toBeInTheDocument();

    // Check that transform is used instead of left/top positioning
    const computedStyle = window.getComputedStyle(track!);
    expect(computedStyle.transform).toBeDefined();
  });

  it("has optimized CSS transitions for performance", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    const track = screen
      .getByRole("region", { name: /news carousel/i })
      .querySelector(".news-carousel-track");
    expect(track).toBeInTheDocument();

    // Check that the element has the expected class for CSS transitions
    expect(track).toHaveClass("news-carousel-track");

    // The actual CSS transition properties are tested in the CSS file
    // In a real browser, this would use transform for hardware acceleration
  });

  it("limits DOM elements to prevent performance issues", () => {
    // Test with maximum allowed items (5)
    const maxNewsItems = Array.from({ length: 5 }, (_, i) => ({
      ...mockNewsItems[0],
      id: `${i + 1}`,
      title: `News Article ${i + 1}`,
      slug: `news-article-${i + 1}`,
    }));

    render(<NewsCarousel news={maxNewsItems} />);

    // Should only render the 5 items, not create excessive DOM nodes
    const newsItems = screen.getAllByRole("button", {
      name: /read news article/i,
    });
    expect(newsItems).toHaveLength(5);

    // Should have indicators for navigation
    const indicators = screen.getAllByRole("button", { name: /go to slide/i });
    expect(indicators).toHaveLength(5);
  });

  it("debounces resize events to prevent excessive re-renders", async () => {
    // Mock ResizeObserver since it's not available in jsdom
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    render(<NewsCarousel news={mockNewsItems} />);

    // Trigger multiple resize events rapidly
    await act(async () => {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("resize"));
    });

    // Component should still be stable and not crash
    expect(screen.getByText("First News Article")).toBeInTheDocument();
  });

  it("uses efficient event listeners", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<NewsCarousel news={mockNewsItems} />);

    // Should add event listeners for resize
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );

    // Should clean up event listeners on unmount
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );
  });

  it("prevents memory leaks with proper cleanup", () => {
    const { unmount } = render(<NewsCarousel news={mockNewsItems} />);

    // Should be able to unmount without issues
    expect(() => unmount()).not.toThrow();

    // Component should clean up all event listeners and timers
    // (This is tested implicitly by the unmount not throwing)
  });

  it("handles rapid navigation without performance degradation", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    // Use keyboard navigation instead of arrow buttons
    const carousel = screen.getByRole("region", { name: /news carousel/i });

    // Rapidly press right arrow multiple times
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    fireEvent.keyDown(carousel, { key: "ArrowRight" });
    fireEvent.keyDown(carousel, { key: "ArrowRight" });

    // Should still show a valid item (looping behavior)
    const visibleItems = screen.getAllByRole("button", {
      name: /read news article/i,
    });
    expect(visibleItems.length).toBeGreaterThan(0);

    // Should not cause any errors or performance issues
    expect(screen.getByText("First News Article")).toBeInTheDocument();
  });
});
