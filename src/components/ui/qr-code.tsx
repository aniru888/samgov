"use client"

import * as React from "react"
import QRCode from "qrcode"

interface QRCodeDisplayProps {
  url: string
  size?: number
  className?: string
}

/**
 * Client-side QR code generator using canvas.
 * Renders a QR code for the given URL.
 */
export function QRCodeDisplay({ url, size = 128, className }: QRCodeDisplayProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    if (!canvasRef.current) return

    QRCode.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
    }).catch(() => {
      setError(true)
    })
  }, [url, size])

  if (error) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label={`QR code for ${url}`}
      role="img"
    />
  )
}
