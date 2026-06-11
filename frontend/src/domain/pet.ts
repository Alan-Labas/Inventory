import type { Household } from './household.ts'

export type Pet = {
  petID: string // UUID
  name: string
  breed: string
  species: string
  dailyConsumption: string
  household: Household | null
}
