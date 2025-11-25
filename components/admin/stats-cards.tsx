"use client"

import { Card } from "@/components/ui/card"
import { Users, CheckCircle, XCircle, Clock, User, UserCheck, Baby } from "lucide-react"

interface StatsCardsProps {
  total: number
  accepted: number
  rejected: number
  pending: number
  acceptedMales?: number
  acceptedFemales?: number
  acceptedKids?: number
}

export function StatsCards({ 
  total, 
  accepted, 
  rejected, 
  pending,
  acceptedMales = 0,
  acceptedFemales = 0,
  acceptedKids = 0
}: StatsCardsProps) {
  const mainStats = [
    {
      title: "Total Applicants",
      value: total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Accepted",
      value: accepted,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ]

  const acceptedStats = [
    {
      title: "Total Males",
      value: acceptedMales,
      icon: User,
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Females",
      value: acceptedFemales,
      icon: UserCheck,
      color: "text-pink-700",
      bgColor: "bg-pink-100",
    },
    {
      title: "Total Kids",
      value: acceptedKids,
      icon: Baby,
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
    },
  ]

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`${stat.color} w-6 h-6`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {acceptedStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`${stat.color} w-6 h-6`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}



