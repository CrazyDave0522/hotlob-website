'use client';

import { useState, useEffect, useCallback } from 'react';

import { NewsItem } from './NewsItem';
import type { NewsListItem } from '@/types/news';
import { fetchNewsListItems } from '@/lib/news';

interface NewsListProps {
  initialItems?: NewsListItem[];
}

export function NewsList({ initialItems = [] }: NewsListProps) {
  const [items, setItems] = useState<NewsListItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchNewsListItems(10, page * 10);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load more news items:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // Load initial items if not provided
  useEffect(() => {
    if (initialItems.length === 0) {
      loadMoreItems();
    }
  }, [initialItems.length, loadMoreItems]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMoreItems();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreItems]);

  if (items.length === 0 && !loading) {
    return (
      <section className="NewsList-section">
        <div className="NewsList-empty">
          <p>No news articles available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="NewsList-section">
      <div className="NewsList">
        {items.map((item) => (
          <NewsItem key={item.id} news={item} />
        ))}

        {loading && (
          <div className="NewsList-loading" aria-label="Loading more articles">
            <div className="NewsList-spinner" />
            <span>Loading more articles...</span>
          </div>
        )}
      </div>
    </section>
  );
}