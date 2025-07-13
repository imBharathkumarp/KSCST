"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Zap, Clock, Users, AlertTriangle, Maximize2, Minimize2, RotateCcw } from "lucide-react"

interface TrainLocation {
  id: string
  name: string
  latitude: number
  longitude: number
  speed: number
  heading: number
  status: "on-time" | "delayed" | "stopped"
  delay: number
  occupancy: number
  lastUpdated: string
}

interface Station {
  id: string
  name: string
  code: string
  latitude: number
  longitude: number
  type: "major" | "junction" | "regular"
}

interface LiveTrainMapProps {
  trainId?: string
  initialCenter?: { lat: number; lng: number }
  zoom?: number
  height?: string
  showControls?: boolean
  showStations?: boolean
  onTrainSelect?: (train: TrainLocation) => void
  className?: string
}

// Mock data for demonstration
const mockTrains: TrainLocation[] = [
  {
    id: "EXP2024",
    name: "Express 2024",
    latitude: 19.076,
    longitude: 72.8777,
    speed: 85,
    heading: 45,
    status: "on-time",
    delay: 0,
    occupancy: 67,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "RAJ001",
    name: "Rajdhani Express",
    latitude: 28.6139,
    longitude: 77.209,
    speed: 92,
    heading: 180,
    status: "delayed",
    delay: 15,
    occupancy: 89,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "SHT123",
    name: "Shatabdi Express",
    latitude: 13.0827,
    longitude: 80.2707,
    speed: 0,
    heading: 0,
    status: "stopped",
    delay: 30,
    occupancy: 45,
    lastUpdated: new Date().toISOString(),
  },
]

const mockStations: Station[] = [
  {
    id: "CSMT",
    name: "Chhatrapati Shivaji Maharaj Terminus",
    code: "CSMT",
    latitude: 18.9398,
    longitude: 72.8355,
    type: "major",
  },
  { id: "NDLS", name: "New Delhi", code: "NDLS", latitude: 28.6431, longitude: 77.2197, type: "major" },
  { id: "HWH", name: "Howrah Junction", code: "HWH", latitude: 22.5958, longitude: 88.2636, type: "major" },
  { id: "MAS", name: "Chennai Central", code: "MAS", latitude: 13.0878, longitude: 80.2785, type: "major" },
]

export function LiveTrainMap({
  trainId,
  initialCenter = { lat: 20.5937, lng: 78.9629 }, // Center of India
  zoom = 6,
  height = "400px",
  showControls = true,
  showStations = true,
  onTrainSelect,
  className = "",
}: LiveTrainMapProps) {
  const [trains, setTrains] = useState<TrainLocation[]>(mockTrains)
  const [selectedTrain, setSelectedTrain] = useState<TrainLocation | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapCenter, setMapCenter] = useState(initialCenter)
  const [mapZoom, setMapZoom] = useState(zoom)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const mapRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Filter trains if specific trainId is provided
  const displayTrains = trainId ? trains.filter((train) => train.id === trainId) : trains

  // Simulate real-time train movement
  useEffect(() => {
    const animateTrains = () => {
      setTrains((prevTrains) =>
        prevTrains.map((train) => ({
          ...train,
          latitude: train.latitude + (Math.random() - 0.5) * 0.001,
          longitude: train.longitude + (Math.random() - 0.5) * 0.001,
          speed: Math.max(0, train.speed + (Math.random() - 0.5) * 10),
          heading: (train.heading + (Math.random() - 0.5) * 20) % 360,
          lastUpdated: new Date().toISOString(),
        })),
      )
    }

    // Simulate loading
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Start animation
    const interval = setInterval(animateTrains, 3000)

    return () => {
      clearTimeout(loadingTimer)
      clearInterval(interval)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Handle train selection
  const handleTrainClick = useCallback(
    (train: TrainLocation) => {
      setSelectedTrain(train)
      setMapCenter({ lat: train.latitude, lng: train.longitude })
      setMapZoom(12)
      onTrainSelect?.(train)
    },
    [onTrainSelect],
  )

  // Reset map view
  const resetMapView = () => {
    setMapCenter(initialCenter)
    setMapZoom(zoom)
    setSelectedTrain(null)
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Get train status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "bg-railway-success"
      case "delayed":
        return "bg-railway-warning"
      case "stopped":
        return "bg-railway-danger"
      default:
        return "bg-railway-neutral"
    }
  }

  // Get station type color
  const getStationColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-railway-primary"
      case "junction":
        return "bg-railway-secondary"
      default:
        return "bg-railway-neutral"
    }
  }

  if (error) {
    return (
      <Alert variant="destructive" className="railway-alert">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={`railway-card ${isFullscreen ? "fixed inset-0 z-50" : ""} ${className}`}>
      <CardHeader className="railway-card-header">
        <div className="flex items-center justify-between">
          <CardTitle className="railway-title flex items-center gap-2">
            <MapPin className="h-5 w-5 text-railway-primary" />
            Live Train Tracking
            {trainId && (
              <Badge variant="outline" className="railway-badge">
                {trainId}
              </Badge>
            )}
          </CardTitle>

          {showControls && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetMapView} className="railway-button-secondary">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFullscreen} className="railway-button-secondary">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="railway-card-content p-0">
        <div
          ref={mapRef}
          className="relative bg-railway-map-bg overflow-hidden"
          style={{ height: isFullscreen ? "calc(100vh - 120px)" : height }}
        >
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" className="railway-map-pattern">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-railway-overlay">
              <div className="railway-loading">
                <div className="railway-spinner"></div>
                <p className="mt-4 text-railway-text-secondary">Loading train positions...</p>
              </div>
            </div>
          )}

          {/* Stations */}
          {showStations &&
            !isLoading &&
            mockStations.map((station) => (
              <div
                key={station.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 railway-station"
                style={{
                  left: `${((station.longitude + 180) / 360) * 100}%`,
                  top: `${((90 - station.latitude) / 180) * 100}%`,
                }}
              >
                <div
                  className={`w-3 h-3 rounded-full ${getStationColor(station.type)} border-2 border-white shadow-lg`}
                />
                <div className="railway-station-label">
                  <span className="railway-station-code">{station.code}</span>
                </div>
              </div>
            ))}

          {/* Trains */}
          {!isLoading &&
            displayTrains.map((train) => (
              <div
                key={train.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 railway-train-marker"
                style={{
                  left: `${((train.longitude + 180) / 360) * 100}%`,
                  top: `${((90 - train.latitude) / 180) * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${train.heading}deg)`,
                }}
                onClick={() => handleTrainClick(train)}
              >
                {/* Train Icon */}
                <div className={`railway-train-icon ${getStatusColor(train.status)}`}>
                  <div className="railway-train-dot"></div>
                  {train.speed > 0 && <div className="railway-train-trail"></div>}
                </div>

                {/* Speed Indicator */}
                {train.speed > 0 && <div className="railway-speed-indicator">{Math.round(train.speed)} km/h</div>}
              </div>
            ))}

          {/* Train Info Panel */}
          {selectedTrain && (
            <div className="absolute top-4 left-4 railway-train-info-panel">
              <div className="railway-train-info-header">
                <h3 className="railway-train-name">{selectedTrain.name}</h3>
                <Badge
                  variant={selectedTrain.status === "on-time" ? "default" : "destructive"}
                  className="railway-status-badge"
                >
                  {selectedTrain.status}
                </Badge>
              </div>

              <div className="railway-train-metrics">
                <div className="railway-metric">
                  <Zap className="h-4 w-4 text-railway-primary" />
                  <span>{Math.round(selectedTrain.speed)} km/h</span>
                </div>
                <div className="railway-metric">
                  <Clock className="h-4 w-4 text-railway-warning" />
                  <span>{selectedTrain.delay}m delay</span>
                </div>
                <div className="railway-metric">
                  <Users className="h-4 w-4 text-railway-info" />
                  <span>{selectedTrain.occupancy}% full</span>
                </div>
              </div>

              <div className="railway-coordinates">
                <span className="railway-coord-label">Position:</span>
                <span className="railway-coord-value">
                  {selectedTrain.latitude.toFixed(4)}, {selectedTrain.longitude.toFixed(4)}
                </span>
              </div>
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute bottom-4 right-4 railway-map-legend">
            <div className="railway-legend-item">
              <div className="w-3 h-3 rounded-full bg-railway-success"></div>
              <span>On Time</span>
            </div>
            <div className="railway-legend-item">
              <div className="w-3 h-3 rounded-full bg-railway-warning"></div>
              <span>Delayed</span>
            </div>
            <div className="railway-legend-item">
              <div className="w-3 h-3 rounded-full bg-railway-danger"></div>
              <span>Stopped</span>
            </div>
            {showStations && (
              <div className="railway-legend-item">
                <div className="w-3 h-3 rounded-full bg-railway-primary border-2 border-white"></div>
                <span>Stations</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
