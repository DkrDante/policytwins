import { type NextRequest, NextResponse } from "next/server"
import { createPolicySimulation, updateSimulationResults, getUserSimulations, getAvatar } from "@/lib/database"
import { PolicySimulationEngine } from "@/lib/simulation-engine"

export async function GET(request: NextRequest) {
  try {
    const userId = "demo-user"

    const simulations = await getUserSimulations(userId)
    return NextResponse.json(simulations)
  } catch (error) {
    console.error("Error fetching simulations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = "demo-user"

    const body = await request.json()
    const { avatar_id, policy_name, policy_description, policy_parameters } = body

    // Validation
    if (!avatar_id || !policy_name || !policy_description || !policy_parameters) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify avatar belongs to user
    const avatar = await getAvatar(avatar_id, userId)
    if (!avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 })
    }

    // Create simulation record
    const simulation = await createPolicySimulation(
      userId,
      avatar_id,
      policy_name,
      policy_description,
      policy_parameters,
    )

    // Run simulation in background
    try {
      await updateSimulationResults(simulation.id, null, "running")

      const results = await PolicySimulationEngine.simulate(avatar, {
        type: policy_parameters.type || "tax",
        name: policy_name,
        description: policy_description,
        parameters: policy_parameters,
      })

      await updateSimulationResults(simulation.id, results, "completed")

      return NextResponse.json({ ...simulation, results, status: "completed" }, { status: 201 })
    } catch (simulationError) {
      console.error("Simulation error:", simulationError)
      await updateSimulationResults(simulation.id, null, "failed")
      return NextResponse.json({ error: "Simulation failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating simulation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
