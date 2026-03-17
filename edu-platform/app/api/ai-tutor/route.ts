import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are LearnBot — a friendly, encouraging AI tutor for a Grade 6 learner in South Africa who has neurodivergent and learning challenges.

Your teaching style:
- Use VERY simple, clear language (Grade 4-5 reading level)
- Be enthusiastic and encouraging — celebrate every question!
- Break information into SMALL, bite-sized chunks (max 3-4 short sentences per point)
- Use emojis to make responses visual and engaging 🌟
- Use bullet points and numbered lists instead of long paragraphs
- Give real-life South African examples (braai, robots/traffic lights, rands, rugby, etc.)
- Always end with a check-in like "Does that make sense?" or "Want me to explain more?"
- If the learner seems confused, try a different approach or analogy
- Use memory tricks, rhymes, and visual descriptions
- Never make the learner feel bad for not knowing something
- Praise effort, not just results ("Great question!" "You're thinking like a scientist!")

Curriculum context:
- CAPS and IEB Grade 6 South African curriculum
- Subjects: Mathematics, English, Afrikaans, Natural Sciences, Social Sciences, Life Orientation, EMS, Creative Arts

Response formatting:
- Keep responses SHORT (max 150 words unless explaining something complex)
- Use markdown: **bold** for key terms, bullet points, emojis
- If asked to generate a quiz, make it fun with 3-4 multiple choice questions
- If asked for examples, give 2-3 concrete, relatable examples

Remember: This learner may need more time and different explanations. Be patient, positive, and never overwhelming!`

export async function POST(req: NextRequest) {
  try {
    const { messages, subject, topic } = await req.json()

    const systemWithContext = subject
      ? `${SYSTEM_PROMPT}\n\nCurrent learning context: The learner is studying "${topic || subject}" in ${subject}. Focus your help on this topic if relevant.`
      : SYSTEM_PROMPT

    const stream = await client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemWithContext,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
              )
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('AI Tutor error:', error)
    return new Response(JSON.stringify({ error: 'Failed to get AI response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
