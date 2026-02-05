"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ServiceQuota {
  used: number;
  limit: number;
  pct: number;
}

interface QuotaDashboardProps {
  quota: {
    cohere: ServiceQuota;
    llamaparse: ServiceQuota;
    gemini: ServiceQuota;
  };
}

const services = [
  {
    key: "cohere" as const,
    label: "Cohere Embeddings",
    sublabel: "1,000 calls/month",
  },
  {
    key: "llamaparse" as const,
    label: "LlamaParse OCR",
    sublabel: "10,000 credits/month",
  },
  {
    key: "gemini" as const,
    label: "Gemini Q&A",
    sublabel: "600 requests/month",
  },
];

function getBarColor(pct: number): string {
  if (pct >= 100) return "bg-red-500";
  if (pct >= 80) return "bg-amber-500";
  return "bg-teal-500";
}

function getTextColor(pct: number): string {
  if (pct >= 100) return "text-red-600";
  if (pct >= 80) return "text-amber-600";
  return "text-gray-600";
}

export function QuotaDashboard({ quota }: QuotaDashboardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          API Usage This Month
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => {
          const data = quota[service.key];
          return (
            <div key={service.key} data-testid={`quota-${service.key}`}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {service.label}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {service.sublabel}
                  </span>
                </div>
                <span
                  className={cn("text-sm font-medium", getTextColor(data.pct))}
                >
                  {data.used.toLocaleString()} / {data.limit.toLocaleString()}{" "}
                  ({data.pct}%)
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    getBarColor(data.pct)
                  )}
                  style={{ width: `${Math.min(data.pct, 100)}%` }}
                  role="progressbar"
                  aria-valuenow={data.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${service.label} usage`}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
