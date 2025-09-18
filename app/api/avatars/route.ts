import { type NextRequest, NextResponse } from "next/server"
import { createAvatar, getUserAvatars } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const userId = "demo-user"

    const avatars = await getUserAvatars(userId)
    return NextResponse.json(avatars)
  } catch (error) {
    console.error("Error fetching avatars:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = "demo-user"

    const body = await request.json()
    const { name, age, income, location, family_size, employment_status, health_status, education_level } = body

    // Validation
    if (
      !name ||
      !age ||
      !income ||
      !location ||
      !family_size ||
      !employment_status ||
      !health_status ||
      !education_level
    ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (age < 0 || age > 120) {
      return NextResponse.json({ error: "Age must be between 0 and 120" }, { status: 400 })
    }

    if (income < 0) {
      return NextResponse.json({ error: "Income must be non-negative" }, { status: 400 })
    }

    if (family_size < 1) {
      return NextResponse.json({ error: "Family size must be at least 1" }, { status: 400 })
    }

    const avatar = await createAvatar(userId, {
      name,
      age: Number.parseInt(age),
      income: Number.parseFloat(income),
      location,
      family_size: Number.parseInt(family_size),
      employment_status,
      health_status,
      education_level,
    })

    return NextResponse.json(avatar, { status: 201 })
  } catch (error) {
    console.error("Error creating avatar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
