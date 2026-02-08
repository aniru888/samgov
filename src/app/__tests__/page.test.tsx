import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '@/lib/i18n'
import Home from '../page'

function renderWithProvider(ui: React.ReactElement) {
  return render(<LanguageProvider defaultLanguage="en">{ui}</LanguageProvider>)
}

describe('Home Page', () => {
  it('renders the main heading (i18n)', () => {
    renderWithProvider(<Home />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Find welfare schemes you may qualify for/i)
  })

  it('renders hero subtitle', () => {
    renderWithProvider(<Home />)

    expect(screen.getByText(/Simple tools to understand/i)).toBeInTheDocument()
  })

  it('has a link to explore schemes', () => {
    renderWithProvider(<Home />)

    const exploreLink = screen.getByRole('link', { name: /Find Schemes For You/i })
    expect(exploreLink).toHaveAttribute('href', '/explore')
  })

  it('has links to browse schemes', () => {
    renderWithProvider(<Home />)

    const browseLinks = screen.getAllByRole('link', { name: /Browse Schemes/i })
    expect(browseLinks.length).toBeGreaterThanOrEqual(1)
    expect(browseLinks[0]).toHaveAttribute('href', '/schemes')
  })

  it('has links to ask questions', () => {
    renderWithProvider(<Home />)

    const askLinks = screen.getAllByRole('link', { name: /Ask a Question/i })
    expect(askLinks.length).toBeGreaterThanOrEqual(1)
    expect(askLinks[0]).toHaveAttribute('href', '/ask')
  })

  it('renders the profile wizard section', () => {
    renderWithProvider(<Home />)

    // Wizard shows first question (gender)
    expect(screen.getByText(/What is your gender/i)).toBeInTheDocument()
  })

  it('renders quick actions feature cards', () => {
    renderWithProvider(<Home />)

    expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument()
  })

  it('renders important notice / disclaimer', () => {
    renderWithProvider(<Home />)

    expect(screen.getByText(/NOT an official government website/i)).toBeInTheDocument()
  })

  it('renders footer with navigation links', () => {
    renderWithProvider(<Home />)

    expect(screen.getByRole('link', { name: /^Schemes$/i })).toHaveAttribute('href', '/schemes')
    expect(screen.getByRole('link', { name: /^Explore$/i })).toHaveAttribute('href', '/explore')
    expect(screen.getByRole('link', { name: /^Ask$/i })).toHaveAttribute('href', '/ask')
  })
})
