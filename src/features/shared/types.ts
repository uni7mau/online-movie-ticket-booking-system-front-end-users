export type LocationOption = {
  key: string
  label: string
  center: {
    lat: number
    lng: number
  }
}

export type NavigationTab = {
  key: string
  label: string
}

export type SelectOption = {
  value: string
  label: string
}

export type HighlightBadges = Record<string, { color: string; text: string }>

export type HeroSlide = {
  id: string
  title: string
  description: string
  stats: string[]
  image: string
}

export type CastMember = {
  id: string
  name: string
  role: string
  avatar: string
}

export type MovieReview = {
  id: string
  source: string
  rating: number
  maxRating?: number
  author?: string
  logo?: string
  snippet: string
  url?: string
}

export type MovieVideo = {
  id: string
  title: string
  thumbnail: string
  duration: string
  type?: string
  embedUrl?: string
}

export type MoviePoster = {
  id: string
  image: string
  title?: string
}

export type MovieMetric = {
  label: string
  value: string
}

export type MovieCreators = {
  director?: string
  writers?: string[]
  music?: string
}

export type Movie = {
  id: string
  title: string
  subtitle?: string
  rating?: number
  votes?: number
  certificate?: string
  authors?: string[]
  languages: string[]
  formats: string[]
  tags?: string[]
  image?: string
  trending?: boolean
  detailId?: string
  tagline?: string
  runtime?: string
  genres?: string[]
  releaseDate?: string
  poster?: string
  backdrop?: string
  synopsis?: string
  experiences?: string[]
  highlights?: string[]
  metrics?: MovieMetric[]
  creators?: MovieCreators
  reviews?: MovieReview[]
  videos?: MovieVideo[]
  posters?: MoviePoster[]
  cast?: CastMember[]
}

type RequiredDetailedFields =
  | "tagline"
  | "runtime"
  | "genres"
  | "releaseDate"
  | "poster"
  | "backdrop"
  | "synopsis"
  | "experiences"
  | "highlights"
  | "metrics"

export type MovieDetail = Movie &
  Required<Pick<Movie, RequiredDetailedFields>> & {
    creators: {
      director: string
      writers: string[]
      music?: string
    }
    cast: CastMember[]
    reviews: MovieReview[]
    videos: MovieVideo[]
    posters: MoviePoster[]
  }

export type Collection = {
  id: string
  title: string
  description: string
  image: string
  cta: string
}

type FacilityFields = {
  amenities?: string[]
  services?: string[]
  experiences?: string[]
}

export type Offer = {
  id: string
  title: string
  description: string
  badge?: string
  terms: string[]
}

export type ShowtimeSlot = {
  id: string
  movieId: string
  date: string
  time: string
  experience: string
  format: string
  language: string
  price: string
  isFillingFast?: boolean
  isSoldOut?: boolean
  isPrime?: boolean
}

export type CinemaShowtime = {
  id: string
  name: string
  provider: string
  address: string
  distance: string
  cancellationPolicy?: string
  priceFrom: string
  slots: ShowtimeSlot[]
} & Required<FacilityFields>

export type CinemaLocation = {
  id: string
  cityKey: string
  name: string
  imageUrl: string
  distanceFromCenterKm: number
  venueDetails: string
  address: string
  latitude: number
  longitude: number
  showtimesId?: string
} & FacilityFields

/**
 * Normalized cinema entity types (to support future dashboard / CRUD use-cases)
 */
export type CinemaFacilityType = "amenity" | "service" | "experience"

export type Cinema = {
  id: string
  code?: string
  organizationId?: string
  name: string
  description?: string
  addressLine1: string
  addressLine2?: string
  cityKey: string
  postalCode?: string
  latitude: number
  longitude: number
  phone?: string
  email?: string
  website?: string
  openingHours?: string
  createdAt?: string
  updatedAt?: string
  isActive?: boolean
}

export type CinemaFacility = {
  id: string
  cinemaId: string
  type: CinemaFacilityType
  code: string
  label: string
  description?: string
}

export type CinemaScreen = {
  id: string
  cinemaId: string
  name: string
  code?: string
  capacity?: number
  layout?: "standard" | "recliner" | "vip" | "imax" | "custom"
  experienceCodes?: string[]
  isActive?: boolean
}

export type CinemaMovieLink = {
  id: string
  cinemaId: string
  movieId: string
  startDate: string
  endDate?: string
  status: "scheduled" | "active" | "ended" | "paused"
  metadata?: Record<string, string | number | boolean | null>
}

export type ShowtimeStatus = "scheduled" | "on_sale" | "sold_out" | "cancelled" | "ended"

export type Showtime = {
  id: string
  cinemaId: string
  screenId: string
  movieId: string
  startDate: string
  startTime: string
  endTime?: string
  durationMinutes?: number
  languageCode: string
  formatCode: string
  experienceCode?: string
  priceAmount: number
  priceCurrency: string
  priceLabel?: string
  status: ShowtimeStatus
  createdAt?: string
  updatedAt?: string
  metadata?: Record<string, string | number | boolean | null>
}

export type DateFilterOption = {
  value: string
  label: string
  meta: string
}

export type FaqItem = {
  id: string
  question: string
  answer: string
}

/**
 * Normalized data types mirroring the proposed relational schema.
 * These types keep the column naming from the ERD so we can move between
 * mock data and a future database without additional mapping.
 */
export type MovieRecord = {
  movie_id: string
  title: string
  subtitle?: string
  rating_value?: number
  total_votes?: number
  certificate?: string
  duration?: string
  release?: string
  trending_flag?: boolean
}

export type MoviePictureRecord = {
  picture_id: string
  movie_id: string
  image_url: string
  label?: string
}

export type MovieTrailerRecord = {
  trailer_id: string
  movie_id: string
  embed_url: string
  title?: string
  thumbnail_url?: string
  duration_seconds?: number
}

export type MovieReviewRecord = {
  review_id: string
  movie_id: string
  source_name: string
  rating_value?: number
  rating_max?: number
  author_name?: string
  logo_url?: string
  snippet_text: string
  url_link?: string
}

export type MovieAuthorRecord = {
  movie_id: string
  author_name: string
}

export type MovieLanguageRecord = {
  movie_id: string
  language_code: string
}

export type MovieFormatRecord = {
  movie_id: string
  format_code: string
}

export type MovieTagRecord = {
  movie_id: string
  tag: string
}

export type MovieGenreRecord = {
  movie_id: string
  genre_name: string
}

export type MovieHighlightRecord = {
  movie_id: string
  highlight_text: string
}

export type MovieMetricRecord = {
  movie_id: string
  metric_type: string
  value: string
}

export type MovieCreatorRecord = {
  movie_id: string
  role_code: string
  person_name: string
}

export type MovieCastRecord = {
  movie_id: string
  cast_id: string
  actor_name: string
  role_name?: string
  avatar_url?: string
}

export type CollectionRecord = {
  collection_id: string
  title: string
  description?: string
  image_url?: string
  cta_label?: string
}

export type OfferRecord = {
  offer_id: string
  target_type: "movie" | "cinema" | "collection" | "screen" | "showtime"
  target_id: string
  title: string
  description: string
  badge_label?: string
  terms_text?: string
  is_active?: boolean
}

export type CinemaRecord = {
  cinema_id: string
  name: string
  description?: string
  address_line?: string
  phone?: string
  latitude: number
  longitude: number
  email?: string
  website?: string
  is_active?: boolean
  image_url?: string
  opening_hours?: string
  closing_hours?: string
  code?: string
  city_name?: string
  organization_id?: string
}

export type CinemaFeatureRecord = {
  cinema_id: string
  feature_type: "amenity" | "service" | "experience"
  label: string
  description?: string
}

export type CinemaScreenRecord = {
  screen_id: string
  cinema_id: string
  name: string
  capacity?: number
  screen_type?: string
  is_active?: boolean
}

export type ShowtimeRecord = {
  showtime_id: string
  movie_id: string
  screen_id: string
  name: string
  provider_name: string
  capacity_seat?: number
  cancellation_policy?: string
  booking_open_time?: string
  booking_close_time?: string
}

export type CinemaShowtimeSlotRecord = {
  slot_id: string
  showtime_id: string
  screen_id: string
  slot_date: string
  slot_time: string
  experience_text?: string
  price_amount?: number
  price_currency?: string
  discount?: number
  is_filling_fast?: boolean
  is_sold_out?: boolean
  is_prime?: boolean
}

export type NormalizedData = {
  movies: MovieRecord[]
  moviePictures: MoviePictureRecord[]
  movieTrailers: MovieTrailerRecord[]
  movieReviews: MovieReviewRecord[]
  movieAuthors: MovieAuthorRecord[]
  movieLanguages: MovieLanguageRecord[]
  movieFormats: MovieFormatRecord[]
  movieTags: MovieTagRecord[]
  movieGenres: MovieGenreRecord[]
  movieHighlights: MovieHighlightRecord[]
  movieMetrics: MovieMetricRecord[]
  movieCreators: MovieCreatorRecord[]
  movieCast: MovieCastRecord[]
  collections: CollectionRecord[]
  offers: OfferRecord[]
  cinemas: CinemaRecord[]
  cinemaFeatures: CinemaFeatureRecord[]
  cinemaScreens: CinemaScreenRecord[]
  showtimes: ShowtimeRecord[]
  showtimeSlots: CinemaShowtimeSlotRecord[]
}
