import { useEffect, useMemo, useState } from "react"
import { HeartFilled, HeartOutlined, InfoCircleOutlined } from "@ant-design/icons"
import type { CinemaLocation } from "../../types"
import CinemaMapPanel from "./CinemaMapPanel"

type CinemaLocationsPageProps = {
  cinemas: CinemaLocation[]
  cityLabel: string
  cityCenter: { lat: number; lng: number }
  isLoggedIn: boolean
  focusedCinemaId: string | null
  googleMapsApiKey?: string
  onFocusCinema?: (cinemaId: string) => void
  onShowCinemaInfo?: (cinemaId: string) => void
  onViewCinemaDetail?: (cinemaId: string) => void
}

const distanceFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
})

const CinemaLocationsPage = ({
  cinemas,
  cityLabel,
  cityCenter,
  isLoggedIn,
  focusedCinemaId,
  googleMapsApiKey,
  onFocusCinema,
  onShowCinemaInfo,
  onViewCinemaDetail,
}: CinemaLocationsPageProps) => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set())
  const [selectedForHighlight, setSelectedForHighlight] = useState<string | null>(focusedCinemaId)

  useEffect(() => {
    setSelectedForHighlight(focusedCinemaId)
  }, [focusedCinemaId])

  const sortedCinemas = useMemo(() => {
    const ordered = [...cinemas]
    ordered.sort((a, b) => a.distanceFromCenterKm - b.distanceFromCenterKm)
    return ordered
  }, [cinemas])

  const renderDistance = (value: number) => `${distanceFormatter.format(value)} km to city center`

  const toggleFavorite = (cinemaId: string) => {
    if (!isLoggedIn) {
      return
    }

    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(cinemaId)) {
        next.delete(cinemaId)
      } else {
        next.add(cinemaId)
      }
      return next
    })
  }

  const handleFocusCinema = (cinemaId: string) => {
    setSelectedForHighlight(cinemaId)
    onFocusCinema?.(cinemaId)
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 lg:flex-row lg:gap-8 lg:px-0">
      <div className="flex-1 space-y-6 lg:w-[56%]">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold text-gray-900">Cinemas in {cityLabel}</h2>
          <p className="text-gray-500">
            Scroll to explore nearby cinemas. Selecting a cinema will highlight it on the map and plot a
            route from the city center.
          </p>
        </div>

        {sortedCinemas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
            <p className="text-gray-500">We do not have cinemas for {cityLabel} yet. Please pick a different city.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {sortedCinemas.map((cinema) => {
              const isSelected = selectedForHighlight === cinema.id
              return (
                <div
                  key={cinema.id}
                  onClick={() => handleFocusCinema(cinema.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      handleFocusCinema(cinema.id)
                    }
                  }}
                  className={`group flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:flex-row ${
                    isSelected ? "border-blue-500 ring-1 ring-blue-100" : "border-gray-200"
                  }`}
                >
                  <div className="relative w-full overflow-hidden rounded-xl sm:h-40 sm:w-[200px] sm:flex-shrink-0">
                    <img
                      src={cinema.imageUrl}
                      alt={cinema.name}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        toggleFavorite(cinema.id)
                      }}
                      className={`absolute right-3 top-3 inline-flex items-center justify-center rounded-full border bg-white/95 p-2 transition ${
                        isLoggedIn ? "hover:bg-blue-50 hover:text-blue-600" : "cursor-not-allowed text-gray-300"
                      }`}
                      aria-label={favoriteIds.has(cinema.id) ? "Remove from favorites" : "Add to favorites"}
                      disabled={!isLoggedIn}
                    >
                      {favoriteIds.has(cinema.id) ? (
                        <HeartFilled className="text-red-500" />
                      ) : (
                        <HeartOutlined className={isLoggedIn ? "text-gray-500" : "text-gray-300"} />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleFocusCinema(cinema.id)
                            onViewCinemaDetail?.(cinema.id)
                          }}
                          className="text-left !text-xl font-semibold text-gray-900 transition hover:text-blue-600 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          {cinema.name}
                        </button>
                        <p className="text-sm text-gray-500 !m-0">{cinema.venueDetails}</p>
                      </div>
                      <span className="text-sm font-medium text-blue-600">
                        {renderDistance(cinema.distanceFromCenterKm)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 !m-0">{cinema.address}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <InfoCircleOutlined className="text-blue-500" />
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleFocusCinema(cinema.id)
                          onShowCinemaInfo?.(cinema.id)
                        }}
                        className="text-sm font-medium text-blue-600 transition hover:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Quick info
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="h-[540px] w-full overflow-hidden rounded-2xl border border-gray-200 lg:sticky lg:top-24 lg:h-[calc(100vh-160px)] lg:min-h-[520px] lg:w-[44%]">
        <CinemaMapPanel
          apiKey={googleMapsApiKey}
          cityCenter={cityCenter}
          cinemas={sortedCinemas}
          focusedCinemaId={selectedForHighlight}
          onMarkerClick={handleFocusCinema}
        />
      </div>
    </div>
  )
}

export default CinemaLocationsPage
