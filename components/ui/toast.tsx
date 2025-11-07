"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast, type Toast, type ToastType } from "./use-toast";

// Toast background colors based on type
const toastStyles: Record<
  ToastType,
  { bg: string; radius: number; icon: string }
> = {
  success: {
    bg: "rgba(43, 164, 113, 0.10)",
    radius: 6,
    icon: "/images/icons/toast-success.svg",
  },
  error: {
    bg: "#FCF0F0",
    radius: 4,
    icon: "/images/icons/toast-error.svg",
  },
  warning: {
    bg: "rgba(240, 131, 27, 0.10)",
    radius: 6,
    icon: "/images/icons/toast-warning.svg",
  },
  info: {
    bg: "rgba(87, 114, 255, 0.10)",
    radius: 6,
    icon: "/images/icons/toast-info.svg",
  },
};

function ToastItem({ toast }: { toast: Toast }) {
  // Fade-in / fade-out visibility state
  const [visible, setVisible] = useState(false);
  const style = toastStyles[toast.type];

  useEffect(() => {
    // Trigger fade-in on mount
    const enterTimer = setTimeout(() => setVisible(true), 10);

    // Trigger fade-out shortly before auto-dismiss to feel smooth
    const duration = toast.duration ?? 3000;
    const fadeOutMs = 300;
    const exitTimer = setTimeout(() => setVisible(false), Math.max(duration - fadeOutMs, 0));

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [toast.duration]);

  return (
    <div
      style={{
        display: "inline-flex",
        padding: "13px 16px",
        alignItems: "center",
        gap: "24px",
        borderRadius: `${style.radius}px`,
        background: style.bg,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
        pointerEvents: "auto",
      }}
      role="status"
      aria-live={toast.type === "error" ? "assertive" : "polite"}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Image
          src={style.icon}
          alt={toast.type}
          width={20}
          height={20}
          style={{ flexShrink: 0 }}
        />
        <span
          style={{
            color: "#4E5969",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "22px",
          }}
        >
          {toast.message}
        </span>
      </div>
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
