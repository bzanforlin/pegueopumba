"use client"

import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

// Remove the top-level Leaflet import and configuration
// We'll handle this inside useEffect when the component mounts

interface OccurrenceLocation {
  id: number
  lat: number
  lng: number
  date: string
}

// Mock API function - replace with actual API endpoint
const fetchOccurrences = async (): Promise<OccurrenceLocation[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock data - replace this with actual API call
  return [
    {
      id: 1,
      lat: -23.5505,
      lng: -46.6333,
      date: "2025-01-24"
    },
    {
      id: 2,
      lat: -25.4284,
      lng: -49.2733,
      date: "2025-01-23"
    },
    {
      id: 3,
      lat: -30.0346,
      lng: -51.2177,
      date: "2025-01-22"
    },
    {
      id: 4,
      lat: -19.9167,
      lng: -43.9345,
      date: "2025-01-21"
    },
    {
      id: 5,
      lat: -15.7801,
      lng: -47.9292,
      date: "2025-01-20"
    },
    {
      id: 6,
      lat: -27.5969,
      lng: -48.5495,
      date: "2025-01-19"
    },
    {
      id: 7,
      lat: -22.9068,
      lng: -43.1729,
      date: "2025-01-18"
    },
    {
      id: 8,
      lat: -26.3044,
      lng: -48.8467,
      date: "2025-01-17"
    },
    {
      id: 9,
      lat: -20.2976,
      lng: -40.2958,
      date: "2025-01-16"
    },
    {
      id: 10,
      lat: -29.6914,
      lng: -53.8008,
      date: "2025-01-15"
    }
  ]
}

// Real API function - replace the mock function above with this when ready
const fetchOccurrencesFromAPI = async (): Promise<OccurrenceLocation[]> => {
  try {
    const response = await fetch('/api/occurrences')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data.occurrences || []
  } catch (error) {
    console.error('Error fetching occurrences:', error)
    // Fallback to mock data if API fails
    return fetchOccurrences()
  }
}

const OccurrenceMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [occurrences, setOccurrences] = useState<OccurrenceLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch occurrences from API
  useEffect(() => {
    const loadOccurrences = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchOccurrencesFromAPI()
        setOccurrences(data)
      } catch (err) {
        setError('Erro ao carregar ocorrências')
        console.error('Error loading occurrences:', err)
      } finally {
        setLoading(false)
      }
    }

    loadOccurrences()
  }, [])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || occurrences.length === 0 || !isClient) return

    // Dynamically import Leaflet only on the client side
    const initMap = async () => {
      try {
        const L = await import('leaflet')
        
        // Fix for default markers in Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })

        // Initialize map centered on Brazil
        const map = L.map(mapRef.current!).setView([-15.7801, -47.9292], 5)
        mapInstanceRef.current = map

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        // Add occurrences to the map
        occurrences.forEach(location => {
          // Add marker for the occurrence
          const marker = L.marker([location.lat, location.lng])
            .addTo(map)
            .bindPopup(`
              <div class="p-3 min-w-[200px]">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-lg text-gray-800">Ocorrência #${location.id}</h3>
                </div>
                <div class="space-y-1 text-xs text-gray-600">
                  <p><strong>Data:</strong> ${new Date(location.date).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Coordenadas:</strong> ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}</p>
                </div>
              </div>
            `)

          // Add 10km radius circle (using a neutral color since severity is removed)
          const radius = 0.09 // 10km ≈ 0.09 degrees
          const circle = L.circle([location.lat, location.lng], {
            color: '#6b7280', // Neutral gray color
            fillColor: '#6b7280',
            fillOpacity: 0.1,
            radius: radius * 111000 // Convert to meters (1 degree ≈ 111km)
          }).addTo(map)

          // Add radius label
          L.tooltip({
            permanent: true,
            direction: 'center',
            className: 'radius-label'
          })
            .setContent('10km')
            .setLatLng([location.lat, location.lng])
            .addTo(map)
        })

        // Add Brazil outline
        const brazilBounds = L.latLngBounds(
          [-33.768377, -73.987235], // Southwest
          [5.271786, -34.729993]    // Northeast
        )
        
        L.rectangle(brazilBounds, {
          color: '#5e2f46',
          weight: 2,
          fillOpacity: 0,
          dashArray: '5, 5'
        }).addTo(map)

      } catch (error) {
        console.error('Error initializing map:', error)
        setError('Erro ao inicializar o mapa')
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [occurrences, isClient])

  if (loading) {
    return (
      <div className="w-full h-[600px] rounded-lg border border-border shadow-lg flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando ocorrências...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-[600px] rounded-lg border border-border shadow-lg flex items-center justify-center bg-muted">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border border-border shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

export default OccurrenceMap 