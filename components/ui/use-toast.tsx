"use client";

import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  key?: string;
}

type ToastInput = number | ToastOptions | undefined;

export interface ToastOptions {
  duration?: number;
  key?: string;
  dedupeMs?: number; // skip showing same-key toasts within this window
  replace?: boolean; // if true, replace existing same-key toast
}

interface ToastState {
  toasts: Toast[];
}

let toastCounter = 0;

// Track last shown times for deduping
const lastToastTimeByKey = new Map<string, number>();
const toastIdByKey = new Map<string, string>();
const toastKeyById = new Map<string, string>();

const listeners: Array<(toasts: Toast[]) => void> = [];
const memoryState: ToastState = { toasts: [] };

function dispatch(action: { type: string; toast?: Toast; toastId?: string }) {
  switch (action.type) {
    case "ADD_TOAST":
      if (action.toast) {
        memoryState.toasts = [...memoryState.toasts, action.toast];
      }
      break;
    case "REMOVE_TOAST":
      if (action.toastId) {
        const toast = memoryState.toasts.find((t) => t.id === action.toastId);
        memoryState.toasts = memoryState.toasts.filter((t) => t.id !== action.toastId);
        if (toast?.key) {
          // Clean up key mappings so future toasts aren't blocked
          const mappedId = toastIdByKey.get(toast.key);
          if (mappedId === action.toastId) {
            toastIdByKey.delete(toast.key);
          }
        }
        toastKeyById.delete(action.toastId);
      }
      break;
  }
  listeners.forEach((listener) => listener(memoryState.toasts));
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(memoryState.toasts);

  // Subscribe to toast changes
  useState(() => {
    listeners.push(setToasts);
    return () => {
      const index = listeners.indexOf(setToasts);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  });

  const toast = useCallback(
    (message: string, type: ToastType = "info", options?: ToastInput) => {
      const opts: ToastOptions =
        typeof options === "number"
          ? { duration: options }
          : options ?? {};

      const duration = opts.duration ?? 3000;
      const key = opts.key ?? `${type}:${message}`;
      const dedupeMs = opts.dedupeMs ?? 1500;
      const now = Date.now();
      const last = lastToastTimeByKey.get(key);
      const existingId = toastIdByKey.get(key);

      // Deduplicate within the window unless replace is requested
      if (!opts.replace && last && now - last < dedupeMs) {
        return existingId ?? key;
      }

      // Replace existing same-key toast if requested
      if (opts.replace && existingId) {
        dispatch({ type: "REMOVE_TOAST", toastId: existingId });
      }

      const id = `toast-${++toastCounter}-${now}`;
      const newToast: Toast = { id, type, message, duration, key };

      lastToastTimeByKey.set(key, now);
      toastIdByKey.set(key, id);
      toastKeyById.set(id, key);

      dispatch({ type: "ADD_TOAST", toast: newToast });

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          dispatch({ type: "REMOVE_TOAST", toastId: id });
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = useCallback((toastId: string) => {
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, []);

  const success = useCallback(
    (message: string, options?: ToastInput) => toast(message, "success", options),
    [toast]
  );

  const error = useCallback(
    (message: string, options?: ToastInput) => toast(message, "error", options),
    [toast]
  );

  const warning = useCallback(
    (message: string, options?: ToastInput) => toast(message, "warning", options),
    [toast]
  );

  const info = useCallback(
    (message: string, options?: ToastInput) => toast(message, "info", options),
    [toast]
  );

  return {
    toasts,
    toast,
    success,
    error,
    warning,
    info,
    dismiss,
  };
}
