import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { mealsRotes } from './routes/meals'
import { usersRoutes } from './routes/users'

export const app = fastify()

app.register(usersRoutes, {
  prefix: 'users',
})
app.register(mealsRotes, {
  prefix: 'meals',
})
app.register(cookie)
