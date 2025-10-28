export type CatalogMovie = {
  id: string
  title: string
  image: string
  rating: number
  votes: number
  certificate: string
  authors: string[]
  languages: string[]
  formats: string[]
  genre: string
  category: string
  duration: string
  release: string
  tags: string[]
  trending?: boolean
  detailId?: string
}

export type CatalogOption = {
  label: string
  value: string
}

export type ListingFilterOption = {
  key: string
  label: string
  type: "category" | "language" | "format"
  value: string
}
