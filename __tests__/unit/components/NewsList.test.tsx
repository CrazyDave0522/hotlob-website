import { render, screen, waitFor } from '@testing-library/react';
import { vi, Mock } from 'vitest';
import { NewsList } from '@/components/NewsList';

// Mock the news utilities
vi.mock('@/lib/news', () => ({
  fetchNewsListItems: vi.fn(),
  fetchTotalPublishedNewsCount: vi.fn()
}));

import { fetchNewsListItems, fetchTotalPublishedNewsCount } from '@/lib/news';

const mockNewsItems = [
  {
    id: '1',
    title: 'Test Article 1',
    cover_image_url: 'https://example.com/image1.jpg',
    excerpt: 'Excerpt 1',
    author: 'Author 1',
    publish_date: '2024-01-01',
    slug: 'test-article-1'
  },
  {
    id: '2',
    title: 'Test Article 2',
    cover_image_url: 'https://example.com/image2.jpg',
    excerpt: 'Excerpt 2',
    author: 'Author 2',
    publish_date: '2024-01-02',
    slug: 'test-article-2'
  }
];

describe('NewsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetchNewsListItems as Mock).mockResolvedValue(mockNewsItems);
    (fetchTotalPublishedNewsCount as Mock).mockResolvedValue(20);
  });

  it('renders news items when provided as initial items', async () => {
    render(<NewsList initialItems={mockNewsItems} />);

    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    expect(screen.getByText('Test Article 2')).toBeInTheDocument();
  });

  it('loads initial items when none provided', async () => {
    render(<NewsList />);

    await waitFor(() => {
      expect(fetchNewsListItems).toHaveBeenCalledWith(10, 0);
    });

    expect(screen.getByText('Test Article 1')).toBeInTheDocument();
    expect(screen.getByText('Test Article 2')).toBeInTheDocument();
  });

  it('shows loading state', async () => {
    (fetchNewsListItems as Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockNewsItems), 100))
    );

    render(<NewsList />);

    expect(screen.getByLabelText('Loading more articles')).toBeInTheDocument();
  });

  it('shows empty state when no articles', async () => {
    (fetchNewsListItems as Mock).mockResolvedValue([]);
    (fetchTotalPublishedNewsCount as Mock).mockResolvedValue(0);

    render(<NewsList initialItems={[]} />);

    await waitFor(() => {
      expect(screen.getByText('No news articles available at this time.')).toBeInTheDocument();
    });
  });
});