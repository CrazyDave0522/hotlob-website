import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { DishCardGrid } from "../../../components/DishCardGrid";
import type { DishWithRelations } from "../../../types/dish";

const mockFetchVisibleDishes = vi.fn();

vi.mock("../../../lib/dishes", () => ({
  fetchVisibleDishes: () => mockFetchVisibleDishes(),
}));

const sampleDishes: DishWithRelations[] = [
  {
    id: "dish-1",
    name: "Lobster Roll",
    description: "Buttery brioche with premium lobster.",
    tier: "premium",
    is_visible: true,
    is_available: true,
    media_asset: [
      {
        id: "image-1",
        dish_id: "dish-1",
        image_url: "/images/dish-1.jpg",
        position: 1,
      },
    ],
    dish_allergen: [
      {
        id: "allergen-1",
        dish_id: "dish-1",
        tag_id: "tag-1",
        allergen_tag: [
          {
            id: "tag-1",
            name: "Shellfish",
            icon_url: "/icons/shellfish.svg",
          },
        ],
      },
    ],
  },
  {
    id: "dish-2",
    name: "Crab Roll",
    description: "Sweet crab with lemon butter.",
    tier: "standard",
    is_visible: true,
    is_available: true,
    media_asset: [
      {
        id: "image-2",
        dish_id: "dish-2",
        image_url: "/images/dish-2.jpg",
        position: 1,
      },
    ],
    dish_allergen: [],
  },
];

const setMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
};

describe("DishCardGrid", () => {
  it("returns null when no dishes are available", async () => {
    setMatchMedia(true);
    mockFetchVisibleDishes.mockResolvedValueOnce([]);

    const { container } = render(<DishCardGrid />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("renders dishes when data is available", async () => {
    setMatchMedia(true);
    mockFetchVisibleDishes.mockResolvedValueOnce(sampleDishes);

    render(<DishCardGrid />);

    expect(await screen.findByText(/lobster roll/i)).toBeInTheDocument();
    expect(screen.getByText(/crab roll/i)).toBeInTheDocument();
  });

  it("expands only one card at a time on desktop", async () => {
    setMatchMedia(true);
    mockFetchVisibleDishes.mockResolvedValueOnce(sampleDishes);

    render(<DishCardGrid />);

    await screen.findByText(/lobster roll/i);
    const cards = screen.getAllByRole("article");

    fireEvent.mouseEnter(cards[0]);
    expect(cards[0]).toHaveClass("DishCard--expanded");

    fireEvent.mouseEnter(cards[1]);
    expect(cards[1]).toHaveClass("DishCard--expanded");
    expect(cards[0]).not.toHaveClass("DishCard--expanded");
  });

  it("does not expand cards on mobile", async () => {
    setMatchMedia(false);
    mockFetchVisibleDishes.mockResolvedValueOnce(sampleDishes);

    render(<DishCardGrid />);

    await screen.findByText(/lobster roll/i);
    const cards = screen.getAllByRole("article");

    fireEvent.mouseEnter(cards[0]);
    expect(cards[0]).not.toHaveClass("DishCard--expanded");
  });
});
