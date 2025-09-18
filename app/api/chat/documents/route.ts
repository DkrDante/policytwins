import { type NextRequest, NextResponse } from "next/server"
import { createUserDocument, listUserDocuments } from "@/lib/database"

export async function GET() {
  try {
    const userId = "demo-user"
    const docs = await listUserDocuments(userId)
    return NextResponse.json(docs)
  } catch (error) {
    console.error("Error listing documents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = "demo-user"

    const contentType = request.headers.get("content-type") || ""
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData()
      const file = form.get("file") as File | null
      if (!file) {
        return NextResponse.json({ error: "File is required" }, { status: 400 })
      }
      const name = file.name
      // Only text-like files are parsed for content in this demo environment
      const allowed = ["text/plain", "application/json", "text/markdown", "text/csv"]
      if (!allowed.includes(file.type)) {
        const doc = await createUserDocument(userId, name, "[Unsupported file type for inline analysis]")
        return NextResponse.json(doc, { status: 201 })
      }
      const text = await file.text()
      const doc = await createUserDocument(userId, name, text.slice(0, 100_000))
      return NextResponse.json(doc, { status: 201 })
    }

    const body = await request.json()
    const { name, content } = body || {}
    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 })
    }
    const doc = await createUserDocument(userId, name, String(content).slice(0, 100_000))
    return NextResponse.json(doc, { status: 201 })
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
