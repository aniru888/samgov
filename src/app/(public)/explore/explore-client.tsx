"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTranslation, useLanguage } from "@/lib/i18n";
import { ProblemInput, CategoryFilters, RecommendationResults, LifeEventCards } from "@/components/recommend";
import type { RecommendationResult } from "@/lib/recommend";

interface ExploreClientProps {
  decisionTreeSlugs: string[];
}

export function ExploreClient({ decisionTreeSlugs }: ExploreClientProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const [results, setResults] = useState<RecommendationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decisionTreeSet = new Set(decisionTreeSlugs);

  const handleSearch = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            category: selectedCategory,
            language,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Search failed");
          setResults([]);
          return;
        }

        setResults(data.data?.schemes || []);
      } catch {
        setError("Network error. Please try again.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory, language]
  );

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
    // If already searched, re-search with new category would require the query.
    // For simplicity, just change the filter - user can re-submit.
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t("exploreTitle")}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {t("exploreSubtitle")}
          </p>
        </header>

        {/* Search input */}
        <section className="mb-6">
          <ProblemInput onSubmit={handleSearch} isLoading={isLoading} />
        </section>

        {/* Life event quick-picks (shown before search) */}
        {!hasSearched && (
          <section className="mb-6">
            <LifeEventCards onSelect={handleSearch} disabled={isLoading} />
          </section>
        )}

        {/* Category filters */}
        <section className="mb-6">
          <CategoryFilters
            selected={selectedCategory}
            onSelect={handleCategoryChange}
          />
        </section>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        <section>
          <RecommendationResults
            results={results}
            isLoading={isLoading}
            hasSearched={hasSearched}
            decisionTreeSlugs={decisionTreeSet}
          />
        </section>

        {/* Browse all link */}
        <div className="mt-8 text-center">
          <Link
            href="/schemes"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            {t("exploreBrowseAll")} &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
