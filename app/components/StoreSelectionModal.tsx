"use client";

import { haversineDistance } from "@/lib/utils/geo";

export interface StoreInfo {
  id: string;
  name: string;
  uber_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface StoreSelectionModalProps {
  stores: StoreInfo[];
  userLocation?: { lat: number; lng: number } | null;
  open: boolean;
  onClose: () => void;
}

export default function StoreSelectionModal({
  stores,
  userLocation,
  open,
  onClose,
}: StoreSelectionModalProps) {
  const sortedStores = [...stores];
  if (userLocation) {
    sortedStores.sort((a, b) => {
      const d1 =
        a.latitude && a.longitude
          ? haversineDistance(
              userLocation.lat,
              userLocation.lng,
              a.latitude,
              a.longitude
            )
          : Infinity;
      const d2 =
        b.latitude && b.longitude
          ? haversineDistance(
              userLocation.lat,
              userLocation.lng,
              b.latitude,
              b.longitude
            )
          : Infinity;
      return d1 - d2;
    });
  } else {
    sortedStores.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm m-4">
        <div className="font-semibold text-lg mb-4 text-[#1D1E1F] text-center">Select Store</div>
        <ul className="space-y-2 max-h-72 overflow-y-auto">
          {sortedStores.map((store) => (
            <li key={store.id}>
              <a
                href={store.uber_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 rounded text-[#1D1E1F] font-medium transition-colors hover:bg-[rgba(234,65,72,0.08)] hover:text-[#EA4148] active:bg-[rgba(234,65,72,0.12)]"
                onClick={onClose}
              >
                {store.name}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 w-full py-2 rounded bg-[#F2F3F5] text-[#1D1E1F] hover:bg-[#E5E6EB] transition-colors"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
