import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DisclaimerBanner } from '../disclaimer-banner'

describe('DisclaimerBanner', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    vi.mocked(localStorage.getItem).mockReturnValue(null)
  })

  it('renders the disclaimer banner by default', () => {
    render(<DisclaimerBanner />)

    expect(screen.getByText(/This is NOT a government website/i)).toBeInTheDocument()
  })

  it('contains warning about guidance only', () => {
    render(<DisclaimerBanner />)

    expect(screen.getByText(/for guidance only/i)).toBeInTheDocument()
  })

  it('links to official Karnataka government portal', () => {
    render(<DisclaimerBanner />)

    const link = screen.getByRole('link', { name: /official portals/i })
    expect(link).toHaveAttribute('href', 'https://sevasindhu.karnataka.gov.in')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('has a dismiss button', () => {
    render(<DisclaimerBanner />)

    const dismissButton = screen.getByRole('button', { name: /dismiss disclaimer/i })
    expect(dismissButton).toBeInTheDocument()
  })

  it('hides banner when dismiss is clicked', () => {
    render(<DisclaimerBanner />)

    const dismissButton = screen.getByRole('button', { name: /dismiss disclaimer/i })
    fireEvent.click(dismissButton)

    // Banner should be hidden
    expect(screen.queryByText(/This is NOT a government website/i)).not.toBeInTheDocument()
  })

  it('shows "Show Disclaimer" button after dismissing', () => {
    render(<DisclaimerBanner />)

    const dismissButton = screen.getByRole('button', { name: /dismiss disclaimer/i })
    fireEvent.click(dismissButton)

    // Should show the collapsed toggle button
    expect(screen.getByRole('button', { name: /show disclaimer/i })).toBeInTheDocument()
  })

  it('re-expands banner when "Show Disclaimer" is clicked', () => {
    render(<DisclaimerBanner />)

    // Dismiss first
    const dismissButton = screen.getByRole('button', { name: /dismiss disclaimer/i })
    fireEvent.click(dismissButton)

    // Click show disclaimer
    const showButton = screen.getByRole('button', { name: /show disclaimer/i })
    fireEvent.click(showButton)

    // Banner should be visible again
    expect(screen.getByText(/This is NOT a government website/i)).toBeInTheDocument()
  })

  it('has proper ARIA attributes for accessibility', () => {
    render(<DisclaimerBanner />)

    const banner = screen.getByRole('alert')
    expect(banner).toBeInTheDocument()
  })
})
