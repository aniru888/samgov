import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageToggle } from '../language-toggle'
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

describe('LanguageToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('renders with EN and Kannada options', () => {
    renderWithProvider(<LanguageToggle />)

    expect(screen.getByText('EN')).toBeInTheDocument()
    expect(screen.getByText('ಕನ್ನಡ')).toBeInTheDocument()
  })

  it('shows EN as active by default', () => {
    renderWithProvider(<LanguageToggle />)

    const enText = screen.getByText('EN')
    expect(enText).toHaveClass('font-semibold')
  })

  it('has accessible label for switch action', () => {
    renderWithProvider(<LanguageToggle />)

    const button = screen.getByRole('button', { name: /switch to kannada/i })
    expect(button).toBeInTheDocument()
  })

  it('has touch-target class for accessibility', () => {
    renderWithProvider(<LanguageToggle />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('touch-target')
  })

  it('switches language on click', () => {
    renderWithProvider(<LanguageToggle />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // After click, label should change to "Switch to English"
    expect(screen.getByRole('button', { name: /switch to english/i })).toBeInTheDocument()
  })

  it('applies custom className', () => {
    renderWithProvider(<LanguageToggle className="custom-class" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })
})
