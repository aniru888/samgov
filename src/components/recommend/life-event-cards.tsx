"use client";

import { useLanguage } from "@/lib/i18n";
import { LIFE_EVENTS } from "@/lib/recommend/life-events";

interface LifeEventCardsProps {
  onSelect: (query: string) => void;
  disabled?: boolean;
}

export function LifeEventCards({ onSelect, disabled }: LifeEventCardsProps) {
  const { language } = useLanguage();

  return (
    <div>
      <h2 className="text-sm font-medium text-gray-700 mb-3">
        {language === "kn"
          ? "ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿ ಆಯ್ಕೆಮಾಡಿ"
          : "Or choose your situation"}
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
        {LIFE_EVENTS.map((event) => (
          <button
            key={event.id}
            onClick={() =>
              onSelect(language === "kn" ? event.query_kn : event.query_en)
            }
            disabled={disabled}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            <span className="text-2xl" role="img" aria-hidden="true">
              {event.icon}
            </span>
            <span className="text-xs font-medium text-gray-700 leading-tight">
              {language === "kn" ? event.label_kn : event.label_en}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
