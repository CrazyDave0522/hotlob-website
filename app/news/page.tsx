import { supabase } from "../../lib/supabaseClient";
import Hero from "../see-our-food/components/hero";
import NewsListClient from "./components/news-list-client";

type NewsRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string;
  publish_date: string;
};

export default async function NewsPage() {
  // Check env first and show helpful message if missing
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return (
      <main className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Hotlob News</h1>
        <div className="text-sm text-red-600 mb-4">
          Supabase is not configured locally. Please add your keys to{" "}
          <code>.env.local</code>:
          <pre className="mt-2 bg-gray-100 p-2 rounded">
            {`NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
          </pre>
        </div>
      </main>
    );
  }

  // Fetch initial 5 items from Supabase (server-side)
  const { data, error } = await supabase
    .from("news")
    .select("id,title,slug,excerpt,content,cover_image_url,publish_date")
    .eq("is_published", true)
    .order("publish_date", { ascending: false })
    .limit(5);

  const initialItems = Array.isArray(data) ? (data as NewsRow[]) : [];

  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <Hero
        title="Hot News"
        description="Check out our latest news and stay tuned"
        imageUrl="/images/news-hero.png"
        size="medium"
        backgroundPositionX="center"
        showOverlay={false}
      />

      <div className="pt-7">
        {error && (
          <div className="max-w-[1400px] mx-auto text-sm text-red-600 mb-4">
            Failed to load news list: {error.message || String(error)}
          </div>
        )}

        <NewsListClient initialItems={initialItems} />
      </div>
    </main>
  );
}
