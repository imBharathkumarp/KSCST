"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Train,
  MapPin,
  Clock,
  Users,
  CreditCard,
  Calendar,
  Navigation,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  Info,
  Phone,
} from "lucide-react"

interface Passenger {
  number: number
  name?: string
  age?: number
  gender?: string
  currentStatus: string
  bookingStatus: string
  coach?: string
  berth?: string | number
  seatNumber?: string
}

interface PNRData {
  pnr: string
  trainNumber: string
  trainName: string
  dateOfJourney: string
  from: string
  to: string
  fromStation?: string
  toStation?: string
  reservationUpto: string
  boardingPoint: string
  class: string
  quota?: string
  passengers: Passenger[]
  chartPrepared: boolean
  distance?: number
  duration?: string
  fare?: number
  bookingDate?: string
  timestamp: string
  cached?: boolean
  responseTime?: number
}

interface PNRStatusCardProps {
  initialPNR?: string
  onPNRChange?: (pnr: string, data: PNRData | null) => void
  showSearch?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
  className?: string
}

export function PNRStatusCard({
  initialPNR = "",
  onPNRChange,
  showSearch = true,
  autoRefresh = false,
  refreshInterval = 300000, // 5 minutes
  className = "",
}: PNRStatusCardProps) {
  const [pnr, setPnr] = useState(initialPNR)
  const [pnrData, setPnrData] = useState<PNRData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && pnrData && !isLoading) {
      const interval = setInterval(() => {
        fetchPNRStatus(pnr, true)
      }, refreshInterval)

      return () => clearInterval(interval)
    }
  }, [autoRefresh, pnrData, isLoading, refreshInterval, pnr])

  // Fetch PNR status
  const fetchPNRStatus = async (pnrNumber: string, isRefresh = false) => {
    if (!pnrNumber || pnrNumber.length !== 10) {
      setError("Please enter a valid 10-digit PNR number")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // In production, this would call your PNR service
      // const response = await fetch(`/api/pnr/${pnrNumber}`)

      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockData: PNRData = {
        pnr: pnrNumber,
        trainNumber: "12951",
        trainName: "Mumbai Rajdhani Express",
        dateOfJourney: "2024-01-15",
        from: "NDLS",
        to: "BCT",
        fromStation: "New Delhi",
        toStation: "Mumbai Central",
        reservationUpto: "BCT",
        boardingPoint: "NDLS",
        class: "3A",
        quota: "GN",
        passengers: [
          {
            number: 1,
            name: "John Doe",
            age: 35,
            gender: "M",
            currentStatus: "CNF",
            bookingStatus: "CNF",
            coach: "B1",
            berth: "25",
            seatNumber: "25/LB",
          },
          {
            number: 2,
            name: "Jane Doe",
            age: 32,
            gender: "F",
            currentStatus: "CNF",
            bookingStatus: "CNF",
            coach: "B1",
            berth: "26",
            seatNumber: "26/UB",
          },
        ],
        chartPrepared: true,
        distance: 1384,
        duration: "15h 50m",
        fare: 2840,
        bookingDate: "2024-01-10",
        timestamp: new Date().toISOString(),
        cached: isRefresh ? false : Math.random() > 0.5,
        responseTime: Math.floor(Math.random() * 1000) + 500,
      }

      setPnrData(mockData)
      setLastUpdated(new Date())
      onPNRChange?.(pnrNumber, mockData)
    } catch (err) {
      setError("Failed to fetch PNR status. Please try again.")
      setPnrData(null)
      onPNRChange?.(pnrNumber, null)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPNRStatus(pnr)
  }

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case "CNF":
        return { color: "railway-success", icon: CheckCircle, label: "Confirmed" }
      case "RAC":
        return { color: "railway-warning", icon: Clock, label: "RAC" }
      case "WL":
      case "RLWL":
      case "PQWL":
        return { color: "railway-danger", icon: AlertTriangle, label: "Waitlisted" }
      default:
        return { color: "railway-neutral", icon: Info, label: status }
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className={`railway-card ${className}`}>
      <CardHeader className="railway-card-header">
        <div className="flex items-center justify-between">
          <CardTitle className="railway-title flex items-center gap-2">
            <Train className="h-5 w-5 text-railway-primary" />
            PNR Status
            {pnrData && (
              <Badge variant="outline" className="railway-badge">
                {pnrData.pnr}
              </Badge>
            )}
          </CardTitle>

          {pnrData && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchPNRStatus(pnr, true)}
              disabled={isLoading}
              className="railway-button-secondary"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          )}
        </div>

        {showSearch && (
          <CardDescription className="railway-description">
            Enter your 10-digit PNR number to check booking status
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="railway-card-content">
        {/* Search Form */}
        {showSearch && (
          <form onSubmit={handleSearch} className="railway-search-form">
            <div className="railway-form-group">
              <Label htmlFor="pnr-input" className="railway-label">
                PNR Number
              </Label>
              <div className="flex gap-2">
                <Input
                  id="pnr-input"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Enter 10-digit PNR"
                  className="railway-input"
                  maxLength={10}
                />
                <Button type="submit" disabled={isLoading || pnr.length !== 10} className="railway-button-primary">
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="railway-alert">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="railway-loading-content">
            <Skeleton className="railway-skeleton h-4 w-3/4 mb-4" />
            <Skeleton className="railway-skeleton h-20 w-full mb-4" />
            <Skeleton className="railway-skeleton h-32 w-full" />
          </div>
        )}

        {/* PNR Data Display */}
        {pnrData && !isLoading && (
          <div className="railway-pnr-content">
            {/* Train Information */}
            <div className="railway-train-info">
              <div className="railway-train-header">
                <h3 className="railway-train-title">
                  {pnrData.trainNumber} - {pnrData.trainName}
                </h3>
                <Badge variant={pnrData.chartPrepared ? "default" : "secondary"} className="railway-chart-badge">
                  {pnrData.chartPrepared ? "Chart Prepared" : "Chart Not Prepared"}
                </Badge>
              </div>

              <div className="railway-journey-info">
                <div className="railway-route">
                  <div className="railway-station">
                    <MapPin className="h-4 w-4 text-railway-primary" />
                    <div>
                      <div className="railway-station-code">{pnrData.from}</div>
                      <div className="railway-station-name">{pnrData.fromStation}</div>
                    </div>
                  </div>

                  <div className="railway-route-line">
                    <Navigation className="h-4 w-4 text-railway-neutral" />
                    {pnrData.distance && <span className="railway-distance">{pnrData.distance} km</span>}
                  </div>

                  <div className="railway-station">
                    <MapPin className="h-4 w-4 text-railway-secondary" />
                    <div>
                      <div className="railway-station-code">{pnrData.to}</div>
                      <div className="railway-station-name">{pnrData.toStation}</div>
                    </div>
                  </div>
                </div>

                <div className="railway-journey-details">
                  <div className="railway-detail-item">
                    <Calendar className="h-4 w-4 text-railway-info" />
                    <span>{formatDate(pnrData.dateOfJourney)}</span>
                  </div>
                  <div className="railway-detail-item">
                    <Clock className="h-4 w-4 text-railway-info" />
                    <span>Class: {pnrData.class}</span>
                  </div>
                  {pnrData.duration && (
                    <div className="railway-detail-item">
                      <Train className="h-4 w-4 text-railway-info" />
                      <span>{pnrData.duration}</span>
                    </div>
                  )}
                  {pnrData.fare && (
                    <div className="railway-detail-item">
                      <CreditCard className="h-4 w-4 text-railway-info" />
                      <span>₹{pnrData.fare}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Passenger Information */}
            <div className="railway-passengers-section">
              <h4 className="railway-section-title">
                <Users className="h-4 w-4" />
                Passenger Details ({pnrData.passengers.length})
              </h4>

              <div className="railway-passengers-list">
                {pnrData.passengers.map((passenger) => {
                  const statusInfo = getStatusInfo(passenger.currentStatus)
                  const StatusIcon = statusInfo.icon

                  return (
                    <div key={passenger.number} className="railway-passenger-card">
                      <div className="railway-passenger-header">
                        <div className="railway-passenger-info">
                          <span className="railway-passenger-number">#{passenger.number}</span>
                          {passenger.name && <span className="railway-passenger-name">{passenger.name}</span>}
                          {passenger.age && passenger.gender && (
                            <span className="railway-passenger-details">
                              {passenger.age}Y, {passenger.gender}
                            </span>
                          )}
                        </div>

                        <Badge
                          variant={statusInfo.color === "railway-success" ? "default" : "destructive"}
                          className="railway-status-badge"
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>

                      {passenger.coach && passenger.seatNumber && (
                        <div className="railway-seat-info">
                          <div className="railway-seat-detail">
                            <span className="railway-seat-label">Coach:</span>
                            <span className="railway-seat-value">{passenger.coach}</span>
                          </div>
                          <div className="railway-seat-detail">
                            <span className="railway-seat-label">Seat:</span>
                            <span className="railway-seat-value">{passenger.seatNumber}</span>
                          </div>
                        </div>
                      )}

                      {passenger.bookingStatus !== passenger.currentStatus && (
                        <div className="railway-status-change">
                          <span className="railway-status-label">Booking Status:</span>
                          <span className="railway-status-value">{passenger.bookingStatus}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Additional Information */}
            <div className="railway-additional-info">
              <div className="railway-info-grid">
                <div className="railway-info-item">
                  <span className="railway-info-label">Boarding Point:</span>
                  <span className="railway-info-value">{pnrData.boardingPoint}</span>
                </div>
                <div className="railway-info-item">
                  <span className="railway-info-label">Reservation Upto:</span>
                  <span className="railway-info-value">{pnrData.reservationUpto}</span>
                </div>
                {pnrData.quota && (
                  <div className="railway-info-item">
                    <span className="railway-info-label">Quota:</span>
                    <span className="railway-info-value">{pnrData.quota}</span>
                  </div>
                )}
                {pnrData.bookingDate && (
                  <div className="railway-info-item">
                    <span className="railway-info-label">Booked On:</span>
                    <span className="railway-info-value">{formatDate(pnrData.bookingDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Information */}
            <div className="railway-footer-info">
              <div className="railway-update-info">
                <span className="railway-update-label">Last Updated:</span>
                <span className="railway-update-time">
                  {lastUpdated ? formatTime(lastUpdated.toISOString()) : "Unknown"}
                </span>
                {pnrData.cached && (
                  <Badge variant="outline" className="railway-cache-badge">
                    Cached
                  </Badge>
                )}
              </div>

              {pnrData.responseTime && <div className="railway-response-time">Response: {pnrData.responseTime}ms</div>}
            </div>

            {/* Emergency Contact */}
            <div className="railway-emergency-contact">
              <Button variant="outline" size="sm" className="railway-button-emergency">
                <Phone className="h-4 w-4 mr-2" />
                Railway Helpline: 139
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
