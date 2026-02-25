import { render, screen } from '@testing-library/react';
import { EditorJSRenderer } from '@/components/news/EditorJSRenderer';

const mockContent = {
  time: 1234567890,
  blocks: [
    {
      id: '1',
      type: 'paragraph' as const,
      data: {
        text: '<p>This is a <strong>paragraph</strong> with formatting.</p>'
      }
    },
    {
      id: '2',
      type: 'header' as const,
      data: {
        text: '<h2>Header Text</h2>',
        level: 2
      }
    },
    {
      id: '3',
      type: 'list' as const,
      data: {
        style: 'unordered' as const,
        items: ['Item 1', 'Item 2', '<strong>Item 3</strong>']
      }
    },
    {
      id: '4',
      type: 'image' as const,
      data: {
        file: {
          url: 'https://example.com/image.jpg',
          alt: 'Test image'
        },
        caption: 'Image caption'
      }
    },
    {
      id: '5',
      type: 'quote' as const,
      data: {
        text: '<p>This is a quote</p>',
        caption: 'Quote author'
      }
    },
    {
      id: '6',
      type: 'delimiter' as const,
      data: {}
    }
  ],
  version: '2.28.2'
};

describe('EditorJSRenderer', () => {
  it('renders paragraph block', () => {
    render(<EditorJSRenderer content={mockContent} />);

    const paragraph = document.querySelector('.EditorJS-paragraph');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('This is a paragraph with formatting.');
  });

  it('renders header block with correct level', () => {
    render(<EditorJSRenderer content={mockContent} />);

    const header = screen.getByText('Header Text');
    expect(header).toBeInTheDocument();
    expect(header.closest('h2')).toBeInTheDocument();
  });

  it('renders list block', () => {
    render(<EditorJSRenderer content={mockContent} />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveTextContent('Item 1');
    expect(listItems[1]).toHaveTextContent('Item 2');
    expect(listItems[2]).toHaveTextContent('Item 3');
  });

  it('renders image block', () => {
    render(<EditorJSRenderer content={mockContent} />);

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
    expect(image.getAttribute('src')).toContain('example.com');

    const caption = screen.getByText('Image caption');
    expect(caption).toBeInTheDocument();
  });

  it('renders quote block', () => {
    render(<EditorJSRenderer content={mockContent} />);

    const quote = screen.getByText('This is a quote');
    expect(quote).toBeInTheDocument();

    const caption = screen.getByText('Quote author');
    expect(caption).toBeInTheDocument();
  });

  it('renders delimiter block', () => {
    render(<EditorJSRenderer content={mockContent} />);

    const delimiter = document.querySelector('hr');
    expect(delimiter).toBeInTheDocument();
  });

  it('handles unsupported block types', () => {
    const contentWithUnsupported = {
      ...mockContent,
      blocks: [
        {
          id: 'unsupported',
          type: 'unsupported' as 'paragraph', // Cast to a valid type for testing
          data: { someData: 'value' }
        }
      ]
    };

    render(<EditorJSRenderer content={contentWithUnsupported} />);

    expect(screen.getByText('Unsupported content block: unsupported')).toBeInTheDocument();
  });
});