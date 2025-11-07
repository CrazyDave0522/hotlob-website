"use client";

import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

let toastCounter = 0;

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
        memoryState.toasts = memoryState.toasts.filter(
          (t) => t.id !== action.toastId
        );
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
    (message: string, type: ToastType = "info", duration: number = 3000) => {
      const id = `toast-${++toastCounter}-${Date.now()}`;
      const newToast: Toast = { id, type, message, duration };

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
    (message: string, duration?: number) => toast(message, "success", duration),
    [toast]
  );

  const error = useCallback(
    (message: string, duration?: number) => toast(message, "error", duration),
    [toast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => toast(message, "warning", duration),
    [toast]
  );

  const info = useCallback(
    (message: string, duration?: number) => toast(message, "info", duration),
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
