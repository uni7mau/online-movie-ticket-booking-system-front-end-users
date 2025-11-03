import { Button, Empty, Typography } from "antd"
import { FilterOutlined, StarFilled } from "@ant-design/icons"

import type { CatalogMovie, ListingFilterOption } from "../types/MovieCatalog.types"
import { formatAuthors, toTitleCase } from "../utils/MovieCatalog.utils"

type MovieListingsSectionProps = {
  title: string
  subtitle: string
  movies: CatalogMovie[]
  listingFilters: ListingFilterOption[]
  activeFilters: string[]
  onToggleFilter: (key: string) => void
  onResetFilters: () => void
  onSelectMovie: (movieId: string) => void
}

const { Title, Text } = Typography

const MovieListingsSection = ({
  title,
  subtitle,
  movies,
  listingFilters,
  activeFilters,
  onToggleFilter,
  onResetFilters,
  onSelectMovie,
}: MovieListingsSectionProps) => {
  return (
    <section className="space-y-6 py-10 max-w-[1264px] mx-auto">
      <div className="space-y-1">
        <Text className="!text-[11px] uppercase tracking-[0.3em] text-slate-500">
          {subtitle}
        </Text>
        <Title level={3} className="!m-0 text-2xl font-semibold text-slate-900">
          {title}
        </Title>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          icon={<FilterOutlined />}
          size="large"
          shape="round"
          className="!h-10 !border-slate-200 !bg-white !px-4 text-sm font-semibold text-slate-600 
          hover:!border-slate-300 hover:!bg-slate-50"
          onClick={onResetFilters}
          disabled={!activeFilters.length}
          title={activeFilters.length ? "Clear listing filters" : undefined}
        >
          Filters
        </Button>
        {listingFilters.map((filterOption) => {
          const isActive = activeFilters.includes(filterOption.key)
          return (
            <Button
              key={filterOption.key}
              size="large"
              shape="round"
              className={`!h-10 !px-4 text-sm font-medium transition ${
                isActive
                  ? "!bg-slate-900 !text-white hover:!bg-slate-800"
                  : "!bg-slate-100 !text-slate-600 hover:!bg-slate-200"
              }`}
              onClick={() => onToggleFilter(filterOption.key)}
            >
              {filterOption.label}
            </Button>
          )
        })}
      </div>
      {movies.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {movies.map((movie) => (
            <button
              key={movie.id}
              type="button"
              className="group relative flex flex-col rounded-[16px] bg-white text-left 
              shadow-[0_20px_50px_-28px_rgba(15,23,42,0.22)] transition-transform duration-200 cursor-pointer
              hover:-translate-y-1 hover:shadow-[0_32px_70px_-32px_rgba(15,23,42,0.28)] border-1 border-gray-200"
              onClick={() => onSelectMovie(movie.id)}
            >
              <div className="relative aspect-[3/4] min-h-[218px] md:min-h-[256px] w-full rounded-[16px]">
                <img
                  src={movie.image}
                  alt={movie.title}
                  loading="lazy"
                  className="h-full w-full object-cover rounded-[16px] transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-slate-900/80 px-3 
                py-1 text-sm font-semibold text-yellow-300">
                  <StarFilled className="text-base" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <Title level={5} className="!m-0 !text-lg font-semibold text-slate-900 leading-5.5">
                  {movie.title}
                </Title>
                <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                  <span className="text-slate-600">
                    {`${movie.certificate} | ${formatAuthors(movie.authors)}`}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {movie.languages.map((language) => (
                    <span
                      key={language}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {toTitleCase(language)}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No movies match the selected filters"
          />
        </div>
      )}
    </section>
  )
}

export default MovieListingsSection
