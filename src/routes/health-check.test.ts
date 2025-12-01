// tests/healthCheck.test.ts
import Fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { healthCheck } from './health-check'

describe('healthCheck route', () => {
  const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  beforeAll(async () => {
    await healthCheck(app)
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /healthcheck should return "UP"', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/healthcheck',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe('UP')
  })
})
