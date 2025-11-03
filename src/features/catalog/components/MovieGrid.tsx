import { Button, Rate, Tag, Typography } from 'antd'
import type { HighlightBadges, Movie, SelectOption } from '../../shared/types'

const { Title, Text } = Typography

type MovieGridProps = {
  movies: Movie[]
  languageFilter: string
  formatFilter: string
  languageOptions: SelectOption[]
  formatOptions: SelectOption[]
  highlightBadges: HighlightBadges
  onSelectMovie?: (movieId: string) => void
}

const getOptionLabel = (options: SelectOption[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value

const MovieGrid = ({
  movies,
  languageFilter,
  formatFilter,
  languageOptions,
  formatOptions,
  highlightBadges,
  onSelectMovie,
}: MovieGridProps) => {
  const languageLabel = getOptionLabel(languageOptions, languageFilter)
  const formatLabel = getOptionLabel(formatOptions, formatFilter)

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title level={3} className="m-0">
            Phim đang chiếu nổi bật
          </Title>
          <Text type="secondary">
            Gần bạn • {movies.length} phim • Bộ lọc: {languageLabel}, {formatLabel}
          </Text>
        </div>
        <Button type="text" size="large">
          Xem tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => {
          const languageBadges = movie.languages.map((item) =>
            getOptionLabel(languageOptions, item)
          )
          const formatBadges = movie.formats.map((item) =>
            getOptionLabel(formatOptions, item)
          )
          const badge =
            (movie.trending && highlightBadges.trending) ||
            ((movie.tags ?? []).includes('IMAX') ? highlightBadges.exclusive : undefined)
          const releaseLabel = movie.releaseDate ?? ''
          const tags = movie.tags ?? []

          return (
          <div key={movie.id} className="bg-white rounded-xl overflow-hidden shadow-md">
            <div className="relative">
              {badge ? (
                <Tag color={badge.color} className="absolute left-3 top-3">
                  {badge.text}
                </Tag>
              ) : null}
              <img src={movie.image} alt={movie.title} className="w-full h-56 object-cover" />
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <Title level={4} className="m-0">{movie.title}</Title>
                <Text type="secondary">{movie.subtitle}</Text>
              </div>

              <div className="flex items-center gap-3">
                <Rate
                  allowHalf
                  disabled
                  value={movie.rating ? Math.round(movie.rating * 2) / 2 : 0}
                />
                <Text strong>{movie.rating?.toFixed(1) ?? "0.0"}</Text>
                <Text type="secondary">
                  {(movie.votes ?? 0).toLocaleString("en-IN")} ratings
                </Text>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>

              <div className="text-sm text-gray-500">
                <Text type="secondary">{languageBadges.join(', ')}</Text>
                <span className="mx-2">•</span>
                <Text type="secondary">{formatBadges.join(', ')}</Text>
              </div>

              {releaseLabel ? <Text type="secondary">{releaseLabel}</Text> : null}

              <Button type="primary" block onClick={() => onSelectMovie?.(movie.detailId ?? movie.id)}>
                Đặt vé
              </Button>
            </div>
          </div>
          )
        })}
      </div>
    </section>
  )
}

export default MovieGrid
