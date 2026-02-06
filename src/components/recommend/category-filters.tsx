"use client";

import { useTranslation } from "@/lib/i18n";
import { SCHEME_CATEGORIES } from "@/lib/recommend/categories";

interface CategoryFiltersProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilters({ selected, onSelect }: CategoryFiltersProps) {
  const { t, language } = useTranslation();

  return (
    <div className="overflow-x-auto pb-2 -mx-4 px-4">
      <div className="flex gap-2 min-w-max">
        {/* All button */}
        <button
          onClick={() => onSelect(null)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
            selected === null
              ? "bg-teal-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {t("exploreAllCategories")}
        </button>

        {/* Category pills */}
        {SCHEME_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(selected === cat.id ? null : cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              selected === cat.id
                ? "bg-teal-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {language === "kn" ? cat.label_kn : cat.label_en}
          </button>
        ))}
      </div>
    </div>
  );
}
