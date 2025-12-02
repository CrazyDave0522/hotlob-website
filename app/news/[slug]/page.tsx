import { supabase } from "../../../lib/supabaseClient";
import type { Metadata } from "next";
import Image from "next/image";
import { formatAUDate } from "../../../lib/utils/formatDate";
import { ContentPageLayout } from "@/app/components/ContentPageLayout";

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
    <ContentPageLayout
      title={news.title}
      subtitle={formatAUDate(news.publish_date)}
      contentHtml={news.content ?? news.excerpt ?? ""}
      headerExtras={
        news.cover_image_url ? (
          <div className="mt-5 flex justify-center">
            <div
              className="relative shrink-0 mb-4"
              style={{ width: "690px", height: "320px" }}
            >
              <Image
                src={news.cover_image_url}
                alt={news.title}
                fill
                sizes="(max-width:750px) calc((690 / 750) * 100vw), 690px"
                className="object-cover rounded-md"
                priority
              />
            </div>
          </div>
        ) : undefined
      }
    />
  );
}
