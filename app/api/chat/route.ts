import { type NextRequest, NextResponse } from "next/server"
import { createChatMessage, getChatMessages, getUserAvatars } from "@/lib/database"
import { generatePolicyAnalysis } from "@/lib/gemini-ai"

export async function GET(request: NextRequest) {
  try {
    const userId = "demo-user"

    const { searchParams } = new URL(request.url)
    const simulationId = searchParams.get("simulation_id")

    const messages = await getChatMessages(userId, simulationId ? Number.parseInt(simulationId) : undefined)
    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = "demo-user"

    const body = await request.json()
    const { message, simulation_id, avatar_id, document_ids } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Save user message
    await createChatMessage(userId, simulation_id || null, "user", message)

    // Get user's avatars for context
    const avatars = await getUserAvatars(userId)
    const selectedAvatar = avatar_id ? avatars.find((a) => a.id === avatar_id) : null

    // Load selected documents for context (from memory store)
    let docs: { name: string; content: string }[] = []
    try {
      if (Array.isArray(document_ids) && document_ids.length > 0) {
        const res = await fetch(new URL("/api/chat/documents", request.url))
        if (res.ok) {
          const allDocs = (await res.json()) as { id: number; name: string; content: string }[]
          docs = allDocs.filter((d) => document_ids.includes(d.id)).map((d) => ({ name: d.name, content: d.content }))
        }
      }
    } catch {}

    // Generate AI response using Gemini
    const aiResponse = await generatePolicyAnalysis(message, selectedAvatar, avatars, docs)

    // Save AI response
    const assistantMessage = await createChatMessage(userId, simulation_id || null, "assistant", aiResponse)

    return NextResponse.json({
      user_message: message,
      assistant_message: assistantMessage,
    })
  } catch (error) {
    console.error("Error processing chat message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

