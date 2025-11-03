import { useEffect, useRef, useState } from "react"

import { Avatar, Modal, Tag, Typography } from "antd"
import { CloseOutlined, PlayCircleOutlined, StarFilled } from "@ant-design/icons"

import type { MovieDetail } from "../../shared/types"

const { Title, Text, Paragraph } = Typography

const SECTION_CONFIG = [
  { key: "reviews", label: "Reviews" },
  { key: "synopsis", label: "Synopsis" },
  { key: "cast", label: "Cast & Crew" },
  { key: "videos", label: "Videos" },
  { key: "posters", label: "Posters" },
] as const

type SectionKey = (typeof SECTION_CONFIG)[number]["key"]

type MovieDetailDialogProps = {
  open: boolean
  movie: MovieDetail
  onClose: () => void
}

const MovieDetailDialog = ({ open, movie, onClose }: MovieDetailDialogProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const synopsisRef = useRef<HTMLDivElement>(null)
  const castRef = useRef<HTMLDivElement>(null)
  const videosRef = useRef<HTMLDivElement>(null)
  const postersRef = useRef<HTMLDivElement>(null)

  const sections = [
    { ...SECTION_CONFIG[0], ref: reviewsRef },
    { ...SECTION_CONFIG[1], ref: synopsisRef },
    { ...SECTION_CONFIG[2], ref: castRef },
    { ...SECTION_CONFIG[3], ref: videosRef },
    { ...SECTION_CONFIG[4], ref: postersRef },
  ]

  const [activeSection, setActiveSection] = useState<SectionKey>("reviews")

  useEffect(() => {
    if (open) {
      setActiveSection("reviews")
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = 0
        }
      })
    }
  }, [open])

  const handleTabClick = (key: SectionKey) => {
    const targetSection = sections.find((section) => section.key === key)
    const container = contentRef.current
    if (targetSection?.ref.current && container) {
      const top = targetSection.ref.current.offsetTop - 24
      container.scrollTo({ top, behavior: "smooth" })
      setActiveSection(key)
    }
  }

  const handleScroll = () => {
    const container = contentRef.current
    if (!container) {
      return
    }

    const scrollPosition = container.scrollTop + 96
    let current: SectionKey = sections[0]?.key ?? "reviews"

    for (const section of sections) {
      const node = section.ref.current
      if (node && scrollPosition >= node.offsetTop) {
        current = section.key
      }
    }

    if (current !== activeSection) {
      setActiveSection(current)
    }
  }

  const formatReviewScore = (rating: number, maxRating = 5) =>
    `${rating.toFixed(1)}/${maxRating}`

  const featuredReviews = movie.reviews.slice(0, 2)
  const ratingValue = typeof movie.rating === "number" ? movie.rating : 0
  const votesValue = typeof movie.votes === "number" ? movie.votes : 0
  const votesLabel = votesValue.toLocaleString("en-IN")

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      width={920}
      styles={{
        content: { padding: 0, background: "transparent", boxShadow: "none" },
        body: { padding: 0 },
      }}
    >
      <div className="relative mx-auto flex w-full max-w-[880px] flex-col overflow-hidden rounded-[28px] bg-gradient-to-b from-white via-white to-slate-50 shadow-[0_22px_48px_-28px_rgba(15,23,42,0.35),0_24px_60px_-40px_rgba(15,23,42,0.24)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 flex h-10 w-10 items-center
          cursor-pointer justify-center rounded-full bg-white/80 shadow-2xs transition hover:bg-white hover:text-slate-700"
        >
          <CloseOutlined />
        </button>

        <header className="flex flex-col gap-6 border-b border-slate-200/70 px-8 pb-6 pt-8 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="space-y-3">
            <Text type="secondary" className="uppercase tracking-[0.2em] text-[11px] text-slate-500">
              Movie details
            </Text>
            <Title level={3} className="!mb-0 text-slate-900">
              {movie.title}
            </Title>
            <Text type="secondary" className="block text-sm text-slate-600">
              {movie.tagline}
            </Text>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
              <span>{movie.genres.join(" • ")}</span>
              <span className="text-slate-300">•</span>
              <span>{movie.runtime}</span>
              <span className="text-slate-300">•</span>
              <span>{movie.languages.join(", ")}</span>
              <span className="hidden text-slate-300 sm:inline">•</span>
              <span className="hidden sm:inline">{movie.releaseDate}</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="flex items-center gap-3 rounded-2xl bg-indigo-50/70 px-4 py-3 text-slate-900">
              <StarFilled className="text-amber-400" />
              <div>
                <Text strong className="block text-xl text-slate-900">
                  {ratingValue.toFixed(1)}/5
                </Text>
                <Text type="secondary" className="text-xs text-slate-500">
                  {votesLabel} votes
                </Text>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Tag
                bordered={false}
                className="!m-0 !rounded-full !bg-slate-800/10 !px-3 !py-1 !text-xs !font-medium !text-slate-700"
              >
                {movie.certificate}
              </Tag>
              <Tag
                bordered={false}
                className="!m-0 !rounded-full !bg-indigo-100 !px-3 !py-1 !text-xs !font-medium !text-indigo-700"
              >
                {movie.runtime}
              </Tag>
            </div>
          </div>
        </header>

        <nav className="flex items-center gap-6 overflow-x-auto border-b border-slate-200/70 px-8 pb-4 text-sm font-medium text-slate-500">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => handleTabClick(section.key)}
              className={`relative flex flex-col items-center gap-2 pb-1 transition ${
                activeSection === section.key
                  ? "text-indigo-700"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>{section.label}</span>
              <span
                className={`h-1 w-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-teal-400 transition origin-left ${
                  activeSection === section.key ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              />
            </button>
          ))}
        </nav>

        <div
          ref={contentRef}
          className="max-h-[70vh] space-y-14 overflow-y-auto px-8 pb-12 pt-8"
          onScroll={handleScroll}
        >
          <section ref={reviewsRef} id="movie-detail-reviews" className="space-y-8 scroll-mt-28">
            <Title level={4} className="!mb-0 text-xl text-slate-900">
              Reviews
            </Title>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {movie.reviews.map((review) => (
                <div
                  key={`${review.id}-badge`}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 shadow-sm"
                >
                  <Avatar
                    size={44}
                    src={review.logo}
                    className="bg-indigo-100 font-semibold text-indigo-700"
                  >
                    {review.source.charAt(0)}
                  </Avatar>
                  <div>
                    <Text strong className="block text-sm text-slate-900">
                      {formatReviewScore(review.rating, review.maxRating)}
                    </Text>
                      <Text type="secondary" className="block text-xs text-slate-500">
                      {review.source}
                    </Text>
                  </div>
                </div>
              ))}
            </div>

            {featuredReviews.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {featuredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white/90 p-5 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.45)]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <Text strong className="block text-sm text-slate-900">
                          {review.source}
                        </Text>
                        <Text type="secondary" className="block text-xs text-slate-500">
                          {review.author ?? "Critic review"}
                        </Text>
                      </div>
                      <Tag
                        color="success"
                        className="!m-0 !rounded-full !px-3 !py-0.5 !text-xs !font-semibold"
                      >
                        {formatReviewScore(review.rating, review.maxRating)}
                      </Tag>
                    </div>
                    <Paragraph className="!mb-0 text-sm text-slate-600">
                      {review.snippet}
                    </Paragraph>
                    {review.url ? (
                      <a
                        href={review.url}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
                      >
                        Read more
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <section ref={synopsisRef} id="movie-detail-synopsis" className="space-y-6 scroll-mt-28">
            <Title level={4} className="!mb-0 text-xl text-slate-900">
              Synopsis
            </Title>
            <Paragraph className="!mb-0 text-sm leading-relaxed text-slate-600">
              {movie.synopsis}
            </Paragraph>
            <div className="grid gap-3">
              {movie.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white/75 px-4 py-3 shadow-sm"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400" />
                  <Text type="secondary" className="block text-sm text-slate-600">
                    {highlight}
                  </Text>
                </div>
              ))}
            </div>
          </section>

          <section ref={castRef} id="movie-detail-cast" className="space-y-6 scroll-mt-28">
            <Title level={4} className="!mb-0 text-xl text-slate-900">
              Cast & Crew
            </Title>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,260px),1fr]">
              <div className="rounded-2xl border border-slate-200/60 bg-white/85 p-6 shadow-lg">
                <Title level={5} className="!mb-4 text-base text-slate-900">
                  Creators
                </Title>
                <div className="space-y-3 text-sm text-slate-600">
                  <Text className="block">
                    <strong>Director:</strong> {movie.creators.director}
                  </Text>
                  <Text className="block">
                    <strong>Writers:</strong> {movie.creators.writers.join(", ")}
                  </Text>
                  {movie.creators.music ? (
                    <Text className="block">
                      <strong>Music:</strong> {movie.creators.music}
                    </Text>
                  ) : null}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {movie.cast.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/50 bg-white/85 p-4 text-center shadow-md"
                  >
                    <Avatar size={64} src={member.avatar} />
                    <Text strong className="text-sm text-slate-900">
                      {member.name}
                    </Text>
                      <Text type="secondary" className="text-xs text-slate-500">
                      {member.role}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section ref={videosRef} id="movie-detail-videos" className="space-y-6 scroll-mt-28">
            <Title level={4} className="!mb-0 text-xl text-slate-900">
              Videos
            </Title>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {movie.videos.map((video) => {
                const thumbnailSrc = video.thumbnail ?? movie.poster ?? movie.backdrop ?? ""
                return (
                  <div key={video.id} className="flex flex-col gap-3">
                    <div className="relative overflow-hidden rounded-3xl shadow-lg">
                      {thumbnailSrc ? (
                        <img
                          src={thumbnailSrc}
                          alt={video.title}
                          loading="lazy"
                          className="h-40 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-40 w-full items-center justify-center bg-slate-900/80 text-white">
                          <PlayCircleOutlined className="text-4xl" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-900/45 text-white">
                        <PlayCircleOutlined className="text-4xl" />
                        <span className="text-xs font-semibold tracking-wider">{video.duration}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Text strong className="block text-sm text-slate-900">
                        {video.title}
                      </Text>
                      <Text type="secondary" className="block text-xs text-slate-500">
                        {video.type ? `${video.type} • ` : ""}
                        {video.duration}
                      </Text>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section ref={postersRef} id="movie-detail-posters" className="space-y-6 scroll-mt-28">
            <Title level={4} className="!mb-0 text-xl text-slate-900">
              Posters
            </Title>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {movie.posters.map((poster) => (
                <figure
                  key={poster.id}
                  className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/85 shadow-lg"
                >
                  <img
                    src={poster.image}
                    alt={poster.title ?? movie.title}
                    loading="lazy"
                    className="h-64 w-full object-cover"
                  />
                  {poster.title ? (
                    <figcaption className="px-4 py-3 text-xs text-slate-500">
                      {poster.title}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Modal>
  )
}

export default MovieDetailDialog
