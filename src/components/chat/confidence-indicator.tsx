"use client";

import type { ConfidenceLevel } from "@/lib/rag";

interface ConfidenceIndicatorProps {
  confidence: ConfidenceLevel;
  className?: string;
}

const confidenceConfig: Record<
  ConfidenceLevel,
  { label: string; color: string; bgColor: string }
> = {
  high: {
    label: "High Confidence",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  medium: {
    label: "Medium Confidence",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
  low: {
    label: "Low Confidence",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
  },
};

export function ConfidenceIndicator({
  confidence,
  className = "",
}: ConfidenceIndicatorProps) {
  const config = confidenceConfig[confidence];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2 py-0.5
        text-xs font-medium rounded-full border
        ${config.bgColor} ${config.color}
        ${className}
      `}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          confidence === "high"
            ? "bg-emerald-500"
            : confidence === "medium"
              ? "bg-amber-500"
              : "bg-red-500"
        }`}
      />
      {config.label}
    </span>
  );
}
