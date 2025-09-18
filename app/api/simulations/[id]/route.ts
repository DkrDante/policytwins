import { type NextRequest, NextResponse } from "next/server"
import { getSimulation, deleteSimulation } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = "demo-user"

    const simulation = await getSimulation(Number.parseInt(params.id), userId)
    if (!simulation) {
      return NextResponse.json({ error: "Simulation not found" }, { status: 404 })
    }

    return NextResponse.json(simulation)
  } catch (error) {
    console.error("Error fetching simulation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = "demo-user"

    await deleteSimulation(Number.parseInt(params.id), userId)
    return NextResponse.json({ message: "Simulation deleted" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting simulation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
