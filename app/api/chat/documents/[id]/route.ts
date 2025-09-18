import { type NextRequest, NextResponse } from "next/server"
import { deleteUserDocument } from "@/lib/database"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = "demo-user"
    const id = Number.parseInt(params.id)
    await deleteUserDocument(id, userId)
    return NextResponse.json({ message: "Document deleted" })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
