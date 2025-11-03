import type { CatalogMovie, ListingFilterOption } from "../types/MovieCatalog.types"

export const toTitleCase = (input: string) =>
  input.replace(/\b\w/g, (char) => char.toUpperCase())

export const formatAuthors = (authors: string[]) => {
  if (!authors?.length) return "Unknown"
  const [firstAuthor, ...rest] = authors
  const firstName = firstAuthor.split(" ")[0] ?? firstAuthor
  if (!rest.length) return firstName
  return `${firstName} and ${rest.length} more`
}

export const matchesListingFilter = (
  movie: CatalogMovie,
  filter: ListingFilterOption
) => {
  switch (filter.type) {
    case "language":
      return movie.languages.includes(filter.value)
    case "format":
      return movie.formats.includes(filter.value)
    case "category":
      return movie.category === filter.value
    default:
      return true
  }
}
