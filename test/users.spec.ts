import { expect, test, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  test('should be able to create a new user', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ name: 'gabigol', email: 'gabigol@test.com' })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
  })
})
