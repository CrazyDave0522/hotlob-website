"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchStores } from "@/lib/store";
import type { Store } from "@/types/store";

const FALLBACK_OPEN_MINUTES = 10 * 60;
const FALLBACK_CLOSE_MINUTES = 17 * 60;
const SLOT_INTERVAL_MINUTES = 30;

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInput(value: string) {
  if (!value) {
    return null;
  }
  return new Date(`${value}T00:00:00`);
}

function formatTimeLabel(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}`;
}

function roundToNearestSlot(totalMinutes: number) {
  return Math.round(totalMinutes / SLOT_INTERVAL_MINUTES) * SLOT_INTERVAL_MINUTES;
}

function getStoreHoursForDate(store: Store, date: Date) {
  const periods = store.google_trading_hours?.periods;
  if (!periods || periods.length === 0) {
    return null;
  }

  const day = date.getDay();
  const period = periods.find((entry) => entry.open?.day === day);
  if (!period || !period.open || !period.close) {
    return null;
  }

  if (period.close.day !== period.open.day) {
    return null;
  }

  const openMinutes = period.open.hour * 60 + period.open.minute;
  const closeMinutes = period.close.hour * 60 + period.close.minute;
  if (closeMinutes <= openMinutes) {
    return null;
  }

  return { openMinutes, closeMinutes };
}

export function buildTimeOptions(store: Store | null, date: Date | null) {
  if (!store || !date) {
    return [];
  }

  const storeHours = getStoreHoursForDate(store, date) ?? {
    openMinutes: FALLBACK_OPEN_MINUTES,
    closeMinutes: FALLBACK_CLOSE_MINUTES,
  };

  const roundedOpen = roundToNearestSlot(storeHours.openMinutes);
  const startMinutes = Math.max(0, roundedOpen);
  const options: string[] = [];

  for (
    let minutes = startMinutes;
    minutes < storeHours.closeMinutes;
    minutes += SLOT_INTERVAL_MINUTES
  ) {
    options.push(formatTimeLabel(minutes));
  }

  return options;
}

export function CateringForm() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");

  const minDate = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return formatDateInput(today);
  }, []);

  const [selectedDate, setSelectedDate] = useState(minDate);
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchStores()
      .then((data) => {
        if (isMounted) {
          setStores(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setStores([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedStore = useMemo(
    () => stores.find((store) => store.id === selectedStoreId) ?? null,
    [stores, selectedStoreId]
  );

  const parsedDate = useMemo(
    () => parseDateInput(selectedDate) ?? parseDateInput(minDate),
    [selectedDate, minDate]
  );

  const timeOptions = useMemo(
    () => buildTimeOptions(selectedStore, parsedDate),
    [selectedStore, parsedDate]
  );

  useEffect(() => {
    setSelectedTime("");
  }, [selectedStoreId, selectedDate]);

  return (
    <form
      className="CateringPage-form"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="CateringPage-field">
        <label className="CateringPage-label" htmlFor="catering-store">
          Select a store
        </label>
        <div className="CateringPage-control">
          <select
            id="catering-store"
            name="store"
            className="CateringPage-input CateringPage-select"
            value={selectedStoreId}
            onChange={(event) => setSelectedStoreId(event.target.value)}
            required
          >
            <option value="" disabled>
              Select a store
            </option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                Pick up @{store.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="CateringPage-fieldSpacer" aria-hidden="true" />

      <div className="CateringPage-field">
        <label className="CateringPage-label" htmlFor="catering-first-name">
          First name
        </label>
        <div className="CateringPage-control">
          <input
            id="catering-first-name"
            name="firstName"
            type="text"
            className="CateringPage-input"
            placeholder="Enter first name"
            required
            pattern="[A-Za-z][A-Za-z' -]*"
          />
        </div>
      </div>

      <div className="CateringPage-field">
        <label className="CateringPage-label" htmlFor="catering-last-name">
          Last name
        </label>
        <div className="CateringPage-control">
          <input
            id="catering-last-name"
            name="lastName"
            type="text"
            className="CateringPage-input"
            placeholder="Enter last name"
            required
            pattern="[A-Za-z][A-Za-z' -]*"
          />
        </div>
      </div>

      <div className="CateringPage-field">
        <label className="CateringPage-label" htmlFor="catering-email">
          Email
        </label>
        <div className="CateringPage-control">
          <input
            id="catering-email"
            name="email"
            type="email"
            className="CateringPage-input"
            placeholder="Enter email"
            required
          />
        </div>
      </div>

      <div className="CateringPage-field">
        <label className="CateringPage-label" htmlFor="catering-phone">
          Phone
        </label>
        <div className="CateringPage-control">
          <input
            id="catering-phone"
            name="phone"
            type="tel"
            className="CateringPage-input"
            placeholder="Enter phone number"
            required
            pattern="(?:\\+?61\\s?4\\d{2}\\s?\\d{3}\\s?\\d{3}|0[2378]\\s?\\d{4}\\s?\\d{4})"
          />
        </div>
      </div>

      <div className="CateringPage-field">
        <label className="CateringPage-label" htmlFor="catering-date">
          Catering date
        </label>
        <div className="CateringPage-control">
          <input
            id="catering-date"
            name="cateringDate"
            type="date"
            className="CateringPage-input"
            min={minDate}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            required
          />
        </div>
        <span className="CateringPage-helper">
          Orders must be placed at least 2 days in advance
        </span>
      </div>

      <div className="CateringPage-field">
        <label className="CateringPage-label" htmlFor="catering-time">
          Pick up time
        </label>
        <div className="CateringPage-control">
          <select
            id="catering-time"
            name="pickupTime"
            className="CateringPage-input CateringPage-select"
            value={selectedTime}
            onChange={(event) => setSelectedTime(event.target.value)}
            disabled={!selectedStoreId}
            required
          >
            <option value="" disabled>
              Select a time
            </option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="CateringPage-formActions">
        <button type="submit" className="CateringPage-submit">
          SUBMIT
        </button>
      </div>
    </form>
  );
}
