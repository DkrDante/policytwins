"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import type { Avatar } from "@/lib/database"

export default function AvatarsPage() {
  const router = useRouter()
  const [avatars, setAvatars] = useState<Avatar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAvatars()
  }, [])

  const fetchAvatars = async () => {
    try {
      const response = await fetch("/api/avatars")
      if (response.ok) {
        const data = await response.json()
        setAvatars(data)
      }
    } catch (error) {
      console.error("Error fetching avatars:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAvatar = async (id: number) => {
    if (!confirm("Are you sure you want to delete this avatar?")) return

    try {
      const response = await fetch(`/api/avatars/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setAvatars(avatars.filter((avatar) => avatar.id !== id))
      }
    } catch (error) {
      console.error("Error deleting avatar:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-lg">Loading avatars...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Avatars</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage digital personas for policy simulations
            </p>
          </div>
          <Button asChild>
            <Link href="/avatars/create" className="flex items-center gap-2">
              + Create Avatar
            </Link>
          </Button>
        </div>

        {avatars.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-xl font-semibold mb-2">No avatars yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Create your first avatar to start simulating policy impacts
              </p>
              <Button asChild>
                <Link href="/avatars/create">Create Your First Avatar</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {avatars.map((avatar) => (
              <Card key={avatar.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">👤 {avatar.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/avatars/${avatar.id}/edit`}>✏️</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAvatar(avatar.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Age {avatar.age} • {avatar.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    💰 <span>${avatar.income.toLocaleString()}/year</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    👥 <span>Family of {avatar.family_size}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    💼 <span>{avatar.employment_status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    ❤️ <span>{avatar.health_status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    🎓 <span>{avatar.education_level}</span>
                  </div>
                  <div className="pt-3">
                    <Button asChild className="w-full bg-transparent" variant="outline">
                      <Link href={`/chat?avatar=${avatar.id}`}>Start Simulation</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
