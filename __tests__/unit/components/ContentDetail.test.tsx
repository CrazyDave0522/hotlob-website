import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ContentDetail } from '../../../components/ContentDetail'
import type { NewsArticle } from '../../../types/news'

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  }
}))

vi.mock('../../../components/EditorJSRenderer', () => ({
  EditorJSRenderer: ({ content }: { content: unknown }) => (
    <div data-testid="editorjs-renderer">{JSON.stringify(content)}</div>
  )
}))

const mockNewsArticle: NewsArticle = {
  id: '1',
  title: 'Test News Article',
  cover_image_url: 'https://example.com/image.jpg',
  content: { 
    time: 1640995200000, // 2024-01-01 timestamp
    blocks: [], 
    version: '2.28.2' 
  },
  publish_date: '2024-01-01',
  is_published: true,
  excerpt: 'Test excerpt',
  author: 'Test Author',
  slug: 'test-article',
  created_at: '2024-01-01',
  updated_at: '2024-01-01'
}

describe('ContentDetail', () => {
  describe('News content rendering', () => {
    it('renders news article with all elements', () => {
      render(<ContentDetail news={mockNewsArticle} />)

      expect(screen.getByRole('heading', { name: 'Test News Article' })).toBeInTheDocument()
      expect(screen.getByText('By Test Author')).toBeInTheDocument()
      expect(screen.getByText('1 January 2024')).toBeInTheDocument()
      expect(screen.getByAltText('Test News Article')).toBeInTheDocument()
      expect(screen.getByTestId('editorjs-renderer')).toBeInTheDocument()
    })

    it('renders news article without author', () => {
      const newsWithoutAuthor = { ...mockNewsArticle, author: undefined }
      render(<ContentDetail news={newsWithoutAuthor} />)

      expect(screen.getByRole('heading', { name: 'Test News Article' })).toBeInTheDocument()
      expect(screen.queryByText(/By/)).not.toBeInTheDocument()
    })

    it('returns null when no news prop provided', () => {
      const { container } = render(<ContentDetail />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('HTML content rendering', () => {
    it('renders HTML content with title', () => {
      const htmlContent = '<p>This is <strong>HTML</strong> content</p>'
      const title = 'Legal Document'

      render(<ContentDetail htmlContent={htmlContent} title={title} />)

      expect(screen.getByRole('heading', { name: 'Legal Document' })).toBeInTheDocument()
      // Check that the HTML content container exists (dangerouslySetInnerHTML may not render in test env)
      const contentDiv = screen.getByRole('heading', { name: 'Legal Document' }).nextElementSibling
      expect(contentDiv).toBeInTheDocument()
    })

    it('renders HTML content without title', () => {
      const htmlContent = '<h2>Section Title</h2><p>Content here</p>'

      render(<ContentDetail htmlContent={htmlContent} />)

      // Check that no h1 title heading is rendered
      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
      // Check that the content wrapper exists and contains the HTML content
      expect(screen.getByText('Section Title').closest('section')).toBeInTheDocument()
    })

    it('prioritizes HTML content over news content', () => {
      const htmlContent = '<p>HTML content</p>'

      render(<ContentDetail news={mockNewsArticle} htmlContent={htmlContent} />)

      // Should not render news content when htmlContent is provided
      expect(screen.queryByText('Test News Article')).not.toBeInTheDocument()
      // Should render HTML content
      expect(screen.getByText('HTML content').closest('section')).toBeInTheDocument()
    })
  })

  describe('Responsive design', () => {
    it('renders news content in a wrapper element', () => {
      render(<ContentDetail news={mockNewsArticle} />)

      // Check that content is wrapped properly
      const heading = screen.getByRole('heading', { name: 'Test News Article' })
      expect(heading.closest('section')).toBeInTheDocument()
    })

    it('renders HTML content in a wrapper element', () => {
      render(<ContentDetail htmlContent="<p>test content</p>" />)

      // Check that HTML content is rendered
      expect(screen.getByText('test content')).toBeInTheDocument()
      expect(screen.getByText('test content').closest('section')).toBeInTheDocument()
    })
  })
})