import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="NotFound">
      <div className="NotFound-wrapper">
        <h1 className="NotFound-title">News Article Not Found</h1>
        <p className="NotFound-description">
          The news article you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/hotlob-news" className="NotFound-link">
          ← Back to News
        </Link>
      </div>
    </main>
  );
}