import type { ReactNode } from "react";

type ContentPageLayoutProps = {
  title: string;
  subtitle?: ReactNode;
  contentHtml: string;
  headerExtras?: ReactNode;
};

export function ContentPageLayout({ title, subtitle, contentHtml, headerExtras }: ContentPageLayoutProps) {
  return (
    <main className="min-h-screen bg-[#F7F8FA] flex justify-center items-start px-4">
      <div
        className="mt-11 mb-[60px] shrink-0 rounded-md bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.12)]"
        style={{ width: "72.917%", maxWidth: "1400px" }}
      >
        <h1 className="text-[20px] font-medium text-[#1D1E1F] leading-normal text-left ml-[30px] mt-[30px]">
          {title}
        </h1>
        {subtitle && (
          <div className="ml-[30px] mt-[18px] text-[12px] font-normal leading-normal text-[#999]">
            {subtitle}
          </div>
        )}
        <div className="ml-[30px] mt-3.5">
          <div className="h-px shrink-0 bg-[#E1E4E9]" style={{ width: "95.71%" }} />
        </div>
        {headerExtras}
        <div className="px-16 py-12 flex justify-center">
          <div className="prose-news mb-8" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </div>
    </main>
  );
}
