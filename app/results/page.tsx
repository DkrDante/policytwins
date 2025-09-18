"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Heart,
  Clock,
  User,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import type { PolicySimulation } from "@/lib/database"

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [simulations, setSimulations] = useState<PolicySimulation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSimulation, setSelectedSimulation] = useState<PolicySimulation | null>(null)

  useEffect(() => {
    fetchSimulations()
  }, [])

  useEffect(() => {
    const simulationParam = searchParams.get("simulation")
    if (simulationParam && simulations.length > 0) {
      const simulationId = Number.parseInt(simulationParam)
      const simulation = simulations.find((s) => s.id === simulationId)
      if (simulation) {
        setSelectedSimulation(simulation)
      }
    }
  }, [searchParams, simulations])

  const fetchSimulations = async () => {
    try {
      const response = await fetch("/api/simulations")
      if (response.ok) {
        const data = await response.json()
        setSimulations(data)
        if (data.length > 0 && !selectedSimulation) {
          setSelectedSimulation(data[0])
        }
      }
    } catch (error) {
      console.error("Error fetching simulations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-lg">Loading results...</div>
      </div>
    )
  }

  const completedSimulations = simulations.filter((s) => s.status === "completed")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Simulation Results</h1>
            <p className="text-gray-600 dark:text-gray-300">
              View detailed analysis of how policies impact your avatars
            </p>
          </div>
          <Button asChild>
            <Link href="/chat">Run New Simulation</Link>
          </Button>
        </div>

        {completedSimulations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No simulation results yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Run your first policy simulation to see detailed impact analysis
              </p>
              <Button asChild>
                <Link href="/chat">Start Your First Simulation</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Simulation List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Simulations</CardTitle>
                  <CardDescription>{completedSimulations.length} completed simulations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {completedSimulations.map((simulation) => (
                    <div
                      key={simulation.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedSimulation?.id === simulation.id
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setSelectedSimulation(simulation)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{simulation.policy_name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          <User className="w-3 h-3 mr-1" />
                          {simulation.avatar_name}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                        {simulation.policy_description.substring(0, 80)}...
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(simulation.created_at).toLocaleDateString()}</span>
                        {simulation.results?.financial_impact && (
                          <span
                            className={
                              simulation.results.financial_impact.monthly_change >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {simulation.results.financial_impact.monthly_change >= 0 ? "+" : ""}$
                            {simulation.results.financial_impact.monthly_change}/mo
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results */}
            <div className="lg:col-span-2">
              {selectedSimulation && selectedSimulation.results ? (
                <SimulationResults simulation={selectedSimulation} />
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <CardContent className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300">Select a simulation to view detailed results</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Running Simulations */}
        {simulations.some((s) => s.status === "running" || s.status === "pending") && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Running Simulations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {simulations
                  .filter((s) => s.status === "running" || s.status === "pending")
                  .map((simulation) => (
                    <div
                      key={simulation.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{simulation.policy_name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Avatar: {simulation.avatar_name}</p>
                      </div>
                      <Badge variant="outline">{simulation.status === "running" ? "Running..." : "Pending"}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function SimulationResults({ simulation }: { simulation: PolicySimulation }) {
  const results = simulation.results

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{simulation.policy_name}</CardTitle>
              <CardDescription className="mt-1">Impact analysis for {simulation.avatar_name}</CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-300">{simulation.policy_description}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="quality">Quality of Life</TabsTrigger>
          <TabsTrigger value="longterm">Long-term</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Monthly Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {results.financial_impact.monthly_change >= 0 ? "+" : ""}$
                  {results.financial_impact.monthly_change.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {results.financial_impact.percentage_change >= 0 ? "+" : ""}
                  {results.financial_impact.percentage_change}% of income
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  Quality of Life
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {results.quality_of_life.score_change > 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : results.quality_of_life.score_change < 0 ? (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                  <span className="text-2xl font-bold">
                    {results.quality_of_life.score_change > 0 ? "+" : ""}
                    {results.quality_of_life.score_change}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {results.quality_of_life.affected_areas.length} areas affected
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  5-Year Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {results.long_term_effects.five_year_projection >= 0 ? "+" : ""}$
                  {results.long_term_effects.five_year_projection.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Cumulative impact</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Impact Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Monthly Change</h4>
                  <div className="text-3xl font-bold">
                    {results.financial_impact.monthly_change >= 0 ? "+" : ""}$
                    {results.financial_impact.monthly_change.toLocaleString()}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Annual Change</h4>
                  <div className="text-3xl font-bold">
                    {results.financial_impact.annual_change >= 0 ? "+" : ""}$
                    {results.financial_impact.annual_change.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Percentage of Income</h4>
                <div className="flex items-center gap-2">
                  <Progress
                    value={Math.min(Math.abs(results.financial_impact.percentage_change), 100)}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">
                    {results.financial_impact.percentage_change >= 0 ? "+" : ""}
                    {results.financial_impact.percentage_change}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.detailed_breakdown.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <h5 className="font-medium">{item.category}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.impact}</p>
                    </div>
                    {item.amount && (
                      <div className="text-right">
                        <div className="font-medium">${item.amount.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality of Life Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Overall Score Change</h4>
                  <div className="flex items-center gap-2">
                    {results.quality_of_life.score_change > 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    ) : results.quality_of_life.score_change < 0 ? (
                      <TrendingDown className="w-6 h-6 text-red-600" />
                    ) : (
                      <div className="w-6 h-6" />
                    )}
                    <span className="text-3xl font-bold">
                      {results.quality_of_life.score_change > 0 ? "+" : ""}
                      {results.quality_of_life.score_change}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Affected Areas</h4>
                  {results.quality_of_life.affected_areas.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {results.quality_of_life.affected_areas.map((area: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">No significant quality of life changes</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="longterm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Long-term Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">5-Year Financial Projection</h4>
                <div className="text-3xl font-bold">
                  {results.long_term_effects.five_year_projection >= 0 ? "+" : ""}$
                  {results.long_term_effects.five_year_projection.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Cumulative financial impact over 5 years</p>
              </div>

              {results.long_term_effects.retirement_impact && (
                <div>
                  <h4 className="font-medium mb-2">Retirement Impact</h4>
                  <div className="text-2xl font-bold">
                    {results.long_term_effects.retirement_impact >= 0 ? "+" : ""}$
                    {results.long_term_effects.retirement_impact.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Estimated impact on retirement savings</p>
                </div>
              )}

              {results.long_term_effects.education_opportunities && (
                <div>
                  <h4 className="font-medium mb-2">Education Opportunities</h4>
                  <ul className="space-y-1">
                    {results.long_term_effects.education_opportunities.map((opportunity: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
