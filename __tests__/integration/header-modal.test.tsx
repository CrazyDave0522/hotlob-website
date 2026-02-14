import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { Header } from "../../components/Header";
import type { Store } from "../../types/store";

vi.mock("../../lib/store", () => ({
  fetchStores: vi.fn(),
}));

vi.mock("../../utils/geolocation", () => ({
  tryGetQuickLocation: vi.fn(),
}));

describe("Header -> StoreSelectionModal integration", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("opens modal when quick location is unavailable and opens Uber URL on select", async () => {
    const stores: Store[] = [
      {
        id: "s1",
        name: "Store One",
        street: "1 A St",
        suburb: "Town",
        state: "ST",
        postcode: "0000",
        created_at: "",
        updated_at: "",
        latitude: 0,
        longitude: 0,
        google_place_id: null,
        google_maps_embed_url: null,
        uber_url: "https://uber.one",
        email: "",
        google_url: "",
        google_rating: null,
        google_user_ratings_total: null,
        google_trading_hours: null,
        google_last_synced_at: null,
      },
    ];

    const storeModule = await import("../../lib/store");
    const fetchStores = storeModule.fetchStores as unknown as Mock<
      () => Promise<Store[]>
    >;
    fetchStores.mockResolvedValue(stores);

    type QuickLocation = { lat: number; lon: number } | null;
    const geoModule = await import("../../utils/geolocation");
    const tryGetQuickLocation =
      geoModule.tryGetQuickLocation as unknown as Mock<
        () => Promise<QuickLocation>
      >;
    tryGetQuickLocation.mockResolvedValue(null);

    const mockOpen = vi.fn() as Mock<(url: string, target?: string) => void>;
    interface GlobalWithOpen {
      open?: (url: string, target?: string) => void;
    }
    (global as unknown as GlobalWithOpen).open = mockOpen as unknown as (
      url: string,
      target?: string,
    ) => void;

    render(<Header />);

    const orderBtn = screen.getByRole("button", { name: /order online/i });
    fireEvent.click(orderBtn);

    // Modal should open
    await screen.findByRole("dialog");

    // Click store item
    const item = await screen.findByText(/store one/i);
    fireEvent.click(item);

    await waitFor(() =>
      expect(mockOpen).toHaveBeenCalledWith("https://uber.one", "_blank"),
    );
  });
});
