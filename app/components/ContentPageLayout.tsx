"use client";

import React, { useState, useEffect, ReactNode } from "react";

type ContentPageLayoutProps = {
  title: string;
  subtitle?: ReactNode;
  contentHtml: string;
  headerExtras?: ReactNode;
};

export function ContentPageLayout({ title, subtitle, contentHtml, headerExtras }: ContentPageLayoutProps) {
  // Mobile detection (client-side only)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <main className={`min-h-screen bg-[#F7F8FA] flex justify-center items-start ${isMobile ? '' : 'px-4'}`}>
      <div
        className={`mt-11 mb-[60px] shrink-0 ${isMobile ? '' : 'rounded-md bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.12)]'}`}
        style={isMobile ? { width: 'calc(100vw - 60px)', marginLeft: '30px', marginRight: '30px' } : { width: "72.917%", maxWidth: "1400px" }}
      >
        <h1 className={`font-medium text-[#1D1E1F] leading-normal text-left ${isMobile ? '' : 'mt-[30px]'} ${isMobile ? '' : 'ml-[30px]'}`} style={{ fontSize: isMobile ? '40px' : '20px' }}>
          {title}
        </h1>
        {subtitle && (
          <div className={`mt-[18px] font-normal leading-normal text-[#999] ${isMobile ? '' : 'ml-[30px]'}`} style={{ fontSize: isMobile ? '24px' : '12px' }}>
            {subtitle}
          </div>
        )}
        <div className={`mt-3.5 ${isMobile ? '' : 'ml-[30px]'}`}>
          <div className="h-px shrink-0 bg-[#E1E4E9]" style={{ width: isMobile ? "100%" : "95.71%" }} />
        </div>
        {headerExtras}
        <div className={isMobile ? "py-5 flex justify-center" : "px-16 py-12 flex justify-center"}>
          <div className={`prose-news mb-8 ${isMobile ? 'prose-news-mobile' : ''}`} style={isMobile ? { fontSize: '32px' } : {}} dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </div>
    </main>
  );
}
