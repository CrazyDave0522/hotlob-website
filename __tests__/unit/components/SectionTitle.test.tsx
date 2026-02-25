import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionTitle } from '@/components/layout/SectionTitle';

describe('SectionTitle Component', () => {
  it('renders an h2 element', () => {
    render(<SectionTitle text="Test Title" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('renders the provided text content', () => {
    render(<SectionTitle text="About Hotlob" />);
    const heading = screen.getByText('About Hotlob');
    expect(heading).toBeInTheDocument();
  });

  it('renders with the section-title class', () => {
    render(<SectionTitle text="Test Title" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('section-title');
  });

  it('renders with role of heading', () => {
    render(<SectionTitle text="Test Title" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.tagName).toBe('H2');
  });

  it('accepts different text values', () => {
    const { rerender } = render(<SectionTitle text="First" />);
    expect(screen.getByText('First')).toBeInTheDocument();

    rerender(<SectionTitle text="Second" />);
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.queryByText('First')).not.toBeInTheDocument();
  });

  it('renders with proper semantic structure for document outline', () => {
    render(<SectionTitle text="Test Title" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('Test Title');
  });

  it('does not render additional elements', () => {
    const { container } = render(<SectionTitle text="Test Title" />);
    const section = container.querySelector('.section-title');
    expect(section?.children.length).toBe(0);
  });

  it('renders empty text when not provided', () => {
    render(<SectionTitle text="" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toBe('');
  });
});
