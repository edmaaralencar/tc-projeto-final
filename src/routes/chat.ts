import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { groq } from '../lib/groq'

export async function chat(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/chat',
    {
      schema: {
        tags: ['Chat'],
        summary: 'Health check',
        body: z.object({
          content: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string().nullable(),
          }),
        },
      },
    },
    async (req) => {
      const { content } = req.body

      const message = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content,
          },
        ],
        model: 'openai/gpt-oss-20b',
      })

      return {
        message: message.choices[0]?.message?.content,
      }
    },
  )
}
