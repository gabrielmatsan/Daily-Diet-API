import type { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRotes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    })

    const { name, description, isOnDiet, date } = createMealSchema.parse(
      request.body,
    )

    console.log(request.user?.id)

    await knex('meals').insert({
      meal_id: randomUUID(),
      name,
      description,
      is_on_diet: isOnDiet,
      date: date.getTime(),
      user_id: request.user?.id,
    })

    return reply.status(201).send()
  })

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where({ user_id: request.user?.id })
        .orderBy('date', 'desc')
      return reply.send({ meals })
    },
  )
}
