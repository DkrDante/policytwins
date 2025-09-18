import { neon } from "@neondatabase/serverless"

const DATABASE_URL = process.env.DATABASE_URL
const sql = DATABASE_URL ? neon(DATABASE_URL) : null as any

export interface Avatar {
  id: number
  user_id: string
  name: string
  age: number
  income: number
  location: string
  family_size: number
  employment_status: string
  health_status: string
  education_level: string
  created_at: string
  updated_at: string
}

export interface PolicySimulation {
  id: number
  user_id: string
  avatar_id: number
  policy_name: string
  policy_description: string
  simulation_parameters: any
  results: any
  status: "pending" | "running" | "completed" | "failed"
  created_at: string
  completed_at: string | null
  avatar_name?: string
}

export interface ChatMessage {
  id: number
  user_id: string
  simulation_id: number | null
  message_type: "user" | "assistant"
  content: string
  created_at: string
}

export interface UserDocument {
  id: number
  user_id: string
  name: string
  content: string
  created_at: string
}

// In-memory fallback storage for environments without DATABASE_URL
const memory = {
  avatars: [] as Avatar[],
  simulations: [] as PolicySimulation[],
  messages: [] as ChatMessage[],
  documents: [] as UserDocument[],
  counters: {
    avatar: 1,
    simulation: 1,
    message: 1,
    document: 1,
  },
}

const nowISO = () => new Date().toISOString()

const usingMemory = !DATABASE_URL

export async function createAvatar(
  userId: string,
  avatarData: Omit<Avatar, "id" | "user_id" | "created_at" | "updated_at">,
) {
  if (usingMemory) {
    const avatar: Avatar = {
      id: memory.counters.avatar++,
      user_id: userId,
      name: avatarData.name,
      age: Number(avatarData.age),
      income: Number(avatarData.income),
      location: avatarData.location,
      family_size: Number(avatarData.family_size),
      employment_status: avatarData.employment_status,
      health_status: avatarData.health_status,
      education_level: avatarData.education_level,
      created_at: nowISO(),
      updated_at: nowISO(),
    }
    memory.avatars.unshift(avatar)
    return avatar
  }

  const result = await sql`
    INSERT INTO avatars (user_id, name, age, income, location, family_size, employment_status, health_status, education_level)
    VALUES (${userId}, ${avatarData.name}, ${avatarData.age}, ${avatarData.income}, ${avatarData.location}, 
            ${avatarData.family_size}, ${avatarData.employment_status}, ${avatarData.health_status}, ${avatarData.education_level})
    RETURNING *
  `
  return result[0] as Avatar
}

export async function getUserAvatars(userId: string): Promise<Avatar[]> {
  if (usingMemory) {
    return memory.avatars.filter(a => a.user_id === userId)
  }
  const result = await sql`
    SELECT * FROM avatars 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
  `
  return result as Avatar[]
}

export async function getAvatar(id: number, userId: string): Promise<Avatar | null> {
  if (usingMemory) {
    return memory.avatars.find(a => a.id === id && a.user_id === userId) || null
  }
  const result = await sql`
    SELECT * FROM avatars 
    WHERE id = ${id} AND user_id = ${userId}
  `
  return (result[0] as Avatar) || null
}

export async function updateAvatar(
  id: number,
  userId: string,
  avatarData: Partial<Omit<Avatar, "id" | "user_id" | "created_at" | "updated_at">>,
) {
  if (usingMemory) {
    const idx = memory.avatars.findIndex(a => a.id === id && a.user_id === userId)
    if (idx === -1) return null
    const prev = memory.avatars[idx]
    const updated: Avatar = {
      ...prev,
      ...avatarData,
      age: avatarData.age !== undefined ? Number(avatarData.age) : prev.age,
      income: avatarData.income !== undefined ? Number(avatarData.income) : prev.income,
      family_size: avatarData.family_size !== undefined ? Number(avatarData.family_size) : prev.family_size,
      updated_at: nowISO(),
    }
    memory.avatars[idx] = updated
    return updated
  }

  const result = await sql`
    UPDATE avatars 
    SET name = COALESCE(${avatarData.name}, name),
        age = COALESCE(${avatarData.age}, age),
        income = COALESCE(${avatarData.income}, income),
        location = COALESCE(${avatarData.location}, location),
        family_size = COALESCE(${avatarData.family_size}, family_size),
        employment_status = COALESCE(${avatarData.employment_status}, employment_status),
        health_status = COALESCE(${avatarData.health_status}, health_status),
        education_level = COALESCE(${avatarData.education_level}, education_level),
        updated_at = ${nowISO()}
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING *
  `
  return (result[0] as Avatar) || null
}

export async function deleteAvatar(id: number, userId: string) {
  if (usingMemory) {
    const before = memory.avatars.length
    memory.avatars = memory.avatars.filter(a => !(a.id === id && a.user_id === userId))
    // also remove related simulations/messages
    memory.simulations = memory.simulations.filter(s => s.avatar_id !== id || s.user_id !== userId)
    memory.messages = memory.messages.filter(m => m.user_id !== userId)
    return
  }

  await sql`
    DELETE FROM avatars 
    WHERE id = ${id} AND user_id = ${userId}
  `
}

export async function createPolicySimulation(
  userId: string,
  avatarId: number,
  policyName: string,
  policyDescription: string,
  simulationParameters: any,
) {
  if (usingMemory) {
    const simulation: PolicySimulation = {
      id: memory.counters.simulation++,
      user_id: userId,
      avatar_id: avatarId,
      policy_name: policyName,
      policy_description: policyDescription,
      simulation_parameters: simulationParameters,
      results: null,
      status: "pending",
      created_at: nowISO(),
      completed_at: null,
    }
    memory.simulations.unshift(simulation)
    return simulation
  }

  const result = await sql`
    INSERT INTO policy_simulations (user_id, avatar_id, policy_name, policy_description, simulation_parameters, status)
    VALUES (${userId}, ${avatarId}, ${policyName}, ${policyDescription}, ${JSON.stringify(simulationParameters)}, 'pending')
    RETURNING *
  `
  return result[0] as PolicySimulation
}

export async function updateSimulationResults(id: number, results: any, status: string) {
  if (usingMemory) {
    const idx = memory.simulations.findIndex(s => s.id === id)
    if (idx === -1) throw new Error("Simulation not found")
    const updated: PolicySimulation = {
      ...memory.simulations[idx],
      results,
      status: status as PolicySimulation["status"],
      completed_at: status === "completed" ? nowISO() : null,
    }
    memory.simulations[idx] = updated
    return updated
  }

  const result = await sql`
    UPDATE policy_simulations 
    SET results = ${JSON.stringify(results)}, 
        status = ${status},
        completed_at = ${status === "completed" ? nowISO() : null}
    WHERE id = ${id}
    RETURNING *
  `
  return result[0] as PolicySimulation
}

export async function getUserSimulations(userId: string): Promise<PolicySimulation[]> {
  if (usingMemory) {
    return memory.simulations
      .filter(s => s.user_id === userId)
      .map(s => ({ ...s, avatar_name: memory.avatars.find(a => a.id === s.avatar_id)?.name }))
  }
  const result = await sql`
    SELECT ps.*, a.name as avatar_name 
    FROM policy_simulations ps
    JOIN avatars a ON ps.avatar_id = a.id
    WHERE ps.user_id = ${userId}
    ORDER BY ps.created_at DESC
  `
  return result as PolicySimulation[]
}

export async function getSimulation(id: number, userId: string): Promise<PolicySimulation | null> {
  if (usingMemory) {
    const sim = memory.simulations.find(s => s.id === id && s.user_id === userId)
    if (!sim) return null
    return { ...sim, avatar_name: memory.avatars.find(a => a.id === sim.avatar_id)?.name }
  }
  const result = await sql`
    SELECT ps.*, a.name as avatar_name
    FROM policy_simulations ps
    JOIN avatars a ON ps.avatar_id = a.id
    WHERE ps.id = ${id} AND ps.user_id = ${userId}
  `
  return (result[0] as PolicySimulation) || null
}

export async function deleteSimulation(id: number, userId: string): Promise<void> {
  if (usingMemory) {
    memory.simulations = memory.simulations.filter(s => !(s.id === id && s.user_id === userId))
    memory.messages = memory.messages.filter(m => m.simulation_id !== id || m.user_id !== userId)
    return
  }
  await sql`
    DELETE FROM policy_simulations WHERE id = ${id} AND user_id = ${userId}
  `
}

export async function createChatMessage(
  userId: string,
  simulationId: number | null,
  messageType: "user" | "assistant",
  content: string,
) {
  if (usingMemory) {
    const msg: ChatMessage = {
      id: memory.counters.message++,
      user_id: userId,
      simulation_id: simulationId,
      message_type: messageType,
      content,
      created_at: nowISO(),
    }
    memory.messages.push(msg)
    return msg
  }

  const result = await sql`
    INSERT INTO chat_messages (user_id, simulation_id, message_type, content)
    VALUES (${userId}, ${simulationId}, ${messageType}, ${content})
    RETURNING *
  `
  return result[0] as ChatMessage
}

export async function getChatMessages(userId: string, simulationId?: number): Promise<ChatMessage[]> {
  if (usingMemory) {
    const list = memory.messages
      .filter(m => m.user_id === userId && (simulationId ? m.simulation_id === simulationId : m.simulation_id == null))
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
    return list
  }

  if (simulationId) {
    const result = await sql`
      SELECT * FROM chat_messages
      WHERE user_id = ${userId} AND simulation_id = ${simulationId}
      ORDER BY created_at ASC
    `
    return result as ChatMessage[]
  } else {
    const result = await sql`
      SELECT * FROM chat_messages
      WHERE user_id = ${userId} AND simulation_id IS NULL
      ORDER BY created_at ASC
    `
    return result as ChatMessage[]
  }
}

export async function createUserDocument(userId: string, name: string, content: string): Promise<UserDocument> {
  // Always use memory for documents to avoid SQL schema requirements
  const doc: UserDocument = {
    id: memory.counters.document++,
    user_id: userId,
    name,
    content,
    created_at: nowISO(),
  }
  memory.documents.unshift(doc)
  return doc
}

export async function listUserDocuments(userId: string): Promise<UserDocument[]> {
  return memory.documents.filter(d => d.user_id === userId)
}

export async function deleteUserDocument(id: number, userId: string): Promise<void> {
  memory.documents = memory.documents.filter(d => !(d.id === id && d.user_id === userId))
}
