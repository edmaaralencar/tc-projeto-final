import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { env } from '../env'

export async function healthCheck(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/healthcheck',
    {
      schema: {
        tags: ['Health Check'],
        summary: 'Health check',
        response: {
          200: z.string(),
        },
      },
    },
    async () => {
      return 'UP 123456' + ' ' + env.OPEN_AI_API_KEY
    },
  )
}
