import { supabase } from "../../../lib/supabaseClient";
import type { Metadata } from "next";
import Link from "next/link";
import { formatAUDate } from "../../../lib/utils/formatDate";

type NewsDetail = {
  title: string;
  excerpt?: string | null;
  content?: string | null;
  publish_date?: string | null;
};

export async function generateStaticParams() {
  const { data } = await supabase.from("news").select("slug");
  if (!Array.isArray(data)) return [];
  return data.map((d: { slug: string }) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = (await params) as { slug: string };
  const { data } = await supabase.from("news").select("title,excerpt").eq("slug", slug).limit(1).single();
  const news = data as NewsDetail | null;
  return {
    title: news ? news.title : "News Detail",
    description: news ? news.excerpt : "Hotlob news detail page.",
  };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = (await params) as { slug: string };
  const { data, error } = await supabase
    .from("news")
    .select("title,excerpt,content,publish_date")
    .eq("slug", slug)
    .limit(1)
    .single();

  if (error || !data) {
    return <div className="max-w-2xl mx-auto py-12 px-4">News not found.</div>;
  }
  const news = data as NewsDetail;
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
          <span className="block mb-2 text-xs text-gray-400">{formatAUDate(news.publish_date)}</span>
          {/* Render full HTML content if present; fall back to excerpt */}
          {news.content ? (
            <div className="prose max-w-none text-gray-700 mb-8" dangerouslySetInnerHTML={{ __html: news.content }} />
          ) : (
            <div className="text-gray-700 mb-8">{news.excerpt}</div>
          )}
      <Link href="/news" className="text-red-600 hover:underline">← Back to News List</Link>
    </main>
  );
}
