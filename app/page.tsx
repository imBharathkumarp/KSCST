"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Train, Users, Shield, BarChart3, Settings } from "lucide-react"
import { BookingSection } from "@/components/booking-section"
import { StatusSection } from "@/components/status-section"
import { SafetySection } from "@/components/safety-section"
import { AnalyticsSection } from "@/components/analytics-section"
import { AdminSection } from "@/components/admin-section"
import { NotificationCenter } from "@/components/notification-center"
import { SystemHealth } from "@/components/system-health"

export default function RailwaySystem() {
  const [activeTab, setActiveTab] = useState("booking")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with System Health */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Train className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Railway System</h1>
                <p className="text-sm text-gray-600">AI-Powered Safety & Smart Ticketing Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <SystemHealth />
              <NotificationCenter />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 h-12">
            <TabsTrigger value="booking" className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Smart Ticketing
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2 text-sm">
              <Train className="h-4 w-4" />
              Live Status
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4" />
              Safety Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Admin Panel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="booking">
            <BookingSection />
          </TabsContent>

          <TabsContent value="status">
            <StatusSection />
          </TabsContent>

          <TabsContent value="safety">
            <SafetySection />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsSection />
          </TabsContent>

          <TabsContent value="admin">
            <AdminSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
