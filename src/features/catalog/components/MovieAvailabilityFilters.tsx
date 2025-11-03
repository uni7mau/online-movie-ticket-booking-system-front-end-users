import { Select, Segmented, Typography } from "antd"

import type { CatalogOption } from "../types/MovieCatalog.types"

type MovieAvailabilityFiltersProps = {
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
}

const { Title, Text } = Typography

const MovieAvailabilityFilters = ({
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
}: MovieAvailabilityFiltersProps) => {
  return (
    <section className="space-y-3 rounded-[24px] bg-white p-5 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.3)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Text className="!text-[11px] uppercase tracking-[0.3em] text-slate-500">
            Browse by availability
          </Text>
          <Title level={3} className="!m-0 text-xl font-semibold text-slate-900">
            Book the perfect show
          </Title>
        </div>
        <Segmented
          options={categories}
          size="large"
          value={activeCategory}
          onChange={(value) => onCategoryChange(value as string)}
          className="!rounded-full !bg-slate-100/70 !px-2 !py-1"
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Select
          size="large"
          value={selectedGenre}
          onChange={onGenreChange}
          options={genreOptions}
          className="min-w-[160px] flex-1 sm:min-w-[200px] sm:flex-none"
        />
        <Select
          size="large"
          value={selectedLanguage}
          onChange={onLanguageChange}
          options={languageOptions}
          className="min-w-[160px] flex-1 sm:min-w-[200px] sm:flex-none"
        />
        <Select
          size="large"
          value={selectedFormat}
          onChange={onFormatChange}
          options={formatOptions}
          className="min-w-[160px] flex-1 sm:min-w-[200px] sm:flex-none"
        />
      </div>
    </section>
  )
}

export default MovieAvailabilityFilters
