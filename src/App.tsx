import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Avatar, Layout } from "antd"
import { UserOutlined } from "@ant-design/icons"

import MainHeader from "./features/layout/components/MainHeader"
import AuthModal from "./features/auth/components/AuthModal"
import CinemaDetailPage, { type CinemaMovieMeta } from "./features/cinemas/components/CinemaDetailPage"
import CinemaLocationsPage from "./features/cinemas/components/CinemaLocationsPage"
import CinemaInfoDialog from "./features/cinemas/components/CinemaInfoDialog"
import MovieCatalogView, { type CatalogMovie, type CatalogOption } from "./features/catalog/components/MovieCatalogView"
import MovieShowtimeHeader from "./features/movieDetail/components/MovieShowtimeHeader"
import MovieDetailDialog from "./features/movieDetail/components/MovieDetailDialog"
import ShowtimeFilterBar from "./features/movieDetail/components/ShowtimeFilterBar"
import CinemaShowtimes from "./features/movieDetail/components/CinemaShowtimes"

import {
  cinemaShowtimes,
  cinemaLocations,
  dateOptions,
  experienceFilters,
  formatFilters,
  languageFilters,
  movieDetail,
  movieDetailsById,
  movieList,
} from "./features/shared/sampleData"
import { locationOptions, navigationTabs } from "./features/layout/constants/ui"

import type {
  CinemaLocation,
  CinemaShowtime,
  MovieDetail as MovieDetailType,
  Movie,
  NavigationTab,
} from "./features/shared/types"

const { Content } = Layout

type ViewType = "catalog" | "showtimes"
type CatalogCategory = "nowShowing" | "comingSoon" | "exclusive"
type CategorizedMovie = CatalogMovie & { category: CatalogCategory }

type AuthFormValues = {
  identifier: string
  password: string
}

type RegisterFormValues = {
  phone: string
  email: string
  password: string
  confirmPassword: string
}

const categoryOptions: CatalogOption[] = [
  { label: "Now Showing", value: "nowShowing" },
  { label: "Coming Soon", value: "comingSoon" },
  { label: "Exclusive Picks", value: "exclusive" },
]

const movieGenreLookup: Record<string, string> = {
  "dune-part-two": "Science Fiction",
  "movie-2": "Sci-Fi",
  "movie-3": "Action Thriller",
  "movie-4": "Drama",
  "movie-5": "Musical",
  "movie-6": "Romance",
  "movie-7": "Sports Drama",
  "movie-8": "Fantasy",
}

// Import env file + keys
type GlobalEnv = typeof globalThis & {
  __GOOGLE_MAPS_API_KEY__?: string
}

type ImportMetaWithEnv = ImportMeta & {
  env?: Record<string, string | undefined>
}

const resolveGoogleMapsApiKey = (): string | undefined => {
  const globalEnv = globalThis as GlobalEnv
  if (typeof globalEnv.__GOOGLE_MAPS_API_KEY__ === "string") {
    return globalEnv.__GOOGLE_MAPS_API_KEY__
  }

  if (typeof import.meta !== "undefined") {
    const viteEnv = (import.meta as ImportMetaWithEnv).env
    const viteKey = viteEnv?.VITE_GOOGLE_MAPS_API_KEY
    if (typeof viteKey === "string") {
      return viteKey
    }
  }

  return undefined
}
// ------------------------------------------------------------------

const defaultMovieId = movieList[0]?.id ?? movieDetail.id
const movieDetailEntries: Array<[string, MovieDetailType]> = Object.entries(movieDetailsById)

const toCatalogMovie = (movie: Movie, index: number): CategorizedMovie => {
  const category: CatalogCategory = index < 4 ? "nowShowing" : index < 6 ? "comingSoon" : "exclusive"
  return {
    id: movie.id,
    title: movie.title,
    image: movie.image ?? "",
    rating: movie.rating ?? 0,
    votes: movie.votes ?? 0,
    certificate: movie.certificate ?? "",
    authors: movie.authors ?? [],
    languages: movie.languages,
    formats: movie.formats,
    duration: movie.runtime ?? "",
    release: movie.releaseDate ?? "",
    tags: movie.tags ?? [],
    trending: movie.trending,
    detailId: movie.detailId ?? movie.id,
    genre: movieGenreLookup[movie.id] ?? "Feature",
    category,
  }
}

// Tabs Route
const toTitleCase = (input: string) => input.replace(/\b\w/g, (char) => char.toUpperCase())

const normalizePathname = (pathname: string) => {
  if (!pathname) {
    return "/"
  }
  const trimmed = pathname.replace(/\/+$/, "")
  return trimmed || "/"
}

const buildTabPath = (tabKey: string, fallbackKey: string, detailSegment?: string | null) => {
  const normalizedKey = tabKey?.trim() || fallbackKey
  const base = `/${normalizedKey}`
  if (!detailSegment) {
    return base
  }
  return `${base}/${detailSegment}`
}

const parseRouteFromPath = (pathname: string, tabs: NavigationTab[], fallbackKey: string) => {
  const normalized = normalizePathname(pathname)
  const segments = normalized.split("/").filter(Boolean)
  const candidateTab = segments[0]
  const matchedTab = candidateTab ? tabs.find((tab) => tab.key === candidateTab) ?? null : null
  const tabKey = matchedTab?.key ?? fallbackKey
  const detailSegment = matchedTab ? segments[1] ?? null : null
  return { tabKey, detailSegment }
}
//------------------------------------------------------------------------------------------------

function App() {
  const headerTabs = navigationTabs
  const defaultTabKey = headerTabs[0]?.key ?? "movies"
  const initialRoute =
    typeof window === "undefined" ? { tabKey: defaultTabKey, detailSegment: null } : parseRouteFromPath(window.location.pathname, headerTabs, defaultTabKey)

  const initialMovieId =
    initialRoute.tabKey === "movies" && initialRoute.detailSegment ? initialRoute.detailSegment : defaultMovieId
  const initialCinemaDetailId =
    initialRoute.tabKey === "cinemas" && initialRoute.detailSegment ? initialRoute.detailSegment : null

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [userPhone, setUserPhone] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>(() =>
    initialRoute.tabKey === "movies" && initialRoute.detailSegment ? "showtimes" : "catalog"
  )
  const [selectedMovieId, setSelectedMovieId] = useState<string>(initialMovieId)
  const [selectedLocationKey, setSelectedLocationKey] = useState<string>(
    locationOptions[0]?.key ?? ""
  )
  const [activeCinemaInfoId, setActiveCinemaInfoId] = useState<string | null>(null)
  const [activeCinemaDetailId, setActiveCinemaDetailId] = useState<string | null>(initialCinemaDetailId)
  const [mapFocusedCinemaId, setMapFocusedCinemaId] = useState<string | null>(initialCinemaDetailId)
  const [showtimesCinemaId, setShowtimesCinemaId] = useState<string | null>(null)
  const [activeNavTab, setActiveNavTab] = useState<string>(initialRoute.tabKey)

  const googleMapsApiKey = resolveGoogleMapsApiKey()

  const [activeCategory, setActiveCategory] = useState<CatalogCategory>("nowShowing")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [selectedListingLanguage, setSelectedListingLanguage] = useState<string>("all")
  const [selectedListingFormat, setSelectedListingFormat] = useState<string>("all")

  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].value)
  const [selectedShowtimeLanguage, setSelectedShowtimeLanguage] = useState<string>("all")
  const [selectedShowtimeFormat, setSelectedShowtimeFormat] = useState<string>("all")
  const [selectedExperience, setSelectedExperience] = useState<string>("all")

  const getDateOptionsForMovie = useCallback((movieId: string) => {
    const availableDates = new Set<string>()
    cinemaShowtimes.forEach((cinema) => {
      cinema.slots.forEach((slot) => {
        if (slot.movieId === movieId) {
          availableDates.add(slot.date)
        }
      })
    })
    return dateOptions.filter((option) => availableDates.has(option.value))
  }, [])

  const movieDateOptions = useMemo(() => getDateOptionsForMovie(selectedMovieId), [getDateOptionsForMovie, selectedMovieId])

  useEffect(() => {
    if (movieDateOptions.length && !movieDateOptions.some((option) => option.value === selectedDate)) {
      setSelectedDate(movieDateOptions[0].value)
    }
  }, [movieDateOptions, selectedDate])
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const hasSyncedInitialPath = useRef(false)

  const updateHistory = useCallback(
    (tabKey: string, detailSegment: string | null = null, replace = false) => {
      if (typeof window === "undefined") {
        return
      }
      const nextPath = buildTabPath(tabKey, defaultTabKey, detailSegment)
      const currentPath = normalizePathname(window.location.pathname)
      if (currentPath === nextPath) {
        return
      }
      const method: "replaceState" | "pushState" = replace ? "replaceState" : "pushState"
      window.history[method](window.history.state, "", nextPath)
    },
    [defaultTabKey]
  )

  const navigateToRoute = useCallback(
    (
      route: { tabKey: string; detailSegment?: string | null },
      options?: { replaceHistory?: boolean; skipHistory?: boolean; skipScroll?: boolean }
    ) => {
      const { tabKey, detailSegment = null } = route
      setActiveNavTab(tabKey)

      if (tabKey !== "cinemas") {
        setActiveCinemaInfoId(null)
      }

      if (tabKey === "movies") {
        if (detailSegment) {
          setCurrentView("showtimes")
          setSelectedMovieId(detailSegment)
        } else {
          setCurrentView("catalog")
          setShowtimesCinemaId(null)
        }
        setActiveCinemaDetailId(null)
        setMapFocusedCinemaId(null)
      } else if (tabKey === "cinemas") {
        setCurrentView("catalog")
        setShowtimesCinemaId(null)
        setActiveCinemaDetailId(detailSegment)
        setMapFocusedCinemaId(detailSegment)
      } else {
        setCurrentView("catalog")
        setShowtimesCinemaId(null)
        setActiveCinemaDetailId(null)
        setMapFocusedCinemaId(null)
      }

      if (!options?.skipHistory) {
        updateHistory(tabKey, detailSegment, options?.replaceHistory ?? false)
      }
      if (typeof window !== "undefined" && !options?.skipScroll) {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    },
    [updateHistory]
  )

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const handlePopState = () => {
      const { tabKey, detailSegment } = parseRouteFromPath(window.location.pathname, headerTabs, defaultTabKey)
      navigateToRoute({ tabKey, detailSegment }, { skipHistory: true, skipScroll: true })
    }
    window.addEventListener("popstate", handlePopState)
    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [defaultTabKey, headerTabs, navigateToRoute])

  const getTabHref = useCallback((tabKey: string) => buildTabPath(tabKey, defaultTabKey), [defaultTabKey])

  useEffect(() => {
    if (typeof window === "undefined" || hasSyncedInitialPath.current) {
      return
    }
    hasSyncedInitialPath.current = true
    const currentPath = normalizePathname(window.location.pathname)
    if (currentPath === "/") {
      const detailSegment =
        activeNavTab === "movies" && currentView === "showtimes"
          ? selectedMovieId
          : activeNavTab === "cinemas"
          ? activeCinemaDetailId
          : null
      updateHistory(activeNavTab, detailSegment, true)
    }
  }, [activeNavTab, activeCinemaDetailId, currentView, selectedMovieId, updateHistory])

  const catalogMovies = useMemo<CategorizedMovie[]>(
    () => movieList.map((movie, index) => toCatalogMovie(movie, index)),
    []
  )

  const movieMetaById = useMemo<Record<string, CinemaMovieMeta>>(() => {
    const meta: Record<string, CinemaMovieMeta> = {}
    catalogMovies.forEach((movie) => {
      meta[movie.id] = {
        id: movie.id,
        title: movie.title,
        poster: movie.image,
        certificate: movie.certificate,
        runtime: movie.duration,
        genre: movie.genre,
        rating: movie.rating,
        votes: movie.votes,
      }
    })
    movieDetailEntries.forEach(([id, detail]) => {
      meta[id] = {
        ...meta[id],
        id,
        title: detail.title,
        poster: detail.poster ?? detail.backdrop ?? meta[id]?.poster,
        certificate: detail.certificate ?? meta[id]?.certificate,
        runtime: detail.runtime ?? meta[id]?.runtime,
        genre: detail.genres?.[0] ?? meta[id]?.genre,
        rating: detail.rating ?? meta[id]?.rating ?? 0,
        votes: detail.votes ?? meta[id]?.votes ?? 0,
        tagline: detail.tagline ?? meta[id]?.tagline,
      }
    })
    return meta
  }, [catalogMovies])

  const genreOptions: CatalogOption[] = useMemo(() => {
    const unique = new Map<string, string>()
    unique.set("all", "All genres")
    catalogMovies.forEach((movie) => {
      if (!unique.has(movie.genre)) {
        unique.set(movie.genre, movie.genre)
      }
    })
    return Array.from(unique.entries()).map(([value, label]) => ({ value, label }))
  }, [catalogMovies])

  const languageOptions: CatalogOption[] = useMemo(() => {
    const unique = new Map<string, string>()
    unique.set("all", "All languages")
    catalogMovies.forEach((movie) => {
      movie.languages.forEach((language) => {
        if (!unique.has(language)) {
          unique.set(language, toTitleCase(language))
        }
      })
    })
    return Array.from(unique.entries()).map(([value, label]) => ({ value, label }))
  }, [catalogMovies])

  const formatOptions: CatalogOption[] = useMemo(() => {
    const unique = new Map<string, string>()
    unique.set("all", "All formats")
    catalogMovies.forEach((movie) => {
      movie.formats.forEach((format) => {
        if (!unique.has(format)) {
          unique.set(format, format.toUpperCase())
        }
      })
    })
    return Array.from(unique.entries()).map(([value, label]) => ({ value, label }))
  }, [catalogMovies])

  const filteredCatalogMovies = useMemo<CategorizedMovie[]>(() => {
    return catalogMovies.filter((movie) => {
      const matchesCategory = movie.category === activeCategory
      const matchesGenre = selectedGenre === "all" || movie.genre === selectedGenre
      const matchesLanguage = selectedListingLanguage === "all" || movie.languages.includes(selectedListingLanguage)
      const matchesFormat = selectedListingFormat === "all" || movie.formats.includes(selectedListingFormat)
      return matchesCategory && matchesGenre && matchesLanguage && matchesFormat
    })
  }, [catalogMovies, activeCategory, selectedGenre, selectedListingLanguage, selectedListingFormat])

  const filteredCinemas: CinemaShowtime[] = useMemo(() => {
    return cinemaShowtimes
      .filter((cinema) => !showtimesCinemaId || cinema.id === showtimesCinemaId)
      .map((cinema) => ({
        ...cinema,
        slots: cinema.slots.filter((slot) => {
          const matchMovie = slot.movieId === selectedMovieId
          const matchDate = slot.date === selectedDate
          const matchLanguage = selectedShowtimeLanguage === "all" || slot.language === selectedShowtimeLanguage
          const matchFormat = selectedShowtimeFormat === "all" || slot.format === selectedShowtimeFormat
          const matchExperience = selectedExperience === "all" || slot.experience === selectedExperience
          return matchMovie && matchDate && matchLanguage && matchFormat && matchExperience
        }),
      }))
      .filter((cinema) => cinema.slots.length > 0)
  }, [
    selectedMovieId,
    selectedDate,
    selectedShowtimeLanguage,
    selectedShowtimeFormat,
    selectedExperience,
    showtimesCinemaId,
  ])

  const selectedMovieCard = useMemo<CategorizedMovie | undefined>(() => {
    return (
      filteredCatalogMovies.find((movie) => movie.id === selectedMovieId) ??
      catalogMovies.find((movie) => movie.id === selectedMovieId) ??
      catalogMovies[0]
    )
  }, [filteredCatalogMovies, catalogMovies, selectedMovieId])

  const activeMovieDetail: MovieDetailType =
    movieDetailsById[selectedMovieId] ?? movieDetail

  const handleSelectMovie = (movieId: string) => {
    const nextDates = getDateOptionsForMovie(movieId)
    navigateToRoute({ tabKey: "movies", detailSegment: movieId })
    setShowtimesCinemaId(null)
    if (nextDates[0]) {
      setSelectedDate(nextDates[0].value)
    }
  }

  const handleTabChange = (key: string) => {
    navigateToRoute({ tabKey: key })
  }

  const handleLogin = (values: AuthFormValues) => {
    setUserPhone(values.identifier)
    setIsLoggedIn(true)
  }

  const handleRegister = (values: RegisterFormValues) => {
    setUserPhone(values.phone)
    setIsLoggedIn(true)
  }

  const avatarControl = isLoggedIn ? (
    <Avatar size={40} className="header-avatar">
      {userPhone ? <span className="header-avatar__label">{`+${userPhone.slice(-3)}`}</span> : <UserOutlined />}
    </Avatar>
  ) : (
    <AuthModal
      trigger={
        <Avatar size={40} className="header-avatar" style={{ cursor: "pointer" }}>
          <UserOutlined />
        </Avatar>
      }
      onLogin={handleLogin}
      onRegister={handleRegister}
    />
  )

  const activeLocationKey = selectedLocationKey || locationOptions[0]?.key || ""
  const activeLocationOption =
    locationOptions.find((location) => location.key === activeLocationKey) ?? locationOptions[0]
  const cityCenter = activeLocationOption?.center ?? { lat: 0, lng: 0 }
  const cityLabel = activeLocationOption?.label ?? "Selected city"

  const cinemasForActiveCity = useMemo<CinemaLocation[]>(
    () => cinemaLocations.filter((cinema) => cinema.cityKey === activeLocationKey),
    [activeLocationKey]
  )

  useEffect(() => {
    const firstCinemaId = cinemasForActiveCity[0]?.id ?? null
    setMapFocusedCinemaId((previous) => {
      if (previous && cinemasForActiveCity.some((cinema) => cinema.id === previous)) {
        return previous
      }
      return firstCinemaId
    })
  }, [cinemasForActiveCity])

  const activeCinemaInfo = useMemo<CinemaLocation | null>(() => {
    if (!activeCinemaInfoId) {
      return null
    }
    return cinemasForActiveCity.find((cinema) => cinema.id === activeCinemaInfoId) ?? null
  }, [activeCinemaInfoId, cinemasForActiveCity])

  const activeCinemaDetail = useMemo<CinemaLocation | null>(() => {
    if (!activeCinemaDetailId) {
      return null
    }
    return cinemasForActiveCity.find((cinema) => cinema.id === activeCinemaDetailId) ?? null
  }, [activeCinemaDetailId, cinemasForActiveCity])

  const activeCinemaShowtimes = useMemo(() => {
    if (!activeCinemaDetail?.showtimesId) {
      return undefined
    }
    return cinemaShowtimes.find((item) => item.id === activeCinemaDetail.showtimesId)
  }, [activeCinemaDetail?.showtimesId])

  useEffect(() => {
    if (!activeCinemaInfoId) {
      return
    }
    const exists = cinemasForActiveCity.some((cinema) => cinema.id === activeCinemaInfoId)
    if (!exists) {
      setActiveCinemaInfoId(null)
    }
  }, [activeCinemaInfoId, cinemasForActiveCity])

  const handleShowCinemaInfo = (cinemaId: string) => {
    setActiveCinemaInfoId(cinemaId)
    setMapFocusedCinemaId(cinemaId)
  }

  const handleLocationChange = (key: string) => {
    setSelectedLocationKey(key)
    setActiveCinemaInfoId(null)
    setActiveCinemaDetailId(null)
    setMapFocusedCinemaId(null)
    setShowtimesCinemaId(null)
    if (activeNavTab === "cinemas") {
      navigateToRoute({ tabKey: "cinemas" }, { replaceHistory: true, skipScroll: true })
    }
  }

  const handleCloseCinemaInfo = () => {
    setActiveCinemaInfoId(null)
  }

  const handleOpenCinemaDetail = (cinemaId: string) => {
    setActiveCinemaInfoId(null)
    navigateToRoute({ tabKey: "cinemas", detailSegment: cinemaId })
  }

  const handleFocusCinemaOnMap = (cinemaId: string) => {
    setMapFocusedCinemaId(cinemaId)
  }

  const handleViewShowtimesForCinema = (cinema: CinemaLocation) => {
    setActiveCinemaInfoId(null)
    navigateToRoute({ tabKey: "movies", detailSegment: selectedMovieId })
    setShowtimesCinemaId(cinema.showtimesId ?? null)
    if (movieDateOptions[0]) {
      setSelectedDate(movieDateOptions[0].value)
    }
    setSelectedShowtimeLanguage("all")
    setSelectedShowtimeFormat("all")
    setSelectedExperience("all")
  }

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 text-slate-900">
      <MainHeader
        locations={locationOptions}
        navigationTabs={headerTabs}
        activeTab={activeNavTab}
        onTabChange={handleTabChange}
        getTabHref={getTabHref}
        selectedLocationKey={selectedLocationKey}
        onLocationChange={handleLocationChange}
        isLoggedIn={isLoggedIn}
        alertsCount={isLoggedIn ? 3 : 0}
        authControl={avatarControl}
      />

      <Content className="px-6 py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          {activeNavTab === "cinemas" ? (
            activeCinemaDetail ? (
              <CinemaDetailPage
                cinema={activeCinemaDetail}
                showtimes={activeCinemaShowtimes}
                dateOptions={dateOptions}
                movieMeta={movieMetaById}
                onViewMovie={(movieId) => {
                  setActiveCinemaDetailId(null)
                  handleSelectMovie(movieId)
                }}
              />
            ) : (
              <>
                <CinemaLocationsPage
                  cinemas={cinemasForActiveCity}
                  cityLabel={cityLabel}
                  cityCenter={cityCenter}
                  isLoggedIn={isLoggedIn}
                  focusedCinemaId={mapFocusedCinemaId}
                  googleMapsApiKey={googleMapsApiKey}
                  onFocusCinema={handleFocusCinemaOnMap}
                  onShowCinemaInfo={handleShowCinemaInfo}
                  onViewCinemaDetail={handleOpenCinemaDetail}
                />
                <CinemaInfoDialog
                  open={Boolean(activeCinemaInfo)}
                  cinema={activeCinemaInfo}
                  onClose={handleCloseCinemaInfo}
                  onViewShowtimes={handleViewShowtimesForCinema}
                />
              </>
            )
          ) : activeNavTab === "movies" ? (
            currentView === "catalog" ? (
              <MovieCatalogView
                featuredMovies={filteredCatalogMovies}
                allMovies={catalogMovies}
                categories={categoryOptions}
                activeCategory={activeCategory}
                onCategoryChange={(value) => setActiveCategory(value as CatalogCategory)}
                genreOptions={genreOptions}
                selectedGenre={selectedGenre}
                onGenreChange={setSelectedGenre}
                languageOptions={languageOptions}
                selectedLanguage={selectedListingLanguage}
                onLanguageChange={setSelectedListingLanguage}
                formatOptions={formatOptions}
                selectedFormat={selectedListingFormat}
                onFormatChange={setSelectedListingFormat}
                onSelectMovie={handleSelectMovie}
              />
            ) : (
              <>
                {selectedMovieCard ? (
                  <MovieShowtimeHeader
                    movie={selectedMovieCard}
                    certificate={activeMovieDetail.certificate}
                    runtime={activeMovieDetail.runtime}
                    tagline={activeMovieDetail.tagline}
                    trailer={{
                      thumbnail:
                        activeMovieDetail.videos[0]?.thumbnail ??
                        activeMovieDetail.poster ??
                        selectedMovieCard.image,
                      embedUrl: activeMovieDetail.videos[0]?.embedUrl,
                    }}
                    onViewDetails={() => setDetailsDialogOpen(true)}
                  />
                ) : null}
                <ShowtimeFilterBar
                  dates={movieDateOptions}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  languageOptions={languageFilters}
                  selectedLanguage={selectedShowtimeLanguage}
                  onLanguageChange={setSelectedShowtimeLanguage}
                  formatOptions={formatFilters}
                  selectedFormat={selectedShowtimeFormat}
                  onFormatChange={setSelectedShowtimeFormat}
                  experienceOptions={experienceFilters}
                  selectedExperience={selectedExperience}
                  onExperienceChange={setSelectedExperience}
                />
                <CinemaShowtimes cinemas={filteredCinemas} />
              </>
            )
          ) : (
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 text-center text-slate-500">
              Coming soon.
            </div>
          )}
        </div>
      </Content>

      <MovieDetailDialog
        open={detailsDialogOpen}
        movie={activeMovieDetail}
        onClose={() => setDetailsDialogOpen(false)}
      />
    </Layout>
  )
}

export default App
