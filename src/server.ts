import fastify from 'fastify'
import { env } from './env/index'
import { usersRoutes } from './routes/users'
import cookie from '@fastify/cookie'
import { mealsRotes } from './routes/meals'

const app = fastify()

app.register(usersRoutes, {
  prefix: 'users',
})
app.register(mealsRotes, {
  prefix: 'meals',
})
app.register(cookie)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server is running...')
  })
