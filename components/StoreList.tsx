"use client";

import React, { useEffect, useState } from "react";
import StoreItem from "./StoreItem";
import StoreSkeleton from "./StoreSkeleton";
import ErrorBoundary from "./ErrorBoundary";
import { fetchStoresWithPhotos } from "@/lib/store";
import type { Store, StorePhoto } from "@/types/store";
import "@/styles/components/store-list.css";

type StoreWithPhotos = Store & { photos: StorePhoto[] };

export default function StoreList() {
  const mockStores: (Store & { photos: StorePhoto[] })[] = [
    {
      id: "1",
      name: "Hotlob Karrinyup",
      street: "123 Test St",
      suburb: "Karrinyup",
      state: "WA",
      postcode: "6018",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      latitude: -31.877362,
      longitude: 115.77407,
      google_place_id: "ChIJ1234567890abcdef",
      google_maps_embed_url:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3388.0755525160557!2d115.77406987592653!3d-31.877362274052555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32af0d1c959563%3A0x2e3407f016dc3c56!2sHotlob%20Karrinyup!5e0!3m2!1sen!2sau!4v1762517036604!5m2!1sen!2sau",
      uber_url: "https://uber.com",
      email: "karrinyup@hotlob.com.au",
      google_url: "https://maps.google.com",
      google_rating: 4.7,
      google_user_ratings_total: 150,
      google_trading_hours: {
        open_now: true,
        weekday_text: [
          "Monday: 10:00 AM – 8:00 PM",
          "Tuesday: 10:00 AM – 8:00 PM",
        ],
      },
      google_last_synced_at: new Date().toISOString(),
      photos: [],
    },
    {
      id: "2",
      name: "Hotlob Elizabeth St",
      street: "456 Test St",
      suburb: "Melbourne CBD",
      state: "VIC",
      postcode: "3000",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      latitude: -37.817288,
      longitude: 144.962271,
      google_place_id: "ChIJ9876543210fedcba",
      google_maps_embed_url:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83528806166!2d144.9622712761652!3d-37.81728806166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0d1c959563%3A0x2e3407f016dc3c56!2sHotlob%20Elizabeth%20St!5e0!3m2!1sen!2sau!4v1762517036604!5m2!1sen!2sau",
      uber_url: "https://uber.com",
      email: "elizabeth@hotlob.com.au",
      google_url: "https://maps.google.com",
      google_rating: 3.9,
      google_user_ratings_total: 89,
      google_trading_hours: {
        open_now: false,
        weekday_text: [
          "Monday: 9:00 AM – 7:00 PM",
          "Tuesday: 9:00 AM – 7:00 PM",
        ],
      },
      google_last_synced_at: new Date().toISOString(),
      photos: [],
    },
  ];

  const [stores, setStores] = useState<StoreWithPhotos[]>(mockStores); // Initialize with mock data
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Determine if desktop on client side
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  useEffect(() => {
    async function loadStores() {
      try {
        const data = await fetchStoresWithPhotos();
        if (data.length > 0) {
          setStores(data); // Only update if we got real data
        }
      } catch (err) {
        console.error("Failed to load stores:", err);
        // Keep mock data on error
      } finally {
        setLoading(false);
      }
    }

    loadStores();
  }, []);

  if (loading) {
    return (
      <div className="store-list">
        <StoreSkeleton />
        <StoreSkeleton />
        <StoreSkeleton />
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="store-list">
        <div className="store-list-empty">No stores found</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="store-list">
        {stores.map((store, index) => {
          // Determine layout based on screen size and index
          let layout: "left" | "right" | "stacked" = "stacked";

          if (isDesktop) {
            layout = index % 2 === 0 ? "left" : "right";
          }

          return <StoreItem key={store.id} store={store} layout={layout} />;
        })}
      </div>
    </ErrorBoundary>
  );
}
