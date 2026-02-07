import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";
import { describe, it, expect, vi } from "vitest";

interface MockImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  style?: Record<string, string | number>;
}

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
    style,
  }: MockImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ ...style, width: "100%", height: "auto" }}
      data-testid={`image-${className}`}
    />
  ),
}));

describe("Hero Component", () => {
  describe("Variant Rendering", () => {
    it("renders with tall variant", () => {
      const { container } = render(
        <Hero
          variant="tall"
          bgImage="/images/hero-bg/home-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const root = container.querySelector(".Hero-root--tall");
      expect(root).toBeInTheDocument();
    });

    it("renders with short variant", () => {
      const { container } = render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/test-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const root = container.querySelector(".Hero-root--short");
      expect(root).toBeInTheDocument();
    });
  });

  describe("Image Fallback", () => {
    it("uses bgImage when mobileBgImage is not provided", () => {
      const { container } = render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/desktop.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const bgImage = container.querySelector(".Hero-bgImage");
      expect(bgImage).toHaveAttribute("src", "/images/hero-bg/desktop.jpg");
    });

    it("renders Hero section when mobileBgImage is provided", () => {
      const { container } = render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/desktop.jpg"
          mobileBgImage="/images/hero-bg/mobile.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const section = container.querySelector("section.Hero-root");
      expect(section).toBeInTheDocument();
    });
  });

  describe("Overlay Rendering", () => {
    it("renders overlay when overlay={true}", () => {
      const { container } = render(
        <Hero
          variant="tall"
          bgImage="/images/hero-bg/home-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const overlay = container.querySelector(".Hero-overlay");
      expect(overlay).toBeInTheDocument();
    });

    it("does not render overlay when overlay={false}", () => {
      const { container } = render(
        <Hero
          variant="tall"
          bgImage="/images/hero-bg/home-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={false}
        />
      );
      const overlay = container.querySelector(".Hero-overlay");
      expect(overlay).not.toBeInTheDocument();
    });

    it("applies no-overlay class when overlay={false}", () => {
      const { container } = render(
        <Hero
          variant="tall"
          bgImage="/images/hero-bg/home-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={false}
        />
      );
      const root = container.querySelector(".Hero-root--no-overlay");
      expect(root).toBeInTheDocument();
    });

    it("does not apply no-overlay class when overlay={true}", () => {
      const { container } = render(
        <Hero
          variant="tall"
          bgImage="/images/hero-bg/home-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const root = container.querySelector(".Hero-root--no-overlay");
      expect(root).not.toBeInTheDocument();
    });
  });

  describe("Text Content", () => {
    it("renders title correctly", () => {
      render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/test-hero.jpg"
          title="Hero Title"
          subtitle="Hero Subtitle"
          overlay={true}
        />
      );
      const title = screen.getByRole("heading", { level: 1 });
      expect(title).toHaveTextContent("Hero Title");
    });

    it("renders subtitle correctly", () => {
      render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/test-hero.jpg"
          title="Hero Title"
          subtitle="Hero Subtitle"
          overlay={true}
        />
      );
      const subtitle = screen.getByText("Hero Subtitle");
      expect(subtitle).toBeInTheDocument();
    });

    it("uses semantic h1 for title", () => {
      render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/test-hero.jpg"
          title="Hero Title"
          subtitle="Hero Subtitle"
          overlay={true}
        />
      );
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Hero Title");
    });

    it("uses semantic p for subtitle", () => {
      const { container } = render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/test-hero.jpg"
          title="Hero Title"
          subtitle="Hero Subtitle"
          overlay={true}
        />
      );
      const subtitle = container.querySelector(".Hero-subtitle");
      expect(subtitle?.tagName).toBe("P");
    });
  });

  describe("Responsive Behavior", () => {
    it("renders Hero section with proper structure", () => {
      const { container } = render(
        <Hero
          variant="tall"
          bgImage="/images/hero-bg/home-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const section = container.querySelector("section.Hero-root");
      expect(section).toBeInTheDocument();
    });

    it("applies correct classes for tall variant", () => {
      const { container } = render(
        <Hero
          variant="tall"
          bgImage="/images/hero-bg/home-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const root = container.querySelector(".Hero-root");
      expect(root).toHaveClass("Hero-root--tall");
    });

    it("applies correct classes for short variant", () => {
      const { container } = render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/test-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const root = container.querySelector(".Hero-root");
      expect(root).toHaveClass("Hero-root--short");
    });
  });

  describe("Accessibility", () => {
    it("renders semantic section element", () => {
      const { container } = render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/test-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });

    it("background image has empty alt text (decorative)", () => {
      const { container } = render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/test-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const bgImage = container.querySelector(".Hero-bgImage");
      expect(bgImage).toHaveAttribute("alt", "");
    });

    it("maintains proper heading hierarchy", () => {
      render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/test-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe("Default Props", () => {
    it("overlay defaults to true", () => {
      const { container } = render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/test-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
        />
      );
      const overlay = container.querySelector(".Hero-overlay");
      expect(overlay).toBeInTheDocument();
    });

    it("mobileBgImage is optional", () => {
      const { container } = render(
        <Hero
          variant="short"
          bgImage="/images/hero-bg/test-hero.jpg"
          title="Test Title"
          subtitle="Test Subtitle"
          overlay={true}
        />
      );
      const section = container.querySelector("section");
      expect(section).toBeInTheDocument();
    });
  });
});
