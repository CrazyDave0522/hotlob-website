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

interface StoreSelectionModalProps {
  stores: StoreInfo[];
  userLocation?: { lat: number; lng: number } | null;
  open: boolean;
  onClose: () => void;
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
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/20">
      <div className="bg-white rounded-tl-2xl rounded-tr-2xl shadow-lg p-6 w-full max-w-sm m-4">
        <div className="font-semibold text-lg mb-4">Select Store</div>
        <ul className="space-y-2 max-h-72 overflow-y-auto">
          {sortedStores.map((store) => (
            <li key={store.id}>
              <a
                href={store.uber_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 rounded hover:bg-gray-100 text-blue-600 font-medium"
                onClick={onClose}
              >
                {store.name}
              </a>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 w-full py-2 rounded bg-gray-200 text-gray-700"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
