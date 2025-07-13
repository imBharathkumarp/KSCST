import { NextResponse } from "next/server"
import type { TrainStatus } from "@/lib/api-client"

// Server-side API endpoint with secure authentication
export async function GET() {
  try {
    // In production, you would:
    // 1. Verify authentication (check session, JWT, etc.)
    // 2. Use server-side API keys to fetch from external services
    // 3. Apply rate limiting and caching

    // Example of server-side API call with sensitive credentials:
    // const response = await fetch('https://railway-api.com/trains', {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RAILWAY_API_KEY}`,
    //     'X-API-Key': process.env.RAILWAY_API_SECRET
    //   }
    // })

    // For demo purposes, return mock data with realistic variations
    const trains: TrainStatus[] = generateRealisticTrainData()

    return NextResponse.json({
      trains,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching train data:", error)
    return NextResponse.json({ error: "Failed to fetch train data" }, { status: 500 })
  }
}

function generateRealisticTrainData(): TrainStatus[] {
  const baseTime = Date.now()

  return [
    {
      id: "1",
      name: "Express 2024",
      currentStation: "Mumbai Central",
      speed: 85 + (Math.random() * 10 - 5), // Add some variation
      occupancy: 67 + (Math.random() * 6 - 3),
      temperature: 24 + (Math.random() * 2 - 1),
      humidity: 45 + (Math.random() * 4 - 2),
      nextStation: "Surat",
      estimatedArrival: "10:45 AM",
      delay: 0,
      status: "on-time",
      lastUpdated: new Date(baseTime).toISOString(),
    },
    {
      id: "2",
      name: "Rajdhani Express",
      currentStation: "New Delhi",
      speed: 92 + (Math.random() * 8 - 4),
      occupancy: 89 + (Math.random() * 4 - 2),
      temperature: 22 + (Math.random() * 2 - 1),
      humidity: 52 + (Math.random() * 4 - 2),
      nextStation: "Kanpur",
      estimatedArrival: "02:30 PM",
      delay: 15 + (Math.random() * 4 - 2),
      status: "delayed",
      lastUpdated: new Date(baseTime - 1000).toISOString(),
    },
    {
      id: "3",
      name: "Shatabdi Express",
      currentStation: "Chennai Central",
      speed: Math.max(0, Math.random() * 20), // Sometimes stopped, sometimes moving
      occupancy: 45 + (Math.random() * 6 - 3),
      temperature: 26 + (Math.random() * 2 - 1),
      humidity: 60 + (Math.random() * 4 - 2),
      nextStation: "Bangalore",
      estimatedArrival: "11:30 AM",
      delay: 30 + (Math.random() * 6 - 3),
      status: Math.random() > 0.5 ? "stopped" : "delayed",
      lastUpdated: new Date(baseTime - 2000).toISOString(),
    },
  ]
}
