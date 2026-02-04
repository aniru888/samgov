import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BottomNav } from '../bottom-nav'
import { LanguageProvider } from '@/lib/i18n'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

function renderWithProvider(ui: React.ReactElement) {
  return render(<LanguageProvider defaultLanguage="en">{ui}</LanguageProvider>)
}

describe('BottomNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('renders all navigation items with correct labels', () => {
    renderWithProvider(<BottomNav />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Schemes')).toBeInTheDocument()
    expect(screen.getByText('Check')).toBeInTheDocument()
    expect(screen.getByText('Ask')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('has proper navigation aria-label for accessibility', () => {
    renderWithProvider(<BottomNav />)

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
  })

  it('renders exactly 5 navigation links', () => {
    renderWithProvider(<BottomNav />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5)
  })

  it('has correct href attributes for all routes', () => {
    renderWithProvider(<BottomNav />)

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /schemes/i })).toHaveAttribute('href', '/schemes')
    expect(screen.getByRole('link', { name: /check/i })).toHaveAttribute('href', '/debug')
    expect(screen.getByRole('link', { name: /ask/i })).toHaveAttribute('href', '/ask')
    expect(screen.getByRole('link', { name: /profile/i })).toHaveAttribute('href', '/profile')
  })

  it('applies custom className when provided', () => {
    renderWithProvider(<BottomNav className="custom-nav" />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('custom-nav')
  })

  it('each nav item has an SVG icon', () => {
    renderWithProvider(<BottomNav />)

    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      const svg = link.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it('each nav item has a text label in span element', () => {
    renderWithProvider(<BottomNav />)

    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      const span = link.querySelector('span')
      expect(span).toBeInTheDocument()
      expect(span?.textContent).toBeTruthy()
    })
  })

  it('navigation is fixed to bottom of viewport', () => {
    renderWithProvider(<BottomNav />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('fixed', 'bottom-0')
  })

  it('has appropriate z-index for layering', () => {
    renderWithProvider(<BottomNav />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('z-50')
  })
})
