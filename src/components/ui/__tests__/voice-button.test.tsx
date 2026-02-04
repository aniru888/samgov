import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VoiceButton } from '../voice-button'

describe('VoiceButton', () => {
  it('renders in idle state by default', () => {
    render(<VoiceButton />)

    const button = screen.getByRole('button', { name: /start voice input/i })
    expect(button).toBeInTheDocument()
  })

  it('renders in listening state', () => {
    render(<VoiceButton state="listening" />)

    const button = screen.getByRole('button', { name: /stop listening/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('animate-pulse')
  })

  it('renders in processing state', () => {
    render(<VoiceButton state="processing" />)

    const button = screen.getByRole('button', { name: /processing speech/i })
    expect(button).toBeInTheDocument()
    expect(button).toBeDisabled()
  })

  it('renders in error state', () => {
    render(<VoiceButton state="error" />)

    const button = screen.getByRole('button', { name: /voice input error/i })
    expect(button).toBeInTheDocument()
  })

  it('has minimum touch target size (48px)', () => {
    render(<VoiceButton />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('touch-target')
    expect(button).toHaveClass('h-12', 'w-12')
  })

  it('supports large size variant', () => {
    render(<VoiceButton size="lg" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-14', 'w-14')
  })

  it('can be disabled', () => {
    render(<VoiceButton disabled />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('is disabled when processing', () => {
    render(<VoiceButton state="processing" />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<VoiceButton className="custom-class" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('shows mic icon in idle state', () => {
    render(<VoiceButton state="idle" />)

    // SVG should be present (mic icon)
    const button = screen.getByRole('button')
    const svg = button.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('shows stop icon in listening state', () => {
    render(<VoiceButton state="listening" />)

    const button = screen.getByRole('button')
    const svg = button.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('shows spinner in processing state', () => {
    render(<VoiceButton state="processing" />)

    const button = screen.getByRole('button')
    const svg = button.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('animate-spin')
  })
})
