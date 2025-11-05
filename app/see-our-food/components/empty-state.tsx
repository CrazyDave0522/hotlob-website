"use client";

export default function EmptyState() {
  return (
    <div className="w-full flex justify-center pb-16 bg-[#F9F9F9]">
      {/* 保持和 DishGrid 相同的容器结构，设置最小高度避免页面跳动 */}
      <div className="flex items-center justify-center pt-[30px] max-w-[1600px] min-h-[600px]">
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
    </div>
  );
}
