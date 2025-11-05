"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#F9F9F9]">
      <div className="text-center max-w-md px-4">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-semibold text-[#1D1E1F] mb-2">
          Something went wrong!
        </h2>
        <p className="text-lg text-[#86909C] mb-6">
          {error.message || "Failed to load the menu. Please try again."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-full bg-linear-to-r from-[#EA4148] to-[#FFA159] text-white font-medium hover:opacity-90 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
