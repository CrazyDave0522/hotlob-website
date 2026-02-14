"use client";

import { useEffect, useRef } from "react";
import { X, MapPin } from "lucide-react";
import type { StoreWithDistance } from "@/utils/dishOrdering";

/**
 * Props for `StoreSelectionModal`.
 *
 * @property isOpen - Controls modal visibility. When `false` the component renders `null`.
 * @property onClose - Called when the modal should be closed (backdrop, close button, or Escape key).
 * @property onStoreSelect - Called with the selected `StoreWithDistance` when a store item is clicked.
 * @property stores - Array of `StoreWithDistance` objects to display. The modal renders name, address, optional distance, and handles ordering via dishUberUrl.
 */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStoreSelect: (store: StoreWithDistance) => void;
  stores: StoreWithDistance[];
}

/**
 * `StoreSelectionModal`
 *
 * A lightweight, accessible modal used for manual store selection. The modal can display
 * distance information when provided by the caller. Callers are responsible for location
 * detection and distance calculation.
 *
 * Behavior:
 * - Renders nothing when `isOpen` is `false`.
 * - Locks body scroll while open and restores it on close/unmount.
 * - Focuses the close button when opened and supports closing via Escape, backdrop click, and the close button.
 * - Invokes `onStoreSelect` with the chosen store and lets the parent handle navigation/closing.
 *
 * Accessibility:
 * - Overlay has `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
 * - Store items are rendered as buttons with `role="listitem"` inside a `role="list"` container.
 */
export function StoreSelectionModal({
  isOpen,
  onClose,
  onStoreSelect,
  stores,
}: Props) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<Element | null>(null);

  function getFocusableElements(root: HTMLElement | null) {
    if (!root) return [] as HTMLElement[];
    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => !el.hasAttribute("disabled"),
    );
  }

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev;
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Save previous focused element to restore focus when modal closes
      previousActiveElementRef.current = document.activeElement;

      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        const focusable = getFocusableElements(containerRef.current);
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        const active = document.activeElement as HTMLElement | null;
        const idx = active ? focusable.indexOf(active) : -1;
        const dir = e.shiftKey ? -1 : 1;
        const next =
          (((idx + dir) % focusable.length) + focusable.length) %
          focusable.length;
        focusable[Math.max(0, next)].focus();
      };

      window.addEventListener("keydown", handleTab);
      return () => window.removeEventListener("keydown", handleTab);
    } else {
      // restore focus to previously active element
      try {
        (previousActiveElementRef.current as HTMLElement | null)?.focus();
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="StoreSelectionModal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="store-selection-title"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="StoreSelectionModal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(1px, 1px, 1px, 1px)",
          }}
        >
          {stores.length > 0
            ? `${stores.length} stores available`
            : "No stores available"}
        </div>
        <div className="StoreSelectionModal-header">
          <h2 id="store-selection-title" className="StoreSelectionModal-title">
            Select a store
          </h2>
          <button
            ref={closeButtonRef}
            className="StoreSelectionModal-closeButton"
            onClick={onClose}
            aria-label="Close store selection modal"
          >
            <X />
          </button>
        </div>

        <div className="StoreSelectionModal-storeList" role="list">
          {stores.length === 0 ? (
            <div className="StoreSelectionModal-emptyMessage">
              No stores available
            </div>
          ) : (
            stores.map((s) => (
              <button
                key={s.id}
                className="StoreSelectionModal-storeItem"
                onClick={() => onStoreSelect(s)}
                role="listitem"
              >
                <div className="StoreSelectionModal-storeName">{s.name}</div>
                <div className="StoreSelectionModal-storeDetails">
                  <div className="StoreSelectionModal-storeAddress">
                    {[s.street, s.suburb, s.state, s.postcode]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                  {s.distance !== undefined && (
                    <div className="StoreSelectionModal-storeDistance">
                      <MapPin size={14} />
                      {s.distance.toFixed(1)} km away
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StoreSelectionModal;
