import { useEffect, useMemo, useState } from "react"
import { ArrowRightOutlined, EnvironmentOutlined, HeartOutlined } from "@ant-design/icons"
import { Button, Divider, Tag, Typography } from "antd"
import type { CinemaLocation, CinemaShowtime, DateFilterOption, ShowtimeSlot } from "../../types"

const statusLabel = (slot: ShowtimeSlot) => {
  if (slot.isSoldOut) return { text: "Sold out", color: "#94a3b8" }
  if (slot.isFillingFast) return { text: "Filling fast", color: "#f97316" }
  if (slot.isPrime) return { text: "Prime", color: "#22c55e" }
  return { text: "Available", color: "#16a34a" }
}

const formatCollections = (items?: string[]) =>
  Array.from(new Set(items?.filter(Boolean).map((item) => item.trim()) ?? []))

type CinemaMovieMeta = {
  id: string
  title: string
  poster?: string
  certificate?: string
  runtime?: string
  genre?: string
  rating?: number
  votes?: number
  tagline?: string
}

const { Text } = Typography

type CinemaDetailPageProps = {
  cinema: CinemaLocation
  showtimes?: CinemaShowtime
  dateOptions: DateFilterOption[]
  movieMeta: Record<string, CinemaMovieMeta>
  onViewMovie: (movieId: string) => void
}

const CinemaDetailPage = ({
  cinema,
  showtimes,
  dateOptions,
  movieMeta,
  onViewMovie,
}: CinemaDetailPageProps) => {
  const uniqueDates = useMemo(() => {
    if (!showtimes) return []
    return Array.from(new Set(showtimes.slots.map((slot) => slot.date)))
  }, [showtimes])

  const availableDateOptions = useMemo(() => {
    if (uniqueDates.length === 0) return dateOptions
    return dateOptions.filter((option) => uniqueDates.includes(option.value))
  }, [dateOptions, uniqueDates])

  const initialDate = availableDateOptions[0]?.value ?? showtimes?.slots[0]?.date ?? ""
  const [selectedDate, setSelectedDate] = useState<string>(initialDate)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [selectedFormat, setSelectedFormat] = useState<string>("all")

  useEffect(() => {
    setSelectedDate(initialDate)
  }, [initialDate])

  useEffect(() => {
    setSelectedLanguage("all")
    setSelectedFormat("all")
  }, [showtimes])

  const availableLanguages = useMemo(() => {
    if (!showtimes) return []
    const values = Array.from(new Set(showtimes.slots.map((slot) => slot.language)))
    return values.filter(Boolean)
  }, [showtimes])

  const availableFormats = useMemo(() => {
    if (!showtimes) return []
    const values = Array.from(new Set(showtimes.slots.map((slot) => slot.format)))
    return values.filter(Boolean)
  }, [showtimes])

  const dateLabelMap = useMemo(() => {
    return new Map(dateOptions.map((option) => [option.value, option.meta] as const))
  }, [dateOptions])

  const filteredSlots = useMemo(() => {
    if (!showtimes) return []
    return showtimes.slots.filter((slot) => {
      const matchDate = selectedDate === "" || slot.date === selectedDate
      const matchLanguage = selectedLanguage === "all" || slot.language === selectedLanguage
      const matchFormat = selectedFormat === "all" || slot.format === selectedFormat
      return matchDate && matchLanguage && matchFormat
    })
  }, [showtimes, selectedDate, selectedLanguage, selectedFormat])

  const slotsGroupedByMovie = useMemo(() => {
    const map = new Map<
      string,
      {
        meta: CinemaMovieMeta
        dates: Set<string>
        languages: Map<string, ShowtimeSlot[]>
      }
    >()
    filteredSlots.forEach((slot) => {
      const meta = movieMeta[slot.movieId]
      if (!meta) return
      if (!map.has(slot.movieId)) {
        map.set(slot.movieId, {
          meta,
          dates: new Set<string>(),
          languages: new Map<string, ShowtimeSlot[]>(),
        })
      }
      const entry = map.get(slot.movieId)!
      entry.dates.add(slot.date)
      const languageKey = slot.language || "Other"
      const langSlots = entry.languages.get(languageKey) ?? []
      langSlots.push(slot)
      entry.languages.set(languageKey, langSlots)
    })
    return Array.from(map.values())
      .map(({ meta, dates, languages }) => ({
        meta,
        dates: Array.from(dates).sort(),
        languages: Array.from(languages.entries()).map(([language, slots]) => ({
          language,
          slots: slots.slice().sort((a, b) => a.time.localeCompare(b.time)),
        })),
      }))
      .sort((a, b) => a.meta.title.localeCompare(b.meta.title))
  }, [filteredSlots, movieMeta])

  const servicesAndAmenities = useMemo(() => {
    return [
      ...formatCollections(cinema.amenities),
      ...formatCollections(cinema.services),
      ...formatCollections(cinema.experiences),
    ]
  }, [cinema.amenities, cinema.services, cinema.experiences])

  const distanceText = `${cinema.distanceFromCenterKm.toFixed(1)} km to city center`

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-7 px-4 md:px-0">

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
              <img src={cinema.imageUrl} alt={cinema.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{cinema.name}</h1>
              <div className="mt-1 flex flex-col text-sm text-gray-500">
                <span>{distanceText}</span>
                <span className="inline-flex items-start gap-2">
                  <EnvironmentOutlined className="mt-0.5 text-blue-500" />
                  {cinema.address}
                </span>
              </div>
            </div>
          </div>
          <Button icon={<HeartOutlined />} size="large">
            Save
          </Button>
        </div>

        {servicesAndAmenities.length > 0 ? (
          <>
            <Divider className="!mt-0" />
            <div className="grid gap-3 px-6 pb-6 sm:grid-cols-2 md:grid-cols-3">
              {servicesAndAmenities.slice(0, 6).map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
                  <span>{item}</span>
                </div>
              ))}
              {servicesAndAmenities.length > 6 ? (
                <div className="text-sm font-medium text-blue-600">{`+${servicesAndAmenities.length - 6} more`}</div>
              ) : null}
            </div>
          </>
          ) : null}
        </div>

      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Select a date</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {availableDateOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedDate(option.value)}
                className={`w-24 rounded-xl border px-3 py-2 text-center text-sm font-medium transition ${
                  selectedDate === option.value
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:border-blue-300"
                }`}
              >
                <span className="block text-xs uppercase text-gray-400">{option.label.split(" ")[0]}</span>
                <span>{option.meta}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button
              type={selectedLanguage === "all" ? "primary" : "default"}
              size="small"
              onClick={() => setSelectedLanguage("all")}
            >
              All languages
            </Button>
            {availableLanguages.map((language) => (
              <Button
                key={language}
                type={selectedLanguage === language ? "primary" : "default"}
                size="small"
                onClick={() => setSelectedLanguage(language)}
              >
                {language}
              </Button>
            ))}
            <Divider type="vertical" />
            <Button
              type={selectedFormat === "all" ? "primary" : "default"}
              size="small"
              onClick={() => setSelectedFormat("all")}
            >
              All formats
            </Button>
            {availableFormats.map((format) => (
              <Button
                key={format}
                type={selectedFormat === format ? "primary" : "default"}
                size="small"
                onClick={() => setSelectedFormat(format)}
              >
                {format}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Showtimes</h2>
            <Text type="secondary" className="!text-xs">
              {slotsGroupedByMovie.length} title{slotsGroupedByMovie.length === 1 ? "" : "s"} available
            </Text>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500" /> Available
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-flex h-2 w-2 rounded-full bg-orange-500" /> Filling fast
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-flex h-2 w-2 rounded-full bg-sky-500" /> Prime
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="inline-flex h-2 w-2 rounded-full bg-gray-400" /> Sold out
            </span>
          </div>
        </div>

        {showtimes ? (
          slotsGroupedByMovie.length > 0 ? (
            <div className="mt-5 space-y-6">
              {slotsGroupedByMovie.map(({ meta, dates, languages }) => {
                const infoLine = [meta.certificate, meta.runtime, meta.genre].filter(Boolean).join(" | ")
                const dateSummary = dates
                  .map((date) => dateLabelMap.get(date) ?? date)
                  .join(", ")
                return (
                  <div
                    key={meta.id}
                    className="rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm transition hover:border-blue-400/60"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex w-full items-start gap-4">
                        <div className="relative h-24 w-16 overflow-hidden rounded-xl bg-gray-100">
                          {meta.poster ? (
                            <img
                              src={meta.poster}
                              alt={meta.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                              No poster
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="text-base font-semibold text-gray-900">{meta.title}</h3>
                            <Button
                              type="link"
                              size="small"
                              className="!px-0 flex items-center gap-1"
                              onClick={() => onViewMovie(meta.id)}
                            >
                              View details <ArrowRightOutlined />
                            </Button>
                          </div>
                          {meta.tagline ? (
                            <Text type="secondary" className="!text-xs !leading-tight">
                              {meta.tagline}
                            </Text>
                          ) : null}
                          {infoLine ? <div className="text-xs text-gray-500">{infoLine}</div> : null}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            {typeof meta.rating === "number" ? (
                              <span className="font-semibold text-amber-600">⭐ {meta.rating.toFixed(1)}</span>
                            ) : null}
                            {typeof meta.votes === "number" ? (
                              <span>{meta.votes.toLocaleString("en-IN")} votes</span>
                            ) : null}
                          </div>
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                            {dateSummary ? `Showtimes: ${dateSummary}` : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      {languages.map(({ language, slots }) => (
                        <div key={`${meta.id}-${language}`} className="space-y-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {language}
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {slots.map((slot) => {
                              const status = statusLabel(slot)
                              const isDisabled = slot.isSoldOut
                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  disabled={isDisabled}
                                  className={`min-w-[140px] rounded-2xl border px-4 py-3 text-left transition ${
                                    slot.isSoldOut
                                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                                      : slot.isFillingFast
                                      ? "border-orange-400 bg-orange-50 text-orange-600"
                                      : slot.isPrime
                                      ? "border-blue-400 bg-blue-50 text-blue-600"
                                      : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                                  }`}
                                >
                                  <div className="text-base font-semibold">{slot.time}</div>
                                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                    <span>{slot.format}</span>
                                    <span>{slot.experience}</span>
                                  </div>
                                  <div className="mt-2 flex items-center justify-between text-xs">
                                    <span className="font-medium text-gray-600">{slot.price}</span>
                                    <Tag color={status.color} className="!m-0 text-[10px] uppercase">
                                      {status.text}
                                    </Tag>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center text-gray-500">
              No showtimes match the selected filters.
            </div>
          )
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center text-gray-500">
            Showtimes data for this cinema is not available yet. Please check back soon.
          </div>
        )}
      </div>
    </div>
  )
}

export default CinemaDetailPage
export type { CinemaMovieMeta }
