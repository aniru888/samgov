import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '../header'
import { LanguageProvider } from '@/lib/i18n'

// Mock next/navigation
const mockBack = vi.fn()
const mockPush = vi.fn()
let mockPathname = '/'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => mockPathname,
}))

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

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname = '/'
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('renders logo on home page', () => {
    mockPathname = '/'
    renderWithProvider(<Header />)

    expect(screen.getByText('SamGov')).toBeInTheDocument()
  })

  it('shows back button on non-home pages', () => {
    mockPathname = '/schemes'
    renderWithProvider(<Header />)

    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument()
  })

  it('does not show back button on home page by default', () => {
    mockPathname = '/'
    renderWithProvider(<Header />)

    expect(screen.queryByRole('button', { name: /go back/i })).not.toBeInTheDocument()
  })

  it('shows back button when explicitly enabled', () => {
    mockPathname = '/'
    renderWithProvider(<Header showBack={true} />)

    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument()
  })

  it('hides logo when showLogo is false', () => {
    mockPathname = '/'
    renderWithProvider(<Header showLogo={false} />)

    expect(screen.queryByText('SamGov')).not.toBeInTheDocument()
  })

  it('displays custom title', () => {
    renderWithProvider(<Header title="Schemes" />)

    expect(screen.getByRole('heading', { name: /schemes/i })).toBeInTheDocument()
  })

  it('calls router.back when back button is clicked', () => {
    mockPathname = '/schemes'
    renderWithProvider(<Header />)

    const backButton = screen.getByRole('button', { name: /go back/i })
    fireEvent.click(backButton)

    expect(mockBack).toHaveBeenCalledTimes(1)
  })

  it('renders language toggle', () => {
    renderWithProvider(<Header />)

    expect(screen.getByText('EN')).toBeInTheDocument()
    expect(screen.getByText('ಕನ್ನಡ')).toBeInTheDocument()
  })

  it('back button has 48px touch target', () => {
    mockPathname = '/schemes'
    renderWithProvider(<Header />)

    const backButton = screen.getByRole('button', { name: /go back/i })
    expect(backButton).toHaveClass('w-12', 'h-12')
  })

  it('applies custom className', () => {
    renderWithProvider(<Header className="custom-header" />)

    const header = screen.getByRole('banner')
    expect(header).toHaveClass('custom-header')
  })
})
