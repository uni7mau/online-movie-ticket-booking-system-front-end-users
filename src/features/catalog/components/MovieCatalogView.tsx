import { useCallback, useMemo, useRef, useState } from "react"

import MovieAvailabilityFilters from "./MovieAvailabilityFilters"
import MovieFeaturedSlider from "./MovieFeaturedSlider"
import MovieListingsSection from "./MovieListingsSection"
import type { CatalogMovie, CatalogOption, ListingFilterOption } from "../types/MovieCatalog.types"
import { matchesListingFilter } from "../utils/MovieCatalog.utils"

type MovieCatalogViewProps = {
  featuredMovies: CatalogMovie[]
  allMovies: CatalogMovie[]
  categories: CatalogOption[]
  activeCategory: string
  onCategoryChange: (value: string) => void
  genreOptions: CatalogOption[]
  selectedGenre: string
  onGenreChange: (value: string) => void
  languageOptions: CatalogOption[]
  selectedLanguage: string
  onLanguageChange: (value: string) => void
  formatOptions: CatalogOption[]
  selectedFormat: string
  onFormatChange: (value: string) => void
  onSelectMovie: (movieId: string) => void
}

const MovieCatalogView = ({
  featuredMovies,
  allMovies,
  categories,
  activeCategory,
  onCategoryChange,
  genreOptions,
  selectedGenre,
  onGenreChange,
  languageOptions,
  selectedLanguage,
  onLanguageChange,
  formatOptions,
  selectedFormat,
  onFormatChange,
  onSelectMovie,
}: MovieCatalogViewProps) => {
  const [activeListingFilters, setActiveListingFilters] = useState<string[]>([])
  const listingsSectionRef = useRef<HTMLDivElement | null>(null)

  const listingFilterOptions = useMemo<ListingFilterOption[]>(() => {
    const categoryFilters = categories.map((option) => ({
      key: `category-${option.value}`,
      label: option.label,
      type: "category" as const,
      value: option.value,
    }))
    const languageFilters = languageOptions
      .filter((option) => option.value !== "all")
      .map((option) => ({
        key: `language-${option.value}`,
        label: option.label,
        type: "language" as const,
        value: option.value,
      }))
    const formatFilters = formatOptions
      .filter((option) => option.value !== "all")
      .map((option) => ({
        key: `format-${option.value}`,
        label: option.label.toUpperCase(),
        type: "format" as const,
        value: option.value,
      }))
    return [...categoryFilters, ...languageFilters, ...formatFilters]
  }, [categories, languageOptions, formatOptions])

  const selectedListingFilters = useMemo(
    () => listingFilterOptions.filter((filter) => activeListingFilters.includes(filter.key)),
    [listingFilterOptions, activeListingFilters]
  )

  const filteredAllMovies = useMemo(() => {
    if (!selectedListingFilters.length) return allMovies
    return allMovies.filter((movie) =>
      selectedListingFilters.every((filter) => matchesListingFilter(movie, filter))
    )
  }, [allMovies, selectedListingFilters])

  const handleToggleListingFilter = useCallback((key: string) => {
    setActiveListingFilters((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    )
  }, [])

  const handleResetListingFilters = useCallback(() => {
    setActiveListingFilters([])
  }, [])

  const handleExploreListings = useCallback(() => {
    listingsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return (
    <main className="space-y-7 px-4 sm:px-6 lg:px-10">
      <MovieFeaturedSlider
        movies={featuredMovies}
        onSelectMovie={onSelectMovie}
        onExploreListings={handleExploreListings}
      />

      <MovieAvailabilityFilters
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
        genreOptions={genreOptions}
        selectedGenre={selectedGenre}
        onGenreChange={onGenreChange}
        languageOptions={languageOptions}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
        formatOptions={formatOptions}
        selectedFormat={selectedFormat}
        onFormatChange={onFormatChange}
      />

      <div ref={listingsSectionRef}>
        <MovieListingsSection
          title="Now showing & coming soon"
          subtitle="All listings"
          movies={filteredAllMovies}
          listingFilters={listingFilterOptions}
          activeFilters={activeListingFilters}
          onToggleFilter={handleToggleListingFilter}
          onResetFilters={handleResetListingFilters}
          onSelectMovie={onSelectMovie}
        />
      </div>

    </main>
  )
}

export type { CatalogMovie, CatalogOption } from "../types/MovieCatalog.types"
export default MovieCatalogView
