"use client";

import { useState, useEffect } from "react";
import {
  getCurrentPositionWithTimeout,
  haversineDistance,
} from "@/lib/utils/geo";
import StoreSelectionModal, { StoreInfo } from "@/app/components/StoreSelectionModal";

interface OrderButtonProps {
  stores?: StoreInfo[];
  fallbackUrl: string;
}

export default function OrderButton({ stores, fallbackUrl }: OrderButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = async () => {
    if (!stores || stores.length === 0) {
      window.open(fallbackUrl, "_blank");
      return;
    }
    setLocating(true);
    try {
      const pos = await getCurrentPositionWithTimeout(5000);
      const { latitude, longitude } = pos.coords;
      // Calculate nearest store
      const sorted = [...stores].sort((a, b) => {
        const d1 =
          a.latitude && a.longitude
            ? haversineDistance(latitude, longitude, a.latitude, a.longitude)
            : Infinity;
        const d2 =
          b.latitude && b.longitude
            ? haversineDistance(latitude, longitude, b.latitude, b.longitude)
            : Infinity;
        return d1 - d2;
      });
      const nearest = sorted[0];
      if (nearest && nearest.uber_url) {
        window.open(nearest.uber_url, "_blank");
      } else {
        setModalOpen(true);
      }
    } catch {
      setModalOpen(true);
    } finally {
      setLocating(false);
    }
  };

  return (
    <>
      <button
        className={isMobile ? "" : "order-button-base order-button-default"}
        onClick={handleClick}
        disabled={locating}
        style={isMobile ? {
          display: 'flex',
          width: '200px',
          padding: '6px 0',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          background: locating ? 'rgba(234, 65, 72, 0.6)' : 'linear-gradient(90deg, #ea4148 0%, #ffa159 100%)',
          boxShadow: '3px 3px 0 0 rgba(175, 23, 23, 0.16)',
          borderRadius: '30px 30px 0 30px',
          border: 'none',
          cursor: locating ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
          color: '#FFF',
          fontSize: '24px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: 'normal'
        } : {}}
        onMouseEnter={(e) => {
          if (!locating && isMobile) {
            e.currentTarget.style.background = 'linear-gradient(90deg, #d13a40 0%, #e68a4a 100%)';
            e.currentTarget.style.boxShadow = '5px 5px 0 0 rgba(175, 23, 23, 0.24)';
          }
        }}
        onMouseLeave={(e) => {
          if (!locating && isMobile) {
            e.currentTarget.style.background = 'linear-gradient(90deg, #ea4148 0%, #ffa159 100%)';
            e.currentTarget.style.boxShadow = '3px 3px 0 0 rgba(175, 23, 23, 0.16)';
          }
        }}
      >
        Order Now
      </button>
      <StoreSelectionModal
        stores={stores || []}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
