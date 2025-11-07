import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

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
      return 'UP 123'
    },
  )
}
