"use client";

import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  haversineDistance,
  getCurrentPositionWithTimeout,
} from "@/lib/utils/geo";
import { useToast } from "@/components/ui/use-toast";
import { sendCateringOrderEmail } from "@/lib/email";
import { getStoresBasic } from "@/lib/getStores";
import { CATERING_LAYOUT } from "../constants";

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
      const storesData = await getStoresBasic({ includeExtendedInfo: true });

      if (storesData.length === 0) {
        showError("Failed to load stores. Please refresh the page.");
        return;
      }

      // Extract basic store info for the form
      const basicStores: Store[] = storesData.map((store) => ({
        id: store.id,
        name: store.name,
        latitude: store.latitude || null,
        longitude: store.longitude || null,
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
          "Could not detect your location. Please select a store manually."
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
      const allStores = await getStoresBasic({ includeExtendedInfo: true });
      const storeData = allStores.find(
        (store) => store.id === formData.storeId
      );

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
              style={{ marginBottom: "clamp(4px, calc(8/750*100vw), 8px)" }}
            >
              Select a store
            </label>
            <select
              id="storeId"
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              required
              className="catering-form-select w-full md:h-10 px-2.5 items-center rounded-sm border border-[#CCCFD7] bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent"
              style={{ width: 'var(--store-select-width, 100%)', height: 'clamp(40px, calc(70/750*100vw), 70px)' }}
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
              style={{ marginBottom: "clamp(4px, calc(8/750*100vw), 8px)" }}
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
              className="w-full md:h-10 md:max-w-[340px] px-2.5 items-center rounded-sm border border-[#CCCFD7] bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent catering-form-input"
              style={{ height: 'clamp(40px, calc(70/750*100vw), 70px)' }}
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
              style={{ marginBottom: "clamp(4px, calc(8/750*100vw), 8px)" }}
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
              className="w-full md:h-10 md:max-w-[340px] px-2.5 items-center rounded-sm border border-[#CCCFD7] bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent catering-form-input"
              style={{ height: 'clamp(40px, calc(70/750*100vw), 70px)' }}
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
              style={{ marginBottom: "clamp(4px, calc(8/750*100vw), 8px)" }}
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
              className="w-full md:h-10 md:max-w-[340px] px-2.5 items-center rounded-sm border border-[#CCCFD7] bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent catering-form-input"
              style={{ height: 'clamp(40px, calc(70/750*100vw), 70px)' }}
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
              style={{ marginBottom: "clamp(4px, calc(8/750*100vw), 8px)" }}
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
              className={`w-full md:h-10 md:max-w-[340px] px-2.5 items-center rounded-sm border bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent catering-form-input ${
                errors.phone ? "border-red-500" : "border-[#CCCFD7]"
              }`}
              style={{ height: 'clamp(40px, calc(70/750*100vw), 70px)' }}
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
              style={{ marginBottom: "clamp(4px, calc(8/750*100vw), 8px)" }}
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
              className="w-full md:h-10 md:max-w-[340px] px-2.5 items-center rounded-sm border border-[#CCCFD7] bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent catering-form-input"
              style={{ height: 'clamp(40px, calc(70/750*100vw), 70px)' }}
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
              style={{ marginBottom: "clamp(4px, calc(8/750*100vw), 8px)" }}
            >
              Pick up time on catering date
            </label>
            <select
              id="pickupTime"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              required
              className="w-full md:h-10 md:max-w-[340px] px-2.5 items-center rounded-sm border border-[#CCCFD7] bg-white focus:ring-2 focus:ring-[#EA4148] focus:border-transparent catering-form-select"
              style={{ height: 'clamp(40px, calc(70/750*100vw), 70px)' }}
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
