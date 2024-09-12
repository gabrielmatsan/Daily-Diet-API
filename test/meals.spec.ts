import { test, beforeAll, afterAll, describe, beforeEach, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Meals routes', () => {
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  test('should be able to create a new meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('No cookies returned from the user creation')
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)
  })

  test('should be able to list all the meals of the client', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('No cookies returned from the user creation')
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Dinner',
        description: "It's a dinner",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    // valida se a ordem está correta
    expect(mealsResponse.body.meals[0].name).toEqual('Dinner')
    expect(mealsResponse.body.meals[1].name).toEqual('Breakfast')
  })

  test('should be able to get a single meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('No cookies returned from the user creation')
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealsResponse.body.meals[0].meal_id

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(mealResponse.body).toEqual({
      meal: expect.objectContaining({
        name: 'Breakfast',
        description: "It's a breakfast",
        is_on_diet: 1,
        date: expect.any(Number),
      }),
    })
  })

  test('should be able to update a meal from user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('No cookies returned from the user creation')
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealsResponse.body.meals[0].meal_id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Steak',
        description: 'breakfast',
        isOnDiet: false,
        date: new Date(),
      })
      .expect(204)
  })

  test('shoud be able to get a summary about the user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('No cookies returned from the user creation')
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Dinner',
        description: "It's a Dinner",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Coofee',
        description: "It's a coofee",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'pizza',
        description: 'cheese',
        isOnDiet: false,
        date: new Date(),
      })
      .expect(201)

    const metrics = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(metrics.body).toEqual({
      totalMeals: 4,
      totalMealsOnDiet: 3,
      totalMealsOffDiet: 1,
      bestOnDietSequence: 3,
    })
  })

  test('shoud be able delete a meal from the user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@gmail.com' })
      .expect(201)

    const cookies = userResponse.get('Set-Cookie')

    if (!cookies) {
      throw new Error('No cookies returned from the user creation')
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })
      .expect(201)

    const mealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealResponse.body.meals[0].meal_id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)
  })
})
