"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const employmentOptions = [
  "Full-time employed",
  "Part-time employed",
  "Self-employed",
  "Unemployed",
  "Student",
  "Retired",
  "Disabled/Unable to work",
]

const healthOptions = ["Excellent", "Very good", "Good", "Fair", "Poor"]

const educationOptions = [
  "Less than high school",
  "High school diploma",
  "Some college",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree",
  "Doctoral degree",
]

export default function CreateAvatarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    income: "",
    location: "",
    family_size: "",
    employment_status: "",
    health_status: "",
    education_level: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/avatars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/avatars")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to create avatar")
      }
    } catch (err) {
      setError("Failed to create avatar. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="sm">
              <Link href="/avatars" className="flex items-center gap-2">
                <span>←</span>
                Back to Avatars
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Avatar</h1>
              <p className="text-gray-600 dark:text-gray-300">Build a digital persona for policy simulation</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Avatar Details</CardTitle>
              <CardDescription>Provide demographic and personal information for your avatar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter avatar name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="0"
                      max="120"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Enter age"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="income">Annual Income ($) *</Label>
                    <Input
                      id="income"
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.income}
                      onChange={(e) => handleInputChange("income", e.target.value)}
                      placeholder="Enter annual income"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="City, State"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="family_size">Family Size *</Label>
                  <Input
                    id="family_size"
                    type="number"
                    min="1"
                    value={formData.family_size}
                    onChange={(e) => handleInputChange("family_size", e.target.value)}
                    placeholder="Number of people in household"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Employment Status *</Label>
                  <Select
                    value={formData.employment_status}
                    onValueChange={(value) => handleInputChange("employment_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Health Status *</Label>
                  <Select
                    value={formData.health_status}
                    onValueChange={(value) => handleInputChange("health_status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select health status" />
                    </SelectTrigger>
                    <SelectContent>
                      {healthOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Education Level *</Label>
                  <Select
                    value={formData.education_level}
                    onValueChange={(value) => handleInputChange("education_level", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {educationOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Creating Avatar..." : "Create Avatar"}
                  </Button>
                  <Button asChild variant="outline" type="button">
                    <Link href="/avatars">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
