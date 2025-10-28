import { useMemo, useState } from "react"

import { Button, Modal, Typography } from "antd"
import { InfoCircleOutlined, PlayCircleOutlined } from "@ant-design/icons"
import type { CatalogMovie } from "../listing/MovieCatalog.types"
import { formatAuthors, toTitleCase } from "../listing/MovieCatalog.utils"

const { Title, Text } = Typography

type ShowtimeHeaderMovie = CatalogMovie & {
  tags?: string[]
}

type TrailerInfo = {
  thumbnail?: string
  embedUrl?: string
}

type MovieShowtimeHeaderProps = {
  movie: ShowtimeHeaderMovie
  certificate?: string
  runtime?: string
  tagline?: string
  onViewDetails: () => void
  trailer?: TrailerInfo
}

const MovieShowtimeHeader = ({
  movie,
  certificate,
  runtime,
  tagline,
  onViewDetails,
  trailer,
}: MovieShowtimeHeaderProps) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)

  const previewImage = movie.image
  const hasTrailer = Boolean(trailer?.embedUrl)

  const trailerSrc = useMemo(() => {
    if (!trailer?.embedUrl) {
      return undefined
    }
    const separator = trailer.embedUrl.includes("?") ? "&" : "?"
    return `${trailer.embedUrl}${separator}autoplay=1`
  }, [trailer?.embedUrl])

  const handlePlayTrailer = () => {
    if (hasTrailer) {
      setIsTrailerOpen(true)
    } else {
      onViewDetails()
    }
  }

  const certificateLabel = certificate ?? movie.certificate
  const authorLabel = formatAuthors(movie.authors)

  const attributeSections = useMemo(() => {
    const sections: Array<{ key: string; label: string; values: string[] }> = []

    if (movie.languages?.length) {
      sections.push({
        key: "languages",
        label: "Language",
        values: movie.languages.map((language) => toTitleCase(language)),
      })
    }

    if (movie.formats?.length) {
      sections.push({
        key: "formats",
        label: "Format",
        values: movie.formats.map((format) => format.toUpperCase()),
      })
    }

    if (movie.tags?.length) {
      sections.push({
        key: "tags",
        label: "Tags",
        values: movie.tags,
      })
    }

    if (movie.genre) {
      sections.push({
        key: "genre",
        label: "Genre",
        values: [movie.genre],
      })
    }

    if (runtime) {
      sections.push({
        key: "runtime",
        label: "Runtime",
        values: [runtime],
      })
    }

    return sections
  }, [movie.languages, movie.formats, movie.tags, movie.genre, runtime])

  return (
    <>
      <section className="max-w-screen-xl px-4 mx-auto">
        <div className="flex w-full flex-col items-center gap-8 px-6 text-center md:flex-row md:items-center md:gap-10 md:text-left">
          <div className="relative h-80 w-50 overflow-hidden rounded-3xl shadow-lg">
            <img
              src={previewImage}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={handlePlayTrailer}
              className={`absolute inset-0 flex flex-col items-center justify-center !text-white transition ${
                hasTrailer
                  ? "bg-slate-950/50 hover:bg-slate-950/60"
                  : "cursor-not-allowed bg-slate-900/35"
              }`}
            >
              <PlayCircleOutlined className="text-4xl sm:text-5xl drop-shadow" />
              <span className="text-xs font-semibold uppercase tracking-[0.35em] sm:text-sm">
                {hasTrailer ? "Play trailer" : "View details"}
              </span>
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center gap-5 md:items-start">
            <div className="space-y-3">
              <Title level={2} className="!mb-0 text-3xl text-slate-900 md:text-4xl">
                {movie.title}
              </Title>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-slate-600 md:justify-start">
                {certificateLabel ? <span className="text-slate-500">{certificateLabel}</span> : null}
                {certificateLabel ? <span className="text-slate-400">|</span> : null}
                <span className="text-slate-700">{authorLabel}</span>
              </div>
              {tagline ? (
                <Text type="secondary" className="block text-base text-slate-500">
                  {tagline}
                </Text>
              ) : null}
            </div>

            <div className="flex w-full flex-col gap-3">
              {attributeSections.map((section) => (
                <div
                  key={section.key}
                  className="flex flex-wrap items-center justify-center gap-2 text-sm md:justify-start"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                    {section.label}
                  </span>
                  <span className="text-slate-300">:</span>
                  <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                    {section.values.map((value, index) => (
                      <span
                        key={`${section.key}-${value}-${index}`}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="primary"
              icon={<InfoCircleOutlined />} 
              size="large"
              className="mt-2 h-11 border-none bg-slate-900 px-6 text-sm font-semibold tracking-wide"
              onClick={onViewDetails}
            >
              View details
            </Button>
          </div>
        </div>
      </section>

      <Modal
        open={isTrailerOpen}
        onCancel={() => setIsTrailerOpen(false)}
        footer={null}
        centered
        width={920}
        destroyOnHidden
        styles={{
          content: { padding: 0, background: "transparent", boxShadow: "none" },
          body: { padding: 0, background: "#0f172a" },
        }}
      >
        {trailerSrc ? (
          <div className="relative w-full overflow-hidden rounded-3xl" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={trailerSrc}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${movie.title} trailer`}
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ) : null}
      </Modal>
    </>
  )
}

export type { ShowtimeHeaderMovie }
export default MovieShowtimeHeader
