import { supabase } from "../../../lib/supabaseClient";
import type { Metadata } from "next";
import Image from "next/image";
import { formatAUDate } from "../../../lib/utils/formatDate";

type NewsDetail = {
  title: string;
  excerpt?: string | null;
  content?: string | null;
  publish_date?: string | null;
  cover_image_url?: string | null;
};

export async function generateStaticParams() {
  const { data } = await supabase.from("news").select("slug");
  if (!Array.isArray(data)) return [];
  return data.map((d: { slug: string }) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = (await params) as { slug: string };
  const { data } = await supabase
    .from("news")
    .select("title,excerpt")
    .eq("slug", slug)
    .limit(1)
    .single();
  const news = data as NewsDetail | null;
  return {
    title: news ? news.title : "News Detail",
    description: news ? news.excerpt : "Hotlob news detail page.",
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = (await params) as { slug: string };
  const { data, error } = await supabase
    .from("news")
    .select("title,excerpt,content,publish_date,cover_image_url")
    .eq("slug", slug)
    .limit(1)
    .single();

  if (error || !data) {
    return <div className="max-w-2xl mx-auto py-12 px-4">News not found.</div>;
  }
  const news = data as NewsDetail;
  return (
    <main className="min-h-screen bg-[#F7F8FA] flex justify-center items-start px-4">
      <div className="shrink-0 rounded-md bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.12)] mt-11 mb-[60px]" style={{ width: '72.917%', maxWidth: '1400px' }}>
        <h1 className="text-[20px] font-medium text-[#1D1E1F] leading-normal text-left ml-[30px] mt-[30px]">
          {news.title}
        </h1>
        <span className="block text-[12px] font-normal text-[#999] leading-normal ml-[30px] mt-[18px]">
          {formatAUDate(news.publish_date)}
        </span>
        <div className="ml-[30px] mt-3.5">
          <div className="h-px shrink-0 bg-[#E1E4E9]" style={{ width: '95.71%' }} />
        </div>
        <div className="mt-5 flex justify-center items-center">
          {/* 封面图，假设 news.cover_image_url 有值 */}
          {news.cover_image_url && (
            <div className="relative shrink-0 mb-4" style={{ width: '64.286%', aspectRatio: '15/7' }}>
              <Image
                src={news.cover_image_url}
                alt={news.title}
                fill
                sizes="(min-width:1400px) 900px, 64.286vw"
                className="object-cover rounded-md"
                priority
              />
            </div>
          )}
        </div>
        {/* Render full HTML content if present; fall back to excerpt */}
        <div className="px-16 py-12 flex justify-center">
          <div className="prose-news mb-8">
            {news.content ? (
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            ) : (
              <div>{news.excerpt}</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
