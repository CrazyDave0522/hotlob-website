import { render, screen } from '@testing-library/react';
import { NewsItem } from '@/components/news/NewsItem';

const mockNewsItem = {
  id: '1',
  title: 'Test News Article',
  cover_image_url: 'https://example.com/image.jpg',
  excerpt: 'This is a test excerpt',
  author: 'Test Author',
  publish_date: '2024-01-01',
  slug: 'test-article'
};

describe('NewsItem', () => {
  it('renders news item with correct content', () => {
    render(<NewsItem news={mockNewsItem} />);

    expect(screen.getByText('Test News Article')).toBeInTheDocument();
    expect(screen.getByText('This is a test excerpt')).toBeInTheDocument();
    expect(screen.getByText('1 January 2024')).toBeInTheDocument();
  });

  it('renders as a link with correct href', () => {
    render(<NewsItem news={mockNewsItem} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/hotlob-news/test-article');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders image with correct attributes', () => {
    render(<NewsItem news={mockNewsItem} />);

    const image = screen.getByAltText('Test News Article');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
    expect(image.getAttribute('src')).toContain('example.com');
  });

  it('handles missing excerpt gracefully', () => {
    const newsWithoutExcerpt = { ...mockNewsItem, excerpt: undefined };
    render(<NewsItem news={newsWithoutExcerpt} />);

    expect(screen.getByText('Test News Article')).toBeInTheDocument();
    expect(screen.queryByText('This is a test excerpt')).not.toBeInTheDocument();
  });

  it('handles missing author gracefully', () => {
    const newsWithoutAuthor = { ...mockNewsItem, author: undefined };
    render(<NewsItem news={newsWithoutAuthor} />);

    expect(screen.getByText('Test News Article')).toBeInTheDocument();
    expect(screen.queryByText('Test Author')).not.toBeInTheDocument();
  });
});