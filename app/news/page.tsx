import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { formatAUDate } from "../../lib/utils/formatDate";

type NewsRow = {
  title: string;
  slug: string;
  excerpt?: string | null;
  publish_date?: string | null;
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
          Supabase is not configured locally. Please add your keys to <code>.env.local</code>:
          <pre className="mt-2 bg-gray-100 p-2 rounded">NEXT_PUBLIC_SUPABASE_URL=your-url\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</pre>
        </div>
      </main>
    );
  }

  // Fetch list from Supabase (server-side)
  const { data, error } = await supabase
    .from("news")
    .select("title,slug,excerpt,publish_date")
    .order("publish_date", { ascending: false });

  const items = Array.isArray(data) ? (data as NewsRow[]) : [];

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Hotlob News</h1>
      {error && (
        <div className="text-sm text-red-600 mb-4">Failed to load news list: {error.message || String(error)}</div>
      )}
      <ul className="space-y-6">
        {items.map((news: NewsRow) => (
          <li key={news.slug} className="border-b pb-6">
            <Link href={`/news/${news.slug}`} className="text-xl font-semibold text-red-600 hover:underline">
              {news.title}
            </Link>
            <p className="mt-2 text-gray-700">{news.excerpt}</p>
            <span className="block mt-1 text-xs text-gray-400">{formatAUDate(news.publish_date)}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
