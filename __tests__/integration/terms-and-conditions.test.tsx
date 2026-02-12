import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ContentDetail } from '../../components/ContentDetail'

describe('Terms and Conditions Page Integration', () => {
  it('renders terms and conditions content', () => {
    const mockHtmlContent = '<h1>Terms & Conditions</h1><p>This is our terms and conditions content.</p>'

    render(<ContentDetail htmlContent={mockHtmlContent} title="Terms & Conditions" />)

    // Check that the specific content from HTML is rendered
    expect(screen.getByText('This is our terms and conditions content.')).toBeInTheDocument()
  })

  it('renders HTML content in wrapper element', () => {
    const mockHtmlContent = '<div><h2>Section 1</h2><p>Terms content here</p></div>'

    render(<ContentDetail htmlContent={mockHtmlContent} title="Terms & Conditions" />)

    // Verify the HTML content is rendered in the wrapper
    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Terms content here')).toBeInTheDocument()

    // Check that it's wrapped in the ContentDetail structure
    const wrapper = screen.getByText('Section 1').closest('section')
    expect(wrapper).toBeInTheDocument()
  })
})