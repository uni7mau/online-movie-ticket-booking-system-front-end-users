import { useEffect, useRef, useState } from "react"

type LatLngLiteral = { lat: number; lng: number }

type CinemaMapPanelProps = {
  apiKey?: string
  cityCenter: LatLngLiteral
  cinemas: Array<{
    id: string
    name: string
    address: string
    latitude: number
    longitude: number
  }>
  focusedCinemaId: string | null
  onMarkerClick?: (cinemaId: string) => void
}

type MarkerIconOptions = {
  path: unknown
  scale: number
  fillColor: string
  fillOpacity: number
  strokeColor: string
  strokeWeight: number
}

type GoogleMapInstance = {
  panTo: (location: LatLngLiteral) => void
  setZoom: (zoom: number) => void
  fitBounds: (bounds: GoogleLatLngBounds) => void
}

type GoogleMarkerInstance = {
  setMap: (map: GoogleMapInstance | null) => void
  setIcon: (icon: MarkerIconOptions) => void
  addListener: (eventName: string, handler: () => void) => void
}

type GoogleLatLngBounds = {
  extend: (location: LatLngLiteral) => void
}

type GoogleDirectionsService = {
  route: (
    request: {
      origin: LatLngLiteral
      destination: LatLngLiteral
      travelMode: string
    },
    callback?: (...args: unknown[]) => void
  ) => void
}

type GoogleDirectionsRenderer = {
  set: (key: string, value: unknown) => void
  setMap: (map: GoogleMapInstance | null) => void
}

type GoogleMapsLibrary = {
  maps: {
    Map: new (
      container: HTMLElement,
      options: {
        center: LatLngLiteral
        zoom: number
        mapTypeControl: boolean
        streetViewControl: boolean
        fullscreenControl: boolean
      }
    ) => GoogleMapInstance
    Marker: new (options: {
      position: LatLngLiteral
      map: GoogleMapInstance
      title: string
      icon: MarkerIconOptions
    }) => GoogleMarkerInstance
    SymbolPath: { CIRCLE: unknown }
    LatLngBounds: new () => GoogleLatLngBounds
    DirectionsService: new () => GoogleDirectionsService
    DirectionsRenderer: new (options?: {
      suppressMarkers?: boolean
      preserveViewport?: boolean
    }) => GoogleDirectionsRenderer
    TravelMode: { DRIVING: string }
  }
}

type WindowWithGoogle = Window & {
  google?: GoogleMapsLibrary
}

declare global {
  interface Window {
    __googleMapsInitCallbacks?: Array<() => void>
  }
}

const MAP_SCRIPT_ID = "google-maps-script"

const loadGoogleMaps = (apiKey: string): Promise<GoogleMapsLibrary | null> => {
  if (typeof window === "undefined") {
    return Promise.resolve(null)
  }

  const windowWithGoogle = window as WindowWithGoogle
  if (windowWithGoogle.google?.maps) {
    return Promise.resolve(windowWithGoogle.google)
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(MAP_SCRIPT_ID) as HTMLScriptElement | null

    const notifyCallbacks = () => {
      const callbacks = window.__googleMapsInitCallbacks ?? []
      callbacks.forEach((callback) => callback())
      window.__googleMapsInitCallbacks = []
    }

    const onLoad = () => {
      notifyCallbacks()
      resolve(windowWithGoogle.google ?? null)
    }

    if (existing) {
      window.__googleMapsInitCallbacks = [...(window.__googleMapsInitCallbacks ?? []), onLoad]
      if (existing.getAttribute("data-loaded") === "true") {
        onLoad()
      } else {
        existing.addEventListener("load", () => {
          existing.setAttribute("data-loaded", "true")
          onLoad()
        })
      }
      return
    }

    window.__googleMapsInitCallbacks = [...(window.__googleMapsInitCallbacks ?? []), onLoad]

    const script = document.createElement("script")
    script.id = MAP_SCRIPT_ID
    script.async = true
    script.defer = true
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`
    script.addEventListener("load", () => {
      script.setAttribute("data-loaded", "true")
      onLoad()
    })
    script.addEventListener("error", (event) => {
      reject(event)
    })
    document.head.appendChild(script)
  })
}

const CinemaMapPanel = ({
  apiKey,
  cityCenter,
  cinemas,
  focusedCinemaId,
  onMarkerClick,
}: CinemaMapPanelProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const googleRef = useRef<GoogleMapsLibrary | null>(null)
  const mapRef = useRef<GoogleMapInstance | null>(null)
  const markersRef = useRef<Record<string, GoogleMarkerInstance>>({})
  const directionsServiceRef = useRef<GoogleDirectionsService | null>(null)
  const directionsRendererRef = useRef<GoogleDirectionsRenderer | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiKey) {
      setError("Provide a Google Maps API key to enable the map.")
      return
    }
    setError(null)

    let isCancelled = false

    loadGoogleMaps(apiKey)
      .then((google) => {
        if (!google || isCancelled) {
          return
        }

        googleRef.current = google

        if (!containerRef.current) {
          return
        }

        const map = new google.maps.Map(containerRef.current, {
          center: cityCenter,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        })

        mapRef.current = map
        directionsServiceRef.current = new google.maps.DirectionsService()
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          preserveViewport: true,
        })
        directionsRendererRef.current.setMap(map)
      })
      .catch(() => {
        if (!isCancelled) {
          setError("Could not load Google Maps. Please verify the API key and network connectivity.")
        }
      })

    return () => {
      isCancelled = true
    }
  }, [apiKey, cityCenter])

  useEffect(() => {
    const google = googleRef.current
    const map = mapRef.current
    if (!google || !map) {
      return
    }

    Object.values(markersRef.current).forEach((marker) => marker.setMap(null))
    markersRef.current = {}

    cinemas.forEach((cinema) => {
      const marker = new google.maps.Marker({
        position: { lat: cinema.latitude, lng: cinema.longitude },
        map,
        title: cinema.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#2563eb",
          fillOpacity: 1,
          strokeColor: "#1d4ed8",
          strokeWeight: 2,
        },
      })

      marker.addListener("click", () => {
          onMarkerClick?.(cinema.id)
      })

      markersRef.current[cinema.id] = marker
    })

    if (!focusedCinemaId && cinemas.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      cinemas.forEach((cinema) => bounds.extend({ lat: cinema.latitude, lng: cinema.longitude }))
      bounds.extend(cityCenter)
      map.fitBounds(bounds)
    }
  }, [cinemas, onMarkerClick, cityCenter, focusedCinemaId])

  useEffect(() => {
    const google = googleRef.current
    const map = mapRef.current
    const directionsService = directionsServiceRef.current
    const directionsRenderer = directionsRendererRef.current

    if (!google || !map || !directionsService || !directionsRenderer) {
      return
    }

    Object.values(markersRef.current).forEach((marker) => {
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#2563eb",
        fillOpacity: 1,
        strokeColor: "#1d4ed8",
        strokeWeight: 2,
      })
    })

    if (!focusedCinemaId) {
      directionsRenderer.set("directions", null)
      map.panTo(cityCenter)
      map.setZoom(12)
      return
    }

    const target = cinemas.find((cinema) => cinema.id === focusedCinemaId)
    if (!target) {
      directionsRenderer.set("directions", null)
      map.panTo(cityCenter)
      map.setZoom(12)
      return
    }

    const targetMarker = markersRef.current[focusedCinemaId]
    if (targetMarker) {
      targetMarker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#f97316",
        fillOpacity: 1,
        strokeColor: "#ea580c",
        strokeWeight: 2,
      })
    }

    map.panTo({ lat: target.latitude, lng: target.longitude })
    map.setZoom(14)

    directionsService.route(
      {
        origin: cityCenter,
        destination: { lat: target.latitude, lng: target.longitude },
        travelMode: google.maps.TravelMode.DRIVING,
      },
    )
  }, [focusedCinemaId, cinemas, cityCenter])

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50 px-6 text-center text-sm text-gray-500">
        Provide a Google Maps API key to render the map. Set <code className="font-mono">VITE_GOOGLE_MAPS_API_KEY</code>{" "}
        (Vite) or <code className="font-mono">REACT_APP_GOOGLE_MAPS_API_KEY</code> (CRA) in your environment.
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50 px-6 text-center text-sm text-red-500">
        {error}
      </div>
    )
  }

  return <div ref={containerRef} className="h-full w-full" />
}

export default CinemaMapPanel
