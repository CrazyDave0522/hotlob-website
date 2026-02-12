import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { NewsCarouselItem } from "../../../../components/NewsCarouselItem";
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

const mockNewsItem: NewsListItem = {
  id: "1",
  title: "Test News Article",
  cover_image_url: "/test-image.jpg",
  excerpt: "This is a test excerpt for the news article.",
  author: "Test Author",
  publish_date: "2024-01-01",
  slug: "test-news-article",
};

describe("NewsCarouselItem", () => {
  beforeEach(() => {
    // Mock window.innerWidth for desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event("resize"));
  });

  it("renders news item with title and excerpt", () => {
    render(<NewsCarouselItem newsItem={mockNewsItem} />);

    expect(screen.getByText("Test News Article")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test excerpt for the news article."),
    ).toBeInTheDocument();
  });

  it("renders image with correct attributes", () => {
    render(<NewsCarouselItem newsItem={mockNewsItem} />);

    const image = screen.getByAltText("Test News Article");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "Test News Article");
  });

  it("applies desktop layout styles by default", () => {
    render(<NewsCarouselItem newsItem={mockNewsItem} />);

    const item = screen.getByRole("button");
    expect(item).toHaveClass("desktop-layout");
  });

  it("applies mobile layout styles on small screens", () => {
    // Mock mobile viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 600,
    });
    window.dispatchEvent(new Event("resize"));

    render(<NewsCarouselItem newsItem={mockNewsItem} />);

    const item = screen.getByRole("button");
    expect(item).toHaveClass("mobile-layout");
  });

  it("opens news link in new tab when clicked", () => {
    const mockOpen = vi.fn();
    global.open = mockOpen;

    render(<NewsCarouselItem newsItem={mockNewsItem} />);

    const item = screen.getByRole("button", {
      name: /read news article: test news article/i,
    });
    fireEvent.click(item);

    expect(mockOpen).toHaveBeenCalledWith(
      "/news/test-news-article",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("handles keyboard activation", () => {
    const mockOpen = vi.fn();
    global.open = mockOpen;

    render(<NewsCarouselItem newsItem={mockNewsItem} />);

    const item = screen.getByRole("button", {
      name: /read news article: test news article/i,
    });

    // Test Enter key
    fireEvent.keyDown(item, { key: "Enter" });
    expect(mockOpen).toHaveBeenCalledWith(
      "/news/test-news-article",
      "_blank",
      "noopener,noreferrer",
    );

    // Reset mock
    mockOpen.mockClear();

    // Test Space key
    fireEvent.keyDown(item, { key: " " });
    expect(mockOpen).toHaveBeenCalledWith(
      "/news/test-news-article",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("has correct accessibility attributes", () => {
    render(<NewsCarouselItem newsItem={mockNewsItem} />);

    const item = screen.getByRole("button", {
      name: /read news article: test news article/i,
    });
    expect(item).toHaveAttribute("tabIndex", "0");
    expect(item).toHaveAttribute(
      "aria-label",
      "Read news article: Test News Article",
    );
  });

  it("applies responsive font sizes", () => {
    render(<NewsCarouselItem newsItem={mockNewsItem} />);

    const title = screen.getByText("Test News Article");
    const excerpt = screen.getByText(
      "This is a test excerpt for the news article.",
    );

    // Font sizes should be applied via inline styles
    expect(title).toHaveStyle({ fontSize: "24px" });
    expect(excerpt).toHaveStyle({ fontSize: "18px" });
  });

  it("handles missing excerpt gracefully", () => {
    const newsItemWithoutExcerpt = { ...mockNewsItem, excerpt: undefined };

    render(<NewsCarouselItem newsItem={newsItemWithoutExcerpt} />);

    expect(screen.getByText("Test News Article")).toBeInTheDocument();
    expect(screen.queryByText("excerpt")).not.toBeInTheDocument();
  });

  it("updates responsive values on window resize", async () => {
    render(<NewsCarouselItem newsItem={mockNewsItem} />);

    // Initially desktop
    expect(screen.getByRole("button")).toHaveClass("desktop-layout");

    // Change to mobile and trigger resize
    await act(async () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 600,
      });
      window.dispatchEvent(new Event("resize"));
    });

    expect(screen.getByRole("button")).toHaveClass("mobile-layout");
  });
});
