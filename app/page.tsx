import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 text-balance">PolicyTwin</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto text-pretty">
            Create digital avatars and simulate how government policies would impact real people's lives. Understand
            policy effects through personalized, data-driven simulations.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/avatars">Create Avatar</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/chat">Start Simulation</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="text-4xl mb-4">👥</div>
              <CardTitle>Create Avatars</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Build detailed digital personas with demographics, income, and life circumstances
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="text-4xl mb-4">💬</div>
              <CardTitle>AI Chat Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Discuss policies naturally with our AI assistant and get personalized insights
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="text-4xl mb-4">📊</div>
              <CardTitle>Policy Simulation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Run detailed simulations to see how policies affect your avatar's life</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="text-4xl mb-4">📈</div>
              <CardTitle>Simulation History</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Track and compare results from multiple policy simulations over time</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">How PolicyTwin Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold">Create Your Avatar</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Define demographics, income, family size, and other key characteristics
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="text-xl font-semibold">Discuss Policies</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chat with our AI about specific policies you want to understand
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-semibold">See the Impact</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get detailed results showing how policies would affect your avatar's life
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
