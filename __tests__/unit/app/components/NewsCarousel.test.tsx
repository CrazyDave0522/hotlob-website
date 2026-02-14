import { describe, it, expect, vi, beforeEach } from "vitest";
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
    title: "Test News 1",
    cover_image_url: "/test-image-1.jpg",
    excerpt: "Test excerpt 1",
    author: "Test Author",
    publish_date: "2024-01-01",
    slug: "test-news-1",
  },
  {
    id: "2",
    title: "Test News 2",
    cover_image_url: "/test-image-2.jpg",
    excerpt: "Test excerpt 2",
    author: "Test Author",
    publish_date: "2024-01-02",
    slug: "test-news-2",
  },
];

describe("NewsCarousel", () => {
  beforeEach(() => {
    // Mock window.innerWidth for desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));
  });

  it("renders nothing when no news data is provided", () => {
    const { container } = render(<NewsCarousel news={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when news is undefined", () => {
    const { container } = render(<NewsCarousel news={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders carousel with news items", () => {
    render(<NewsCarousel news={mockNewsItems} />);
    expect(screen.getByLabelText("News carousel")).toBeInTheDocument();
    expect(screen.getByText("Test News 1")).toBeInTheDocument();
    expect(screen.getByText("Test excerpt 1")).toBeInTheDocument();
  });

  it("limits display to 5 items maximum", () => {
    const manyNewsItems = Array.from({ length: 7 }, (_, i) => ({
      ...mockNewsItems[0],
      id: `${i + 1}`,
      title: `Test News ${i + 1}`,
      slug: `test-news-${i + 1}`,
    }));

    render(<NewsCarousel news={manyNewsItems} />);
    // Should only show first 5 items
    expect(screen.getByText("Test News 1")).toBeInTheDocument();
    expect(screen.getByText("Test News 5")).toBeInTheDocument();
    expect(screen.queryByText("Test News 6")).not.toBeInTheDocument();
  });

  it("shows carousel indicators with multiple items", () => {
    render(<NewsCarousel news={mockNewsItems} />);
    expect(screen.getByLabelText("Go to slide 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to slide 2")).toBeInTheDocument();
  });

  it("does not show indicators with single item", () => {
    render(<NewsCarousel news={[mockNewsItems[0]]} />);
    expect(screen.queryByLabelText("Go to slide 1")).not.toBeInTheDocument();
  });

  it("navigates to specific item when indicator is clicked", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    const secondIndicator = screen.getByLabelText("Go to slide 2");
    fireEvent.click(secondIndicator);

    expect(screen.getByText("Test News 2")).toBeInTheDocument();
  });

  it("handles keyboard navigation with arrow keys", () => {
    render(<NewsCarousel news={mockNewsItems} />);

    // Simulate right arrow key press
    fireEvent.keyDown(window, { key: "ArrowRight" });

    expect(screen.getByText("Test News 2")).toBeInTheDocument();

    // Simulate left arrow key press
    fireEvent.keyDown(window, { key: "ArrowLeft" });

    expect(screen.getByText("Test News 1")).toBeInTheDocument();
  });

  it("opens news link in new tab when carousel item is clicked", () => {
    // Mock window.open
    const mockOpen = vi.fn();
    global.open = mockOpen;

    render(<NewsCarousel news={[mockNewsItems[0]]} />);

    const carouselItem = screen.getByRole("button", {
      name: /read news article: test news 1/i,
    });
    fireEvent.click(carouselItem);

    expect(mockOpen).toHaveBeenCalledWith(
      "/hotlob-news/test-news-1",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("handles keyboard activation of carousel items", () => {
    const mockOpen = vi.fn();
    global.open = mockOpen;

    render(<NewsCarousel news={[mockNewsItems[0]]} />);

    const carouselItem = screen.getByRole("button", {
      name: /read news article: test news 1/i,
    });

    // Test Enter key
    fireEvent.keyDown(carouselItem, { key: "Enter" });
    expect(mockOpen).toHaveBeenCalledWith(
      "/hotlob-news/test-news-1",
      "_blank",
      "noopener,noreferrer",
    );

    // Reset mock
    mockOpen.mockClear();

    // Test Space key
    fireEvent.keyDown(carouselItem, { key: " " });
    expect(mockOpen).toHaveBeenCalledWith(
      "/hotlob-news/test-news-1",
      "_blank",
      "noopener,noreferrer",
    );
  });
});
