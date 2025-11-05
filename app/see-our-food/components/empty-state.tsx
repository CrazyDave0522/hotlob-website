"use client";

export default function EmptyState() {
  return (
    <div className="w-full flex justify-center items-center py-24 bg-[#F9F9F9]">
      <div className="text-center">
        <div className="text-6xl mb-4">🦞</div>
        <h3 className="text-2xl font-semibold text-[#1D1E1F] mb-2">
          No dishes found
        </h3>
        <p className="text-lg text-[#86909C]">
          Try selecting different tags or check back later
        </p>
      </div>
    </div>
  );
}
