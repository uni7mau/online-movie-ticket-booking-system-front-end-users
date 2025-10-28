import type { HighlightBadges, LocationOption, NavigationTab } from "../types"

export const locationOptions: LocationOption[] = [
  { key: "hanoi", label: "Ha Noi", center: { lat: 21.0278, lng: 105.8342 } },
  { key: "haiphong", label: "Hai Phong", center: { lat: 20.8449, lng: 106.6881 } },
  { key: "hue", label: "Hue", center: { lat: 16.4637, lng: 107.5909 } },
  { key: "danang", label: "Da Nang", center: { lat: 16.0544, lng: 108.2022 } },
  { key: "dalat", label: "Da Lat", center: { lat: 11.9404, lng: 108.4583 } },
  { key: "tphcm", label: "Ho Chi Minh City", center: { lat: 10.776889, lng: 106.700806 } },
]

export const navigationTabs: NavigationTab[] = [
  { key: "movies", label: "Movies" },
  { key: "cinemas", label: "Cinemas" },
  { key: "events", label: "Events" },
  { key: "memberships", label: "Memberships" },
]

export const highlightBadges: HighlightBadges = {
  trending: {
    color: "#f50",
    text: "Trending",
  },
  new: {
    color: "#1677ff",
    text: "New release",
  },
}

