"use client";

import React, { ReactNode } from "react";

type ContentPageLayoutProps = {
  title: string;
  subtitle?: ReactNode;
  contentHtml: string;
  headerExtras?: ReactNode;
};

export function ContentPageLayout({ title, subtitle, contentHtml, headerExtras }: ContentPageLayoutProps) {
  return (
    <main className="min-h-screen bg-[#F7F8FA] flex justify-center items-start px-4">
      <div className="mt-11 mb-[60px] shrink-0 w-full max-w-[690px] md:w-[72.917%] md:max-w-[1400px] md:rounded-md md:bg-white md:shadow-[0_0_10px_0_rgba(0,0,0,0.12)]">
        <h1 className="content-page-title font-medium text-[#1D1E1F] leading-normal text-left">
          {title}
        </h1>
        {subtitle && (
          <div className="content-page-meta mt-[18px] font-normal leading-normal text-[#999]">
            {subtitle}
          </div>
        )}
        <div className="mt-3.5 md:ml-[30px]">
          <div className="h-px shrink-0 bg-[#E1E4E9] w-full md:w-[95.71%]" />
        </div>
        {headerExtras}
        <div className="py-5 flex justify-center md:px-16 md:py-12">
          <div
            className="prose-news mb-8 prose-news-mobile content-page-body"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </div>
    </main>
  );
}
