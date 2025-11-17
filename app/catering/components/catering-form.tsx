"use client";

import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  haversineDistance,
  getCurrentPositionWithTimeout,
} from "@/lib/utils/geo";
import { useToast } from "@/components/ui/use-toast";

interface Store {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
}

// Calculate minimum date (2 days from today)
function getMinCateringDate(): string {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 2); // Add 2 days
  return minDate.toISOString().split("T")[0];
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
      const { data, error } = await supabase
        .from("store")
        .select("id, name, latitude, longitude")
        .order("name");

      if (error) {
        console.error("Error fetching stores:", error);
        showError("Failed to load stores. Please refresh the page.");
      } else if (data) {
        setStores(data);

        // Try to get user location and select nearest store
        try {
          const position = await getCurrentPositionWithTimeout(5000);
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          // Find nearest store with valid coordinates
          let nearestStore: Store | null = null;
          let minDistance = Infinity;

          data.forEach((store) => {
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
          warning("Could not detect your location. Please select a store manually.");
        }
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

  return (
    <div
      className="absolute left-[7.2%] bottom-[11%] w-[36.979%]"
      style={{
        // Use bottom anchor so vertical placement is stable across container heights
        // Adjusted to 10% to move the form slightly upward from previous 8%
        display: "flex",
        flexWrap: "wrap",
        gap: "30px",
      }}
    >
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-wrap gap-[30px]"
      >
        {/* Store selection - full width row, but input matches other fields */}
        <div className="w-full">
          <label
            htmlFor="storeId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Select a store
          </label>
          <select
            id="storeId"
            name="storeId"
            value={formData.storeId}
            onChange={handleChange}
            required
            style={{ width: "calc(50% - 15px)" }}
            className="flex h-10 px-2.5 items-center rounded-sm border border-[#CCCFD7] bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent"
          >
            <option value="">Select a store</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                Pick up @{store.name}
              </option>
            ))}
          </select>
        </div>

        {/* First name - half width */}
        <div className="flex-1 min-w-[calc(50%-15px)]">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="flex w-full max-w-[340px] h-10 px-2.5 items-center rounded-sm border border-[#CCCFD7] bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent"
            placeholder="Enter first name"
          />
        </div>

        {/* Last name - half width */}
        <div className="flex-1 min-w-[calc(50%-15px)]">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="flex w-full max-w-[340px] h-10 px-2.5 items-center rounded-sm border border-[#CCCFD7] bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent"
            placeholder="Enter last name"
          />
        </div>

        {/* Email - half width */}
        <div className="flex-1 min-w-[calc(50%-15px)]">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="flex w-full max-w-[340px] h-10 px-2.5 items-center rounded-sm border border-[#CCCFD7] bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        {/* Phone - half width */}
        <div className="flex-1 min-w-[calc(50%-15px)]">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className={`flex w-full max-w-[340px] h-10 px-2.5 items-center rounded-sm border bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent ${
              errors.phone ? "border-red-500" : "border-[#CCCFD7]"
            }`}
            placeholder="+61 xxx xxx xxx"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Catering date - half width */}
        <div className="flex-1 min-w-[calc(50%-15px)]">
          <label
            htmlFor="cateringDate"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="flex w-full max-w-[340px] h-10 px-2.5 items-center rounded-sm border border-[#CCCFD7] bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent"
          />
          <p className="text-gray-500 text-xs mt-1">
            Orders must be placed at least 2 days in advance
          </p>
        </div>

        {/* Pick up time - half width */}
        <div className="flex-1 min-w-[calc(50%-15px)]">
          <label
            htmlFor="pickupTime"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pick up time on catering date
          </label>
          <select
            id="pickupTime"
            name="pickupTime"
            value={formData.pickupTime}
            onChange={handleChange}
            required
            className="flex w-full max-w-[340px] h-10 px-2.5 items-center rounded-sm border border-[#CCCFD7] bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent"
          >
            <option value="">Select time</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="13:00">01:00 PM</option>
            <option value="14:00">02:00 PM</option>
            <option value="15:00">03:00 PM</option>
            <option value="16:00">04:00 PM</option>
            <option value="17:00">05:00 PM</option>
            <option value="18:00">06:00 PM</option>
            <option value="19:00">07:00 PM</option>
            <option value="20:00">08:00 PM</option>
            <option value="21:00">09:00 PM</option>
          </select>
        </div>

        {/* Submit button */}
        <div className="w-full flex justify-center mt-2.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="order-button-base order-button-catering"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
