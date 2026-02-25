import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ContentDetail } from '../../components/news/ContentDetail'

describe('Privacy Policy Page Integration', () => {
  it('renders privacy policy content', () => {
    const mockHtmlContent = '<h1>Privacy Policy</h1><p>This is our privacy policy content.</p>'

    render(<ContentDetail htmlContent={mockHtmlContent} title="Privacy Policy" />)

    // Check that the specific content from HTML is rendered
    expect(screen.getByText('This is our privacy policy content.')).toBeInTheDocument()
  })

  it('renders HTML content in wrapper element', () => {
    const mockHtmlContent = '<div><h2>Section 1</h2><p>Content here</p></div>'

    render(<ContentDetail htmlContent={mockHtmlContent} title="Privacy Policy" />)

    // Verify the HTML content is rendered in the wrapper
    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Content here')).toBeInTheDocument()

    // Check that it's wrapped in the ContentDetail structure
    const wrapper = screen.getByText('Section 1').closest('section')
    expect(wrapper).toBeInTheDocument()
  })
})