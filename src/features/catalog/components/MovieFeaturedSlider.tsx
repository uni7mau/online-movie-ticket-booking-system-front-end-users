import type { PointerEvent as ReactPointerEvent } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Button, Typography } from "antd"
import {
  ArrowRightOutlined,
  LeftOutlined,
  PlayCircleOutlined,
  RightOutlined,
  StarFilled,
} from "@ant-design/icons"

import type { CatalogMovie } from "../types/MovieCatalog.types"
import { toTitleCase } from "../utils/MovieCatalog.utils"

type MovieFeaturedSliderProps = {
  movies: CatalogMovie[]
  onSelectMovie: (movieId: string) => void
  onExploreListings: () => void
}

const { Title, Text } = Typography

const sliderLimit = 6

const MovieFeaturedSlider = ({
  movies,
  onSelectMovie,
  onExploreListings,
}: MovieFeaturedSliderProps) => {
  const sliderMovies = useMemo(
    () => movies.slice(0, Math.min(sliderLimit, movies.length)),
    [movies]
  )

  const totalSlides = sliderMovies.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragOffsetPercent, setDragOffsetPercent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef({
    pointerId: null as number | null,
    startX: 0,
    lastDelta: 0,
  })

  useEffect(() => {
    if (!totalSlides) {
      setActiveIndex(0)
      return
    }
    setActiveIndex((prev) => (prev >= totalSlides ? totalSlides - 1 : prev))
  }, [totalSlides])

  const goToSlide = useCallback(
    (index: number) => {
      if (!totalSlides) return
      const normalized = (index + totalSlides) % totalSlides
      setActiveIndex(normalized)
    },
    [totalSlides]
  )

  // Chỉ tạo lại hàm khi totalSlides thay đổi
  const goPrev = useCallback(() => {
    if (totalSlides <= 1) return
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const goNext = useCallback(() => {
    if (totalSlides <= 1) return
    setActiveIndex((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (totalSlides <= 1) return
      if (event.pointerType === "mouse" && event.button !== 0) return
      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        lastDelta: 0,
      }
      setIsDragging(true)
      setDragOffsetPercent(0)
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [totalSlides]
  )

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    if (dragStateRef.current.pointerId !== event.pointerId) return
    const sliderWidth = sliderRef.current?.clientWidth ?? 1
    const delta = event.clientX - dragStateRef.current.startX
    dragStateRef.current.lastDelta = delta
    const offsetPercent = (delta / sliderWidth) * 100
    const constrainedOffset = Math.max(Math.min(offsetPercent, 120), -120)
    event.preventDefault()
    setDragOffsetPercent(constrainedOffset)
  }, [isDragging])

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (dragStateRef.current.pointerId !== event.pointerId) return
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      const { lastDelta } = dragStateRef.current
      dragStateRef.current = { pointerId: null, startX: 0, lastDelta: 0 }
      const sliderWidth = sliderRef.current?.clientWidth ?? 1
      const threshold = sliderWidth * 0.15
      setIsDragging(false)
      setDragOffsetPercent(0)
      if (Math.abs(lastDelta) <= threshold) return
      if (lastDelta < 0) {
        goNext()
      } else {
        goPrev()
      }
    },
    [goNext, goPrev]
  )

  const handlePointerCancel = useCallback((event?: ReactPointerEvent<HTMLDivElement>) => {
    if (
      event &&
      dragStateRef.current.pointerId === event.pointerId &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragStateRef.current = { pointerId: null, startX: 0, lastDelta: 0 }
    setIsDragging(false)
    setDragOffsetPercent(0)
  }, [])

  const activeMovie = sliderMovies[activeIndex]
  const sliderInteractive = totalSlides > 1
  const sliderTrackClasses = isDragging
    ? "flex h-full w-full will-change-transform"
    : "flex h-full w-full will-change-transform transition-transform duration-500 ease-out"
  const sliderTransform = `translate3d(${(-activeIndex * 100 + dragOffsetPercent)}%, 0, 0)`

  if (!activeMovie) {
    return null
  }

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-slate-900 shadow-2xl sm:min-h-[380px] lg:min-h-[550px]">
      <div
        ref={sliderRef}
        className={`${sliderInteractive ? "cursor-grab active:cursor-grabbing" : ""} relative flex h-full w-full select-none touch-pan-y`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerCancel}
        role="presentation"
      >
        <div className={sliderTrackClasses} style={{ transform: sliderTransform }}>
          {sliderMovies.map((movie) => (
            <article
              key={movie.id}
              className="relative flex min-h-[320px] w-full flex-shrink-0 flex-col justify-center overflow-hidden px-36 sm:min-h-[380px] lg:min-h-[550px]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `url(${movie.image})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  filter: "blur(2px)",
                  transform: "scale(1.08)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(120deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.8) 45%, rgba(15,23,42,0.35) 80%)",
                }}
              />
              <div className="relative z-10 flex w-full flex-col gap-6 p-6 text-slate-100 sm:flex-row sm:items-end sm:justify-between sm:p-10">
                <div className="w-full max-w-2xl space-y-5">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-100">
                    <span className="rounded-full border border-white/30 bg-slate-950/80  py-1 pl-3 pr-2">
                      Now showing
                    </span>
                    {movie.formats.slice(0, 2).map((format) => (
                      <span
                        key={format}
                        className="rounded-full border border-white/25 bg-white/15 py-1 pl-3 pr-2 text-slate-100"
                      >
                        {format.toUpperCase()}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <Title level={1} className="!m-0 !text-3xl !leading-tight !text-white sm:!text-4xl lg:!text-5xl">
                      {movie.title}
                    </Title>
                    <Text className="!text-sm !text-slate-200/90 sm:!text-base">
                      {[movie.genre, movie.languages.map(toTitleCase).join(", "), movie.formats.map((format) => format.toUpperCase()).join(" / ")].join(" | ")}
                    </Text>
                  </div>
                  <div className="flex items-center gap-3 rounded-full py-2">
                    <StarFilled className="text-lg !text-yellow-300" />
                    <span className="text-xl font-semibold text-white">
                      {movie.rating.toFixed(1)}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-200/80">
                      {movie.votes.toLocaleString("en-IN")} votes
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlayCircleOutlined />}
                      className="!h-12 !px-6 font-semibold shadow-[0_28px_60px_-28px_rgba(250,204,21,0.65)]"
                      onClick={() => onSelectMovie(movie.id)}
                      onPointerDown={(event) => event.stopPropagation()}
                    >
                      Book now
                    </Button>
                    <Button
                      size="large"
                      icon={<ArrowRightOutlined />}
                      ghost
                      className="!h-12 !px-6 font-semibold hover:!bg-white/20"
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={onExploreListings}
                    >
                      Explore listings
                    </Button>
                  </div>
                </div>
                <div className="aspect-[3/4] max-w-[280px] overflow-hidden rounded-[28px] border border-white/20 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.9)] sm:mx-0">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="h-full w-full select-none object-cover"
                    draggable="false"
                    loading="lazy"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {sliderInteractive ? (
        <>
          <button
            type="button"
            className="absolute left-15 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-4 !text-white transition 
            cursor-pointer hover:bg-white/20 lg:block"
            onClick={goPrev}
            aria-label="Previous featured movie"
          >
            <LeftOutlined />
          </button>
          <button
            type="button"
            className="absolute right-15 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-4 !text-white transition 
            cursor-pointer hover:bg-white/20 lg:block"
            onClick={goNext}
            aria-label="Next featured movie"
          >
            <RightOutlined />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
            <div className="flex items-center gap-2">
              {sliderMovies.map((movie, index) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={movie.id}
                    type="button"
                    aria-label={`Go to featured movie ${index + 1}`}
                    onClick={() => goToSlide(index)}
                    className={`pointer-events-auto h-2.5 rounded-full transition-all duration-300 ${
                      isActive ? "w-6 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                )
              })}
            </div>
          </div>
        </>
      ) : null}
    </section>
  )
}

export default MovieFeaturedSlider
