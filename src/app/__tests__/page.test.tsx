import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Karnataka Welfare Scheme Guide/i)
  })

  it('renders description text', () => {
    render(<Home />)

    expect(screen.getByText(/Understand government welfare schemes/i)).toBeInTheDocument()
  })

  it('has a link to browse schemes', () => {
    render(<Home />)

    const browseLink = screen.getByRole('link', { name: /browse schemes/i })
    expect(browseLink).toHaveAttribute('href', '/schemes')
  })

  it('has a link to ask questions', () => {
    render(<Home />)

    const askLink = screen.getByRole('link', { name: /ask a question/i })
    expect(askLink).toHaveAttribute('href', '/ask')
  })

  it('renders feature cards section', () => {
    render(<Home />)

    expect(screen.getByText(/How We Can Help/i)).toBeInTheDocument()
  })

  it('renders browse schemes feature card', () => {
    render(<Home />)

    expect(screen.getByText(/Explore Karnataka government welfare schemes/i)).toBeInTheDocument()
  })

  it('renders debug rejections feature card', () => {
    render(<Home />)

    expect(screen.getByText(/Step through common rejection reasons/i)).toBeInTheDocument()
  })

  it('renders ask questions feature card', () => {
    render(<Home />)

    expect(screen.getByText(/Get answers to your questions/i)).toBeInTheDocument()
  })

  it('renders important notice section', () => {
    render(<Home />)

    expect(screen.getByText(/Important Notice/i)).toBeInTheDocument()
    expect(screen.getByText(/This is NOT a government website/i)).toBeInTheDocument()
  })

  it('links to official government portal in notice', () => {
    render(<Home />)

    const officialLink = screen.getByRole('link', { name: /official Karnataka government portals/i })
    expect(officialLink).toHaveAttribute('href', 'https://sevasindhu.karnataka.gov.in')
  })

  it('renders footer with navigation links', () => {
    render(<Home />)

    expect(screen.getByRole('link', { name: /^Schemes$/i })).toHaveAttribute('href', '/schemes')
    expect(screen.getByRole('link', { name: /^Ask$/i })).toHaveAttribute('href', '/ask')
    expect(screen.getByRole('link', { name: /^Terms$/i })).toHaveAttribute('href', '/terms')
    expect(screen.getByRole('link', { name: /^Privacy$/i })).toHaveAttribute('href', '/privacy')
  })
})
