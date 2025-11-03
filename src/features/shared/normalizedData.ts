import type {
  CinemaFeatureRecord,
  CinemaRecord,
  CinemaScreenRecord,
  CinemaShowtimeSlotRecord,
  CollectionRecord,
  MovieAuthorRecord,
  MovieCastRecord,
  MovieCreatorRecord,
  MovieFormatRecord,
  MovieGenreRecord,
  MovieHighlightRecord,
  MovieLanguageRecord,
  MovieMetricRecord,
  MoviePictureRecord,
  MovieRecord,
  MovieReviewRecord,
  MovieTagRecord,
  MovieTrailerRecord,
  NormalizedData,
  OfferRecord,
  ShowtimeRecord,
} from './types'
import {
  cinemaLocations,
  cinemaShowtimes,
  heroSlides,
  movieDetailsById,
  movieList,
  offers,
} from './sampleData'

const movieDetailsList = Object.values(movieDetailsById)

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const extractIsoDate = (input?: string) => {
  if (!input) {
    return undefined
  }
  const match = input.match(/(\d{2})[./-](\d{2})[./-](\d{4})/)
  if (!match) {
    return input
  }
  const [, day, month, year] = match
  return `${year}-${month}-${day}`
}

const parsePrice = (price?: string) => {
  if (!price) {
    return { amount: undefined, currency: undefined }
  }
  const match = price.match(/([A-Za-z]{3})\s*([\d.,]+)/)
  if (!match) {
    return { amount: undefined, currency: undefined }
  }
  const [, currency, rawAmount] = match
  const amount = Number(rawAmount.replace(/,/g, ''))
  return {
    amount: Number.isFinite(amount) ? amount : undefined,
    currency: currency.toUpperCase(),
  }
}

const parseDurationToSeconds = (duration?: string) => {
  if (!duration) {
    return undefined
  }
  const parts = duration.split(':').map((part) => Number(part))
  if (parts.some((part) => Number.isNaN(part))) {
    return undefined
  }
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    return hours * 3600 + minutes * 60 + seconds
  }
  if (parts.length === 2) {
    const [minutes, seconds] = parts
    return minutes * 60 + seconds
  }
  if (parts.length === 1) {
    return parts[0]
  }
  return undefined
}

const pushUniqueRecord = <T>(records: T[], seen: Set<string>, key: string, record: T) => {
  if (!seen.has(key)) {
    seen.add(key)
    records.push(record)
  }
}

const normalizedMovieRecords: MovieRecord[] = movieList.map((movie) => ({
  movie_id: movie.id,
  title: movie.title,
  subtitle: movie.subtitle,
  rating_value: movie.rating,
  total_votes: movie.votes,
  certificate: movie.certificate,
  duration: movie.runtime,
  release: extractIsoDate(movie.releaseDate) ?? movie.releaseDate,
  trending_flag: movie.trending ?? false,
}))

const normalizedMovieAuthors: MovieAuthorRecord[] = []
const normalizedMovieLanguages: MovieLanguageRecord[] = []
const normalizedMovieFormats: MovieFormatRecord[] = []
const normalizedMovieTags: MovieTagRecord[] = []

const authorSeen = new Set<string>()
const languageSeen = new Set<string>()
const formatSeen = new Set<string>()
const tagSeen = new Set<string>()

const registerAuthors = (movieId: string, authors?: string[]) => {
  authors?.forEach((author) =>
    pushUniqueRecord(
      normalizedMovieAuthors,
      authorSeen,
      `${movieId}:${author}`,
      {
        movie_id: movieId,
        author_name: author,
      }
    )
  )
}

const registerLanguages = (movieId: string, languages?: string[]) => {
  languages?.forEach((language) =>
    pushUniqueRecord(
      normalizedMovieLanguages,
      languageSeen,
      `${movieId}:${language}`,
      {
        movie_id: movieId,
        language_code: language,
      }
    )
  )
}

const registerFormats = (movieId: string, formats?: string[]) => {
  formats?.forEach((format) =>
    pushUniqueRecord(
      normalizedMovieFormats,
      formatSeen,
      `${movieId}:${format}`,
      {
        movie_id: movieId,
        format_code: format,
      }
    )
  )
}

const registerTags = (movieId: string, tags?: string[]) => {
  tags?.forEach((tag) =>
    pushUniqueRecord(
      normalizedMovieTags,
      tagSeen,
      `${movieId}:${tag}`,
      {
        movie_id: movieId,
        tag,
      }
    )
  )
}

movieList.forEach((movie) => {
  registerAuthors(movie.id, movie.authors)
  registerLanguages(movie.id, movie.languages)
  registerFormats(movie.id, movie.formats)
  registerTags(movie.id, movie.tags)
})

movieDetailsList.forEach((movie) => {
  registerAuthors(movie.id, movie.authors)
  registerLanguages(movie.id, movie.languages)
  registerFormats(movie.id, movie.formats)
  registerTags(movie.id, movie.tags)
})

const normalizedMovieGenres: MovieGenreRecord[] = []
const normalizedMovieHighlights: MovieHighlightRecord[] = []
const normalizedMovieMetrics: MovieMetricRecord[] = []
const normalizedMovieCreators: MovieCreatorRecord[] = []
const normalizedMovieCast: MovieCastRecord[] = []
const normalizedMoviePictures: MoviePictureRecord[] = []
const normalizedMovieTrailers: MovieTrailerRecord[] = []
const normalizedMovieReviews: MovieReviewRecord[] = []

const genreSeen = new Set<string>()
const highlightSeen = new Set<string>()
const metricSeen = new Set<string>()
const creatorSeen = new Set<string>()
const castSeen = new Set<string>()
const pictureSeen = new Set<string>()
const trailerSeen = new Set<string>()
const reviewSeen = new Set<string>()

movieDetailsList.forEach((movie) => {
  movie.genres?.forEach((genre) =>
    pushUniqueRecord(
      normalizedMovieGenres,
      genreSeen,
      `${movie.id}:${genre}`,
      { movie_id: movie.id, genre_name: genre }
    )
  )

  movie.highlights?.forEach((highlight) =>
    pushUniqueRecord(
      normalizedMovieHighlights,
      highlightSeen,
      `${movie.id}:${highlight}`,
      { movie_id: movie.id, highlight_text: highlight }
    )
  )

  movie.metrics?.forEach((metric) =>
    pushUniqueRecord(
      normalizedMovieMetrics,
      metricSeen,
      `${movie.id}:${metric.label}`,
      {
        movie_id: movie.id,
        metric_type: toSlug(metric.label),
        value: metric.value,
      }
    )
  )

  if (movie.creators?.director) {
    pushUniqueRecord(
      normalizedMovieCreators,
      creatorSeen,
      `${movie.id}:director:${movie.creators.director}`,
      { movie_id: movie.id, role_code: 'director', person_name: movie.creators.director }
    )
  }
  movie.creators?.writers?.forEach((writer) =>
    pushUniqueRecord(
      normalizedMovieCreators,
      creatorSeen,
      `${movie.id}:writer:${writer}`,
      { movie_id: movie.id, role_code: 'writer', person_name: writer }
    )
  )
  if (movie.creators?.music) {
    pushUniqueRecord(
      normalizedMovieCreators,
      creatorSeen,
      `${movie.id}:music:${movie.creators.music}`,
      { movie_id: movie.id, role_code: 'music', person_name: movie.creators.music }
    )
  }

  movie.cast?.forEach((member) =>
    pushUniqueRecord(
      normalizedMovieCast,
      castSeen,
      `${movie.id}:${member.id}`,
      {
        movie_id: movie.id,
        cast_id: member.id,
        actor_name: member.name,
        role_name: member.role,
        avatar_url: member.avatar,
      }
    )
  )

  if (movie.poster) {
    pushUniqueRecord(
      normalizedMoviePictures,
      pictureSeen,
      `${movie.id}:poster`,
      {
        picture_id: `${movie.id}-poster`,
        movie_id: movie.id,
        image_url: movie.poster,
        label: 'poster',
      }
    )
  }
  if (movie.backdrop) {
    pushUniqueRecord(
      normalizedMoviePictures,
      pictureSeen,
      `${movie.id}:backdrop`,
      {
        picture_id: `${movie.id}-backdrop`,
        movie_id: movie.id,
        image_url: movie.backdrop,
        label: 'backdrop',
      }
    )
  }
  movie.posters?.forEach((poster) =>
    pushUniqueRecord(
      normalizedMoviePictures,
      pictureSeen,
      `${movie.id}:${poster.id}`,
      {
        picture_id: poster.id,
        movie_id: movie.id,
        image_url: poster.image,
        label: poster.title,
      }
    )
  )

  movie.videos?.forEach((video) => {
    if (!video.embedUrl) {
      return
    }
    pushUniqueRecord(
      normalizedMovieTrailers,
      trailerSeen,
      `${movie.id}:${video.id}`,
      {
        trailer_id: video.id,
        movie_id: movie.id,
        embed_url: video.embedUrl,
        title: video.title,
        thumbnail_url: video.thumbnail,
        duration_seconds: parseDurationToSeconds(video.duration),
      }
    )
  })

  movie.reviews?.forEach((review) =>
    pushUniqueRecord(
      normalizedMovieReviews,
      reviewSeen,
      `${movie.id}:${review.id}`,
      {
        review_id: review.id,
        movie_id: movie.id,
        source_name: review.source,
        rating_value: review.rating,
        rating_max: review.maxRating,
        author_name: review.author,
        logo_url: review.logo,
        snippet_text: review.snippet,
        url_link: review.url,
      }
    )
  )
})

const normalizedCollectionRecords: CollectionRecord[] = heroSlides.map((slide, index) => ({
  collection_id: `collection-${index + 1}`,
  title: slide.title,
  description: slide.description,
  image_url: slide.image,
  cta_label: 'Explore',
}))

const normalizedOfferRecords: OfferRecord[] = offers.map((offer, index) => ({
  offer_id: offer.id,
  target_type: 'collection',
  target_id:
    normalizedCollectionRecords[index % normalizedCollectionRecords.length]?.collection_id ??
    'collection-1',
  title: offer.title,
  description: offer.description,
  badge_label: offer.badge,
  terms_text: offer.terms.join('\n'),
  is_active: true,
}))

const normalizedCinemaRecords: CinemaRecord[] = cinemaLocations.map((cinema) => ({
  cinema_id: cinema.id,
  name: cinema.name,
  description: cinema.venueDetails,
  address_line: cinema.address,
  phone: undefined,
  latitude: cinema.latitude,
  longitude: cinema.longitude,
  email: undefined,
  website: undefined,
  is_active: true,
  image_url: cinema.imageUrl,
  opening_hours: undefined,
  closing_hours: undefined,
  code: undefined,
  city_name: cinema.cityKey,
  organization_id: undefined,
}))

const normalizedCinemaFeatureRecords: CinemaFeatureRecord[] = []
cinemaLocations.forEach((cinema) => {
  cinema.amenities?.forEach((amenity) =>
    normalizedCinemaFeatureRecords.push({
      cinema_id: cinema.id,
      feature_type: 'amenity',
      label: amenity,
    })
  )
  cinema.services?.forEach((service) =>
    normalizedCinemaFeatureRecords.push({
      cinema_id: cinema.id,
      feature_type: 'service',
      label: service,
    })
  )
  cinema.experiences?.forEach((experience) =>
    normalizedCinemaFeatureRecords.push({
      cinema_id: cinema.id,
      feature_type: 'experience',
      label: experience,
    })
  )
})

const normalizedCinemaScreenRecords: CinemaScreenRecord[] = cinemaShowtimes.map((cinemaShow) => ({
  screen_id: `${cinemaShow.id}-screen-1`,
  cinema_id: cinemaShow.id,
  name: `${cinemaShow.name} Screen 1`,
  screen_type: cinemaShow.experiences?.[0],
  is_active: true,
}))

const normalizedShowtimeRecords: ShowtimeRecord[] = []
const normalizedShowtimeSlotRecords: CinemaShowtimeSlotRecord[] = []
const showtimeSeen = new Set<string>()

cinemaShowtimes.forEach((cinemaShow) => {
  const screenId = `${cinemaShow.id}-screen-1`
  cinemaShow.slots.forEach((slot) => {
    const showtimeId = `${cinemaShow.id}-${slot.movieId}`
    pushUniqueRecord(
      normalizedShowtimeRecords,
      showtimeSeen,
      showtimeId,
      {
        showtime_id: showtimeId,
        movie_id: slot.movieId,
        screen_id: screenId,
        name: cinemaShow.name,
        provider_name: cinemaShow.provider,
        capacity_seat: undefined,
        cancellation_policy: cinemaShow.cancellationPolicy,
        booking_open_time: undefined,
        booking_close_time: undefined,
      }
    )

    const { amount, currency } = parsePrice(slot.price)
    normalizedShowtimeSlotRecords.push({
      slot_id: slot.id,
      showtime_id: showtimeId,
      screen_id: screenId,
      slot_date: slot.date,
      slot_time: slot.time,
      experience_text: slot.experience,
      price_amount: amount,
      price_currency: currency,
      discount: undefined,
      is_filling_fast: slot.isFillingFast,
      is_sold_out: slot.isSoldOut,
      is_prime: slot.isPrime,
    })
  })
})

export const normalizedData: NormalizedData = {
  movies: normalizedMovieRecords,
  moviePictures: normalizedMoviePictures,
  movieTrailers: normalizedMovieTrailers,
  movieReviews: normalizedMovieReviews,
  movieAuthors: normalizedMovieAuthors,
  movieLanguages: normalizedMovieLanguages,
  movieFormats: normalizedMovieFormats,
  movieTags: normalizedMovieTags,
  movieGenres: normalizedMovieGenres,
  movieHighlights: normalizedMovieHighlights,
  movieMetrics: normalizedMovieMetrics,
  movieCreators: normalizedMovieCreators,
  movieCast: normalizedMovieCast,
  collections: normalizedCollectionRecords,
  offers: normalizedOfferRecords,
  cinemas: normalizedCinemaRecords,
  cinemaFeatures: normalizedCinemaFeatureRecords,
  cinemaScreens: normalizedCinemaScreenRecords,
  showtimes: normalizedShowtimeRecords,
  showtimeSlots: normalizedShowtimeSlotRecords,
}

export {
  normalizedMovieRecords,
  normalizedMovieAuthors as normalizedMovieAuthorRecords,
  normalizedMovieLanguages as normalizedMovieLanguageRecords,
  normalizedMovieFormats as normalizedMovieFormatRecords,
  normalizedMovieTags as normalizedMovieTagRecords,
  normalizedMovieGenres as normalizedMovieGenreRecords,
  normalizedMovieHighlights as normalizedMovieHighlightRecords,
  normalizedMovieMetrics as normalizedMovieMetricRecords,
  normalizedMovieCreators as normalizedMovieCreatorRecords,
  normalizedMovieCast as normalizedMovieCastRecords,
  normalizedMoviePictures as normalizedMoviePictureRecords,
  normalizedMovieTrailers as normalizedMovieTrailerRecords,
  normalizedMovieReviews as normalizedMovieReviewRecords,
  normalizedCollectionRecords,
  normalizedOfferRecords,
  normalizedCinemaRecords,
  normalizedCinemaFeatureRecords,
  normalizedCinemaScreenRecords,
  normalizedShowtimeRecords,
  normalizedShowtimeSlotRecords,
}
