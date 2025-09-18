import { type NextRequest, NextResponse } from "next/server"
import { getAvatar, updateAvatar, deleteAvatar } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = "demo-user"

    const avatar = await getAvatar(Number.parseInt(params.id), userId)
    if (!avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 })
    }

    return NextResponse.json(avatar)
  } catch (error) {
    console.error("Error fetching avatar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = "demo-user"

    const body = await request.json()
    const avatar = await updateAvatar(Number.parseInt(params.id), userId, body)

    if (!avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 })
    }

    return NextResponse.json(avatar)
  } catch (error) {
    console.error("Error updating avatar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = "demo-user"

    await deleteAvatar(Number.parseInt(params.id), userId)
    return NextResponse.json({ message: "Avatar deleted successfully" })
  } catch (error) {
    console.error("Error deleting avatar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
