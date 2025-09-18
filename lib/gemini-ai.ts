import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Avatar, UserDocument } from '@/lib/database'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generatePolicyAnalysis(
  message: string,
  selectedAvatar: Avatar | null,
  allAvatars: Avatar[],
  documents: UserDocument[] = []
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Build context about the user's avatar
    let avatarContext = ''
    if (selectedAvatar) {
      avatarContext = `
Selected Avatar Profile:
- Name: ${selectedAvatar.name}
- Age: ${selectedAvatar.age}
- Annual Income: $${selectedAvatar.income.toLocaleString()}
- Location: ${selectedAvatar.location}
- Family Size: ${selectedAvatar.family_size}
- Employment Status: ${selectedAvatar.employment_status}
- Health Status: ${selectedAvatar.health_status}
- Education Level: ${selectedAvatar.education_level}
`
    }

    // Build context about uploaded documents
    let documentContext = ''
    if (documents.length > 0) {
      documentContext = `
Uploaded Documents for Analysis:
${documents.map(doc => `- ${doc.name}: ${doc.content.slice(0, 500)}...`).join('\n')}
`
    }

    const prompt = `You are PolicyTwin, an AI assistant that helps users understand how government policies affect real people's lives. You provide personalized, data-driven analysis of policy impacts.

${avatarContext}

${documentContext}

User's Question: "${message}"

Instructions:
1. Provide a detailed, personalized analysis of how the mentioned policy would affect the selected avatar
2. Use specific numbers and calculations when possible (e.g., "This would increase your monthly expenses by $X")
3. Consider the avatar's income, family size, location, and other characteristics
4. Be conversational but informative
5. If no avatar is selected, encourage them to create one for personalized analysis
6. If documents are provided, reference them in your analysis
7. Keep responses under 500 words but be comprehensive
8. Use emojis sparingly to make responses engaging

Response:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating AI response:', error)
    
    // Fallback response if Gemini API fails
    if (selectedAvatar) {
      return `I apologize, but I'm experiencing technical difficulties right now. However, I can still help you understand how policies might affect ${selectedAvatar.name}. 

Based on their profile (${selectedAvatar.age} years old, $${selectedAvatar.income.toLocaleString()} income, ${selectedAvatar.family_size} person household in ${selectedAvatar.location}), I'd be happy to analyze specific policies once the system is back online.

Please try again in a moment, or feel free to ask about specific policies like tax changes, healthcare reforms, or education funding.`
    }
    
    return `I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment. 

In the meantime, you can create an avatar to get personalized policy analysis, or ask me about general policy topics like tax reforms, healthcare changes, or education funding.`
  }
}

