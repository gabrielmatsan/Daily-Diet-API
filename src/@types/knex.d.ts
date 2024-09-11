// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      session_id: string
      created_at: string
      updated_at: string
    }
    meals: {
      meal_id: string
      user_id: string
      name: string
      description: string
      is_on_diet: boolean
      date: number
      created_at: string
      updated_at: string
    }
  }
}
