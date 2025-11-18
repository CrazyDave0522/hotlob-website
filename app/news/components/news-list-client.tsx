"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { stripHtmlTags, getSmartExcerpt } from "@/lib/utils/stripHtml";
import NewsListItem from "./news-list-item";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string;
  publish_date: string;
};

interface NewsListClientProps {
  initialItems: NewsItem[];
}

export default function NewsListClient({ initialItems }: NewsListClientProps) {
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialItems.length === 5);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("news")
        .select("id,title,slug,excerpt,content,cover_image_url,publish_date")
        .eq("is_published", true)
        .order("publish_date", { ascending: false })
        .range(items.length, items.length + 4); // Load next 5 items

      if (error) throw error;

      const newItems = Array.isArray(data) ? (data as NewsItem[]) : [];

      if (newItems.length < 5) {
        setHasMore(false);
      }

      setItems([...items, ...newItems]);
    } catch (error) {
      console.error("Failed to load more news:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* News List Container */}
      <div className="mx-auto bg-white rounded-md shadow-[0_0_10px_0_rgba(0,0,0,0.12)]" style={{ width: '72.917%', maxWidth: '1400px' }}>
        {items.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No news available
          </div>
        ) : (
          items.map((news, index) => {
            const plainText = news.excerpt || stripHtmlTags(news.content);
            const excerpt = getSmartExcerpt(plainText);
            return (
              <div key={news.id}>
                <NewsListItem
                  slug={news.slug}
                  title={news.title}
                  excerpt={excerpt}
                  coverImageUrl={news.cover_image_url}
                  publishDate={news.publish_date}
                />
                {/* Divider line between items (not after last item) */}
                {index < items.length - 1 && (
                  <div className="w-full h-px bg-[#E1E4E9]" />
                )}
              </div>
            );
          }))
        }
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div style={{ width: '72.917%', maxWidth: '1400px' }} className="mx-auto pb-[60px]">
          <div
            onClick={loading ? undefined : loadMore}
            className="group h-[50px] mt-5 flex justify-center items-center gap-2.5 rounded-md bg-white shadow-[0_0_6px_0_rgba(0,0,0,0.04)] hover:shadow-[0_0_10px_0_rgba(0,0,0,0.15)] transition-shadow cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5 text-[#4E5969] text-base font-normal group-hover:text-[#EA4148] transition-colors">
              {loading ? "Loading..." : "more"}
              {!loading && (
                <>
                  <Image
                    src="/images/icons/arrow-right.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0 group-hover:hidden"
                    style={{ aspectRatio: '1/1' }}
                  />
                  <Image
                    src="/images/icons/arrow-right-active.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0 hidden group-hover:block"
                    style={{ aspectRatio: '1/1' }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
