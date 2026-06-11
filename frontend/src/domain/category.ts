import type { Household } from './household.ts'

export type Category = {
  categoryID: number
  name: string
  icon: string
  household: Household | null
}
