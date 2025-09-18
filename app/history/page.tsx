"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  History,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  User,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Eye,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import type { PolicySimulation } from "@/lib/database"

export default function HistoryPage() {
  const router = useRouter()
  const [simulations, setSimulations] = useState<PolicySimulation[]>([])
  const [filteredSimulations, setFilteredSimulations] = useState<PolicySimulation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")

  useEffect(() => {
    fetchSimulations()
  }, [])

  useEffect(() => {
    filterAndSortSimulations()
  }, [simulations, searchTerm, statusFilter, sortBy])

  const fetchSimulations = async () => {
    try {
      const response = await fetch("/api/simulations")
      if (response.ok) {
        const data = await response.json()
        setSimulations(data)
      }
    } catch (error) {
      console.error("Error fetching simulations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortSimulations = () => {
    let filtered = simulations

    if (searchTerm) {
      filtered = filtered.filter(
        (sim) =>
          sim.policy_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sim.policy_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sim.avatar_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((sim) => sim.status === statusFilter)
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "name":
          return a.policy_name.localeCompare(b.policy_name)
        case "avatar":
          return (a.avatar_name || "").localeCompare(b.avatar_name || "")
        case "impact":
          const aImpact = a.results?.financial_impact?.monthly_change || 0
          const bImpact = b.results?.financial_impact?.monthly_change || 0
          return bImpact - aImpact
        default:
          return 0
      }
    })

    setFilteredSimulations(filtered)
  }

  const handleDeleteSimulation = async (id: number) => {
    if (!confirm("Are you sure you want to delete this simulation?")) return

    try {
      const response = await fetch(`/api/simulations/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setSimulations(simulations.filter((sim) => sim.id !== id))
      }
    } catch (error) {
      console.error("Error deleting simulation:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "running":
        return <Badge variant="secondary">Running</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getImpactIndicator = (monthlyChange: number) => {
    if (monthlyChange > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />
    } else if (monthlyChange < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />
    }
    return <div className="w-4 h-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-lg">Loading simulation history...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Simulation History</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track and compare your policy simulation results over time
            </p>
          </div>
          <Button asChild>
            <Link href="/chat">Run New Simulation</Link>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Total Simulations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{simulations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{simulations.filter((s) => s.status === "completed").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Unique Avatars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(simulations.map((s) => s.avatar_id)).size}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                Avg. Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {Math.round(
                  simulations
                    .filter((s) => s.results?.financial_impact?.monthly_change)
                    .reduce((sum, s) => sum + (s.results?.financial_impact?.monthly_change || 0), 0) /
                    Math.max(simulations.filter((s) => s.results?.financial_impact?.monthly_change).length, 1),
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">per month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search simulations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Policy Name</SelectItem>
                  <SelectItem value="avatar">Avatar</SelectItem>
                  <SelectItem value="impact">Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Simulations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>
              {filteredSimulations.length} of {simulations.length} simulations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredSimulations.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No simulations found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {simulations.length === 0
                    ? "You haven't run any simulations yet."
                    : "No simulations match your current filters."}
                </p>
                {simulations.length === 0 && (
                  <Button asChild>
                    <Link href="/chat">Run Your First Simulation</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Policy</TableHead>
                      <TableHead>Avatar</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Monthly Impact</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSimulations.map((simulation) => (
                      <TableRow key={simulation.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{simulation.policy_name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {simulation.policy_description.substring(0, 60)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            <User className="w-3 h-3" />
                            {simulation.avatar_name}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(simulation.status)}</TableCell>
                        <TableCell>
                          {simulation.results?.financial_impact ? (
                            <div className="flex items-center gap-2">
                              {getImpactIndicator(simulation.results.financial_impact.monthly_change)}
                              <span
                                className={
                                  simulation.results.financial_impact.monthly_change >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {simulation.results.financial_impact.monthly_change >= 0 ? "+" : ""}$
                                {simulation.results.financial_impact.monthly_change.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="w-3 h-3" />
                            {new Date(simulation.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/results?simulation=${simulation.id}`} className="flex items-center gap-2">
                                  <Eye className="w-4 h-4" />
                                  View Results
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteSimulation(simulation.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
