"use client";

import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  haversineDistance,
  getCurrentPositionWithTimeout,
} from "@/lib/utils/geo";
import { useToast } from "@/components/ui/use-toast";
import { sendCateringOrderEmail } from "@/lib/email";
import { getStoresWithDetails, StoreWithData } from "@/lib/getStores";
import { parseOpeningHoursArray, generateSlotsForRanges } from "@/lib/parseOpeningHours";

interface Store {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  openingHoursWeekdayText?: string[] | null;
}

// Calculate minimum date (2 days from today) using local timezone
function getMinCateringDate(): string {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 2); // Add 2 days
  const y = minDate.getFullYear();
  const m = String(minDate.getMonth() + 1).padStart(2, "0");
  const d = String(minDate.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Validate Australian phone number (mobile or landline)
function validateAustralianPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, ""); // Remove spaces, dashes, parentheses

  // Mobile: 04xx xxx xxx or +61 4xx xxx xxx
  const mobilePattern = /^(\+?61|0)?4\d{8}$/;
  // Landline: (0x) xxxx xxxx or +61 x xxxx xxxx
  const landlinePattern = /^(\+?61|0)?[2378]\d{8}$/;

  if (mobilePattern.test(cleaned) || landlinePattern.test(cleaned)) {
    return "";
  }

  return "Please enter a valid Australian phone number (mobile: 04xx xxx xxx, landline: (0x) xxxx xxxx)";
}

export default function CateringForm() {
  const { success, error: showError, warning } = useToast();
  const [stores, setStores] = useState<Store[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [timeDisabledHint, setTimeDisabledHint] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    storeId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cateringDate: "",
    pickupTime: "",
  });
  const [errors, setErrors] = useState({
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch stores on component mount
  useEffect(() => {
    async function fetchStores() {
      const storesData = await getStoresWithDetails();

      if (storesData.length === 0) {
        showError("Failed to load stores. Please refresh the page.");
        return;
      }

      // Extract basic store info for the form
      const basicStores: Store[] = (storesData as StoreWithData[]).map((store) => ({
        id: store.id,
        name: store.name,
        latitude: store.latitude || null,
        longitude: store.longitude || null,
        openingHoursWeekdayText: store.openingHoursWeekdayText ?? null,
      }));

      setStores(basicStores);

      // Try to get user location and select nearest store
      try {
        const position = await getCurrentPositionWithTimeout(5000);
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Find nearest store with valid coordinates
        let nearestStore: Store | null = null;
        let minDistance = Infinity;

        basicStores.forEach((store) => {
          if (store.latitude !== null && store.longitude !== null) {
            const distance = haversineDistance(
              userLat,
              userLng,
              store.latitude,
              store.longitude
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearestStore = store;
            }
          }
        });

        // Auto-select nearest store if found
        if (nearestStore) {
          setFormData((prev) => ({ ...prev, storeId: nearestStore!.id }));
        }
      } catch (error) {
        // Show warning if location access is denied or times out
        console.log("Could not get user location:", error);
        warning(
          "Could not detect your location. Please select a store manually.",
          {
            key: "catering-location-warning",
            dedupeMs: 2000,
            replace: true,
          }
        );
      }
    }

    fetchStores();
  }, [showError, warning]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Final validation before submission
    const phoneError = validateAustralianPhone(formData.phone);
    if (phoneError) {
      setErrors((prev) => ({ ...prev, phone: phoneError }));
      showError("Please fix the errors before submitting.");
      setIsSubmitting(false);
      return;
    }

    // Validate pickupTime against availableSlots
    if (formData.pickupTime) {
      if (availableSlots.length > 0 && !availableSlots.includes(formData.pickupTime)) {
        showError("Selected pickup time is not available for the chosen store/date. Please select a different time.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const { error } = await supabase.from("catering_orders").insert([
        {
          store_id: formData.storeId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          catering_date: formData.cateringDate,
          pickup_time: formData.pickupTime,
        },
      ]);

      if (error) throw error;

      // Get store details for email
      const allStores = await getStoresWithDetails();
      const storeData = (allStores as StoreWithData[]).find((s) => s.id === formData.storeId);

      if (!storeData?.email) {
        console.error("Store email not found for store:", formData.storeId);
        // Don't fail the submission for email issues
      } else {
        // Send email notification
        try {
          await sendCateringOrderEmail(storeData.email, {
            storeName: storeData.name,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            cateringDate: formData.cateringDate,
            pickupTime: formData.pickupTime,
          });
        } catch (emailError) {
          console.error("Error sending email:", emailError);
          // Don't fail the submission for email issues
        }
      }

      success("Order submitted successfully! We'll contact you soon.");

      // Keep the current store selection for convenience
      const currentStoreId = formData.storeId;

      // Reset form but keep store selection
      setFormData({
        storeId: currentStoreId,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        cateringDate: "",
        pickupTime: "",
      });
      setErrors({ phone: "" });
    } catch (error) {
      console.error("Error submitting order:", error);
      showError("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Recompute available slots when storeId or cateringDate changes
  useEffect(() => {
    const { storeId, cateringDate, pickupTime } = formData;
    // reset hints
    setTimeDisabledHint(null);
    if (!storeId || !cateringDate) {
      setAvailableSlots([]);
      return;
    }

    const store = stores.find((s) => s.id === storeId);
    // get weekday name from date (local)
    const date = new Date(cateringDate + "T00:00:00");
    const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = weekdayNames[date.getDay()];

    const weekdayText = store?.openingHoursWeekdayText ?? null;
    const parsed = parseOpeningHoursArray(weekdayText);
    const ranges = parsed[weekday] ?? [];
    if (!ranges || ranges.length === 0) {
      // closed or no data
      setAvailableSlots([]);
      setTimeDisabledHint("This store is closed on the selected date");
      // clear previous selection if any
      setFormData((prev) => ({ ...prev, pickupTime: "" }));
      return;
    }

    const slots = generateSlotsForRanges(ranges, 30);
    if (!slots || slots.length === 0) {
      setAvailableSlots([]);
      setTimeDisabledHint("No available pickup slots for the selected date");
      setFormData((prev) => ({ ...prev, pickupTime: "" }));
      return;
    }

    setAvailableSlots(slots);
    // if current selected time no longer valid, clear it
    if (pickupTime && !slots.includes(pickupTime)) {
      setFormData((prev) => ({ ...prev, pickupTime: "" }));
    }
  }, [formData, stores]);

  return (
    <div
      id="catering-form"
      className="catering-form-container"
    >
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col md:flex-row md:flex-wrap md:items-start md:justify-start"
        style={{ gap: "clamp(15px, calc(30/750*100vw), 30px)" }}
      >
        {/* Store selection - full width in mobile */}
        <div className="w-full md:block">
          <div className="w-full">
            <label
              htmlFor="storeId"
              className="catering-form-label block font-medium text-gray-700"
            >
              Select a store
            </label>
            <select
              id="storeId"
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              required
              className="catering-form-select w-full"
            >
            <option value="">Select a store</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                Pick up @{store.name}
              </option>
            ))}
          </select>
          </div>
        </div>

        {/* First name - full width in mobile */}
        <div className="w-full md:w-auto md:flex-1 md:min-w-[calc(50%-15px)]">
          <div className="w-full md:w-full">
            <label
              htmlFor="firstName"
              className="catering-form-label block font-medium text-gray-700"
            >
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="catering-form-input w-full"
              placeholder="Enter first name"
            />
          </div>
        </div>

        {/* Last name - full width in mobile */}
        <div className="w-full md:w-auto md:flex-1 md:min-w-[calc(50%-15px)]">
          <div className="w-full md:w-full">
            <label
              htmlFor="lastName"
              className="catering-form-label block font-medium text-gray-700"
            >
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="catering-form-input w-full"
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Email - full width in mobile */}
        <div className="w-full md:w-auto md:flex-1 md:min-w-[calc(50%-15px)]">
          <div className="w-full md:w-full">
            <label
              htmlFor="email"
              className="catering-form-label block font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="catering-form-input w-full"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Phone - full width in mobile */}
        <div className="w-full md:w-auto md:flex-1 md:min-w-[calc(50%-15px)]">
          <div className="w-full md:w-full">
            <label
              htmlFor="phone"
              className="catering-form-label block font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={(e) => {
                const error = validateAustralianPhone(e.target.value);
                setErrors((prev) => ({ ...prev, phone: error }));
              }}
              required
              className={`catering-form-input w-full ${errors.phone ? "border-red-500" : "border-[#CCCFD7]"}`}
              placeholder="+61 xxx xxx xxx"
            />
            {errors.phone && (
              <p className="catering-form-error text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Catering date - full width in mobile */}
        <div className="w-full md:w-auto md:flex-1 md:min-w-[calc(50%-15px)]">
          <div className="w-full md:w-full">
            <label
              htmlFor="cateringDate"
              className="catering-form-label block font-medium text-gray-700"
            >
              Catering date
            </label>
            <input
              type="date"
              id="cateringDate"
              name="cateringDate"
              value={formData.cateringDate}
              onChange={handleChange}
              min={getMinCateringDate()}
              required
              className="catering-form-input w-full"
            />
            <p className="catering-form-hint text-gray-500 mt-1">
              Orders must be placed at least 2 days in advance
            </p>
          </div>
        </div>

        {/* Pick up time - full width in mobile */}
        <div className="w-full md:w-auto md:flex-1 md:min-w-[calc(50%-15px)]">
          <div className="w-full md:w-full">
            <label
              htmlFor="pickupTime"
              className="catering-form-label block font-medium text-gray-700"
            >
              Pick up time on catering date
            </label>
            {/* Native time input with 30-minute step */}
            <input
              type="time"
              id="pickupTime"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              required
              step={1800}
              min={availableSlots.length ? availableSlots[0] : undefined}
              max={availableSlots.length ? availableSlots[availableSlots.length - 1] : undefined}
              className="catering-form-select w-full"
              disabled={availableSlots.length === 0}
            />
            {timeDisabledHint ? (
              <p className="catering-form-hint text-gray-500 mt-1">{timeDisabledHint}</p>
            ) : (
              availableSlots.length > 0 && (
                <p className="catering-form-hint text-gray-500 mt-1">Available from {availableSlots[0]} to {availableSlots[availableSlots.length - 1]}</p>
              )
            )}
          </div>
        </div>

        {/* Submit button */}
        <div className="w-full flex justify-center" style={{ marginTop: "clamp(20px, calc(40/750*100vw), 40px)" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="catering-form-submit order-button-base rounded-[40px] md:rounded-[30px]"
            style={{ width: "clamp(280px, calc(600/750*100vw), 600px)", height: "clamp(40px, calc(80/750*100vw), 80px)", fontSize: "clamp(17px, calc(34/750*100vw), 34px)" }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
      <style jsx>{`
        @media (min-width: 1024px) {
          button.catering-form-submit {
            width: clamp(150px, calc(300/1920*100vw), 300px) !important;
            height: clamp(23px, calc(46/1920*100vw), 46px) !important;
            font-size: clamp(9px, calc(18/1920*100vw), 18px) !important;
          }
        }
      `}</style>
    </div>
  );
}
