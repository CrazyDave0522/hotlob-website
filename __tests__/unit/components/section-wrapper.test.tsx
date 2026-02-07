import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ReactNode } from 'react';

// Test component that uses section wrapper
const SectionWrapperTest = ({ children }: { children: ReactNode }) => {
  return <section>{children}</section>;
};

describe('Section Wrapper Styles', () => {
  it('renders a section HTML element', () => {
    const { container } = render(
      <SectionWrapperTest>
        <div>Test Content</div>
      </SectionWrapperTest>
    );
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });

  it('uses semantic section element', () => {
    const { container } = render(
      <SectionWrapperTest>
        <div>Test Content</div>
      </SectionWrapperTest>
    );
    const section = container.querySelector('section');
    expect(section?.tagName).toBe('SECTION');
  });

  it('renders children within section', () => {
    const { container } = render(
      <SectionWrapperTest>
        <div data-testid="child-content">Test Content</div>
      </SectionWrapperTest>
    );
    const section = container.querySelector('section');
    const child = container.querySelector('[data-testid="child-content"]') as HTMLElement;
    
    expect(section).toContainElement(child);
  });

  it('can contain multiple child elements', () => {
    const { container } = render(
      <SectionWrapperTest>
        <h2>Title</h2>
        <div>Content</div>
      </SectionWrapperTest>
    );
    const section = container.querySelector('section');
    expect(section?.children.length).toBe(2);
  });

  it('is a valid semantic HTML element for content grouping', () => {
    const { container } = render(
      <SectionWrapperTest>
        <article>Content</article>
      </SectionWrapperTest>
    );
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section?.querySelector('article')).toBeInTheDocument();
  });

  it('preserves child element attributes', () => {
    const { container } = render(
      <SectionWrapperTest>
        <div id="test-child" className="content">Test</div>
      </SectionWrapperTest>
    );
    const child = container.querySelector('#test-child');
    expect(child).toHaveClass('content');
  });
});
