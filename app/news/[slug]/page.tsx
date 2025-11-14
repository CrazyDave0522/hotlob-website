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
      <div className="w-[1400px] shrink-0 rounded-md bg-white shadow-[0_0_10px_0_rgba(0,0,0,0.12)] mt-11 mb-[60px]">
        <h1
          className="text-[20px] font-medium text-[#1D1E1F] leading-normal text-left"
          style={{ marginLeft: 30, marginTop: 30 }}
        >
          {news.title}
        </h1>
        <span
          className="block text-[12px] font-normal text-[#999] leading-normal"
          style={{ marginLeft: 30, marginTop: 18 }}
        >
          {formatAUDate(news.publish_date)}
        </span>
        <div style={{ marginLeft: 30, marginTop: 14, marginBottom: 0 }}>
          <div className="w-[1340px] h-px shrink-0 bg-[#E1E4E9]" />
        </div>
        <div style={{ marginTop: 20, marginBottom: 0 }} className="flex justify-center items-center">
          {/* 封面图，假设 news.cover_image_url 有值 */}
          {news.cover_image_url && (
            <div className="relative w-[900px] h-[420px] shrink-0" style={{ aspectRatio: '15/7', marginBottom: 16 }}>
              <Image
                src={news.cover_image_url}
                alt={news.title}
                fill
                sizes="900px"
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
