// API client for real-time train data with secure authentication

import { create } from "zustand"

export interface TrainStatus {
  id: string
  name: string
  currentStation: string
  speed: number
  occupancy: number
  temperature: number
  humidity: number
  nextStation: string
  estimatedArrival: string
  delay: number
  status: "on-time" | "delayed" | "stopped"
  lastUpdated: string
}

interface TrainDataState {
  trains: TrainStatus[]
  isConnected: boolean
  connectionType: "websocket" | "polling" | "offline"
  lastUpdate: Date | null
  error: string | null
  connect: () => void
  disconnect: () => void
  setTrains: (trains: TrainStatus[]) => void
}

// Store for managing train data state
export const useTrainDataStore = create<TrainDataState>((set, get) => ({
  trains: [],
  isConnected: false,
  connectionType: "offline",
  lastUpdate: null,
  error: null,
  connect: () => {
    initializeConnection()
  },
  disconnect: () => {
    cleanup()
    set({ isConnected: false, connectionType: "offline" })
  },
  setTrains: (trains: TrainStatus[]) => {
    set({ trains, lastUpdate: new Date() })
  },
}))

// Connection management
let socket: WebSocket | null = null
let pollingInterval: NodeJS.Timeout | null = null
let reconnectTimeout: NodeJS.Timeout | null = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 3
const RECONNECT_DELAY = 3000
const POLLING_INTERVAL = 5000

function cleanup() {
  if (socket) {
    socket.close()
    socket = null
  }
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
}

async function initializeConnection() {
  // First, try to load initial data
  await loadInitialData()

  // Then attempt real-time connection
  const wsEndpoint = process.env.NEXT_PUBLIC_TRAIN_WS_ENDPOINT

  if (wsEndpoint && wsEndpoint !== "wss://api.railway-safety.com/trains/live") {
    // Only try WebSocket if we have a real endpoint
    tryWebSocketConnection(wsEndpoint)
  } else {
    // Fall back to polling immediately
    console.log("No WebSocket endpoint configured, using polling")
    startPolling()
  }
}

async function loadInitialData() {
  try {
    const trains = await fetchTrainData()
    useTrainDataStore.getState().setTrains(trains)
  } catch (error) {
    console.error("Failed to load initial data:", error)
    // Use mock data as fallback
    const mockTrains = getMockTrainData()
    useTrainDataStore.getState().setTrains(mockTrains)
  }
}

async function tryWebSocketConnection(wsEndpoint: string) {
  try {
    // Get WebSocket token from server
    const tokenResponse = await fetch("/api/auth/ws-token", {
      method: "POST",
      credentials: "include",
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to get WebSocket token")
    }

    const { token } = await tokenResponse.json()

    socket = new WebSocket(wsEndpoint)

    socket.onopen = () => {
      console.log("WebSocket connection established")
      reconnectAttempts = 0
      useTrainDataStore.setState({
        isConnected: true,
        connectionType: "websocket",
        error: null,
      })

      // Subscribe to train status updates with server-provided token
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "subscribe",
            channel: "train_status",
            auth_token: token,
          }),
        )
      }
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "train_update") {
          useTrainDataStore.getState().setTrains(data.trains)
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err)
      }
    }

    socket.onerror = (error) => {
      console.error("WebSocket connection failed:", error)
      // Don't set error state immediately, let onclose handle it
    }

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason)
      useTrainDataStore.setState({
        isConnected: false,
        connectionType: "offline",
      })

      // If connection failed or closed unexpectedly, fall back to polling
      if (event.code !== 1000) {
        handleConnectionFailure()
      }
    }

    // Set a timeout for WebSocket connection
    setTimeout(() => {
      if (socket && socket.readyState === WebSocket.CONNECTING) {
        console.log("WebSocket connection timeout, falling back to polling")
        socket.close()
        handleConnectionFailure()
      }
    }, 5000)
  } catch (err) {
    console.error("Failed to create WebSocket connection:", err)
    handleConnectionFailure()
  }
}

function handleConnectionFailure() {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++
    useTrainDataStore.setState({
      error: `WebSocket failed, retrying (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`,
    })

    reconnectTimeout = setTimeout(() => {
      const wsEndpoint = process.env.NEXT_PUBLIC_TRAIN_WS_ENDPOINT
      if (wsEndpoint) {
        tryWebSocketConnection(wsEndpoint)
      }
    }, RECONNECT_DELAY * reconnectAttempts)
  } else {
    console.log("WebSocket failed after multiple attempts, falling back to polling")
    useTrainDataStore.setState({
      error: null, // Clear error since we're falling back gracefully
    })
    startPolling()
  }
}

function startPolling() {
  // Clear any existing polling
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }

  useTrainDataStore.setState({
    isConnected: true,
    connectionType: "polling",
    error: null,
  })

  // Poll for updates every 5 seconds
  pollingInterval = setInterval(async () => {
    try {
      const trains = await fetchTrainData()
      useTrainDataStore.getState().setTrains(trains)
    } catch (error) {
      console.error("Polling failed:", error)
      // Continue with existing data, don't disconnect
    }
  }, POLLING_INTERVAL)
}

// REST API for fetching train data (no sensitive tokens in client)
export async function fetchTrainData(): Promise<TrainStatus[]> {
  try {
    const response = await fetch("/api/trains", {
      method: "GET",
      credentials: "include", // Include cookies for authentication
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.trains
  } catch (error) {
    console.error("Error fetching train data:", error)
    throw error
  }
}

// Mock data generator for fallback
function getMockTrainData(): TrainStatus[] {
  return [
    {
      id: "1",
      name: "Express 2024",
      currentStation: "Mumbai Central",
      speed: 85,
      occupancy: 67,
      temperature: 24,
      humidity: 45,
      nextStation: "Surat",
      estimatedArrival: "10:45 AM",
      delay: 0,
      status: "on-time",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Rajdhani Express",
      currentStation: "New Delhi",
      speed: 92,
      occupancy: 89,
      temperature: 22,
      humidity: 52,
      nextStation: "Kanpur",
      estimatedArrival: "02:30 PM",
      delay: 15,
      status: "delayed",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Shatabdi Express",
      currentStation: "Chennai Central",
      speed: 0,
      occupancy: 45,
      temperature: 26,
      humidity: 60,
      nextStation: "Bangalore",
      estimatedArrival: "11:30 AM",
      delay: 30,
      status: "stopped",
      lastUpdated: new Date().toISOString(),
    },
  ]
}

// Simulate real-time updates for demo purposes
export function startMockUpdates() {
  setInterval(() => {
    const currentTrains = useTrainDataStore.getState().trains
    if (currentTrains.length > 0) {
      const updatedTrains = currentTrains.map((train) => ({
        ...train,
        speed: Math.max(0, train.speed + (Math.random() * 10 - 5)),
        occupancy: Math.min(100, Math.max(0, train.occupancy + (Math.random() * 6 - 3))),
        temperature: train.temperature + (Math.random() * 2 - 1),
        humidity: Math.min(100, Math.max(0, train.humidity + (Math.random() * 4 - 2))),
        lastUpdated: new Date().toISOString(),
      }))
      useTrainDataStore.getState().setTrains(updatedTrains)
    }
  }, 3000)
}
