"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Removed direct ORDER_URL fallback usage; keep constants import only if needed elsewhere.
import { useState, useCallback } from "react";
import StoreSelectionModal, { StoreInfo } from "./StoreSelectionModal";
import { getStores } from "@/lib/getStores";
import { getCurrentPositionWithTimeout, haversineDistance } from "@/lib/utils/geo";

const NAV_ITEMS = [
  { label: "HOME", href: "/" },
  { label: "SEE OUR FOOD", href: "/see-our-food" },
  { label: "CATERING", href: "/catering" },
  { label: "OUR LOCATIONS", href: "/our-locations" },
  { label: "HOTLOB NEWS", href: "/news" },
];

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/hotlob/",
    icon: "/images/icons/fb.svg",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/hotlobaustralia/",
    icon: "/images/icons/ins.svg",
  },
];

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const [stores, setStores] = useState<StoreInfo[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  const handleOrderClick = useCallback(async () => {
    // Lazy load stores if not loaded yet
    if (!stores) {
      try {
        const all = await getStores({ includeOrderInfo: true });
        const simplified: StoreInfo[] = all.map(s => ({
          id: s.id,
          name: s.name,
          uber_url: s.uber_url,
          latitude: s.latitude,
          longitude: s.longitude,
        }));
        setStores(simplified);
      } catch (e) {
        console.error("Failed to load stores", e);
        // Show modal (empty) instead of ORDER_URL fallback per new requirement
        setModalOpen(true);
        return;
      }
    }
    const availableStores = stores || [];
    if (availableStores.length === 0) {
      // No stores data — open modal (will be empty) for consistency
      setModalOpen(true);
      return;
    }
    setLocating(true);
    try {
      const pos = await getCurrentPositionWithTimeout(5000);
      const { latitude, longitude } = pos.coords;
      setUserLoc({ lat: latitude, lng: longitude });
      // Find nearest store with uber_url
      const sorted = [...availableStores].sort((a, b) => {
        const d1 = (a.latitude && a.longitude) ? haversineDistance(latitude, longitude, a.latitude, a.longitude) : Infinity;
        const d2 = (b.latitude && b.longitude) ? haversineDistance(latitude, longitude, b.latitude, b.longitude) : Infinity;
        return d1 - d2;
      });
      const nearest = sorted.find(s => !!s.uber_url);
      if (nearest?.uber_url) {
        window.open(nearest.uber_url, "_blank");
      } else {
        setModalOpen(true);
      }
    } catch {
      // Geolocation failure => open modal for manual selection
      setModalOpen(true);
    } finally {
      setLocating(false);
    }
  }, [stores]);

  return (
    <header
      className="flex w-full max-w-[1920px] shrink-0 items-center justify-between bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      style={{
        paddingInline: "min(3.125vw, 60px)",
        height: "min(4.167vw, 80px)",
      }}
    >
      <Link
        href="/"
        aria-label="Hotlob home"
        className="shrink-0"
      >
        <Image
          src="/images/logo.png"
          alt="Hotlob logo"
          width={96}
          height={79}
          priority
          className="h-auto w-auto"
          style={{ width: "min(5vw, 96px)", height: "min(4.115vw, 79px)" }}
        />
      </Link>

      <nav
        className="ml-auto mr-auto flex flex-1 items-center justify-center text-[clamp(14px,0.938vw,18px)] font-semibold"
        style={{ gap: "min(4.167vw, 80px)" }}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`flex items-center justify-center gap-2.5 border-b-4 py-2.5 transition-colors hover:text-[#EA4148] ${
              isActive(item.href)
                ? "rounded-[10px] border-b-[#EA4148] text-[#EA4148]"
                : "border-b-transparent text-[#665F5B]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div
        className="flex items-center"
        style={{ gap: "min(1.875vw, 36px)" }}
      >
        <div
          className="flex items-center"
          style={{ gap: "min(1.042vw, 20px)" }}
        >
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.name}
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src={link.icon}
                alt={`${link.name} icon`}
                width={24}
                height={24}
                className="h-auto w-auto"
                style={{ width: "min(1.25vw, 24px)", height: "min(1.25vw, 24px)" }}
              />
            </a>
          ))}
        </div>
        <button
          onClick={handleOrderClick}
          disabled={locating}
          className="flex items-center justify-center bg-[#EA4148] text-[clamp(11px,0.677vw,13px)] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#C71E25] disabled:opacity-60"
          style={{
            width: "min(6.25vw, 120px)",
            height: "min(1.667vw, 32px)",
            borderRadius: "min(1.042vw, 20px)",
          }}
          aria-label="Order Online"
        >
          {locating ? "Locating..." : "Order Online"}
        </button>
      </div>
      <StoreSelectionModal
        stores={(stores || []).filter(s => !!s.uber_url)}
        userLocation={userLoc}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </header>
  );
}
