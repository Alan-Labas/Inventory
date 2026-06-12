import type { Category } from './category.ts'
import type { Household } from './household.ts'
import type { Pet } from './pet.ts'

export type Item = {
  itemID: string // UUID
  name: string
  barcode: string
  category: Category | null
  household: Household | null
  pet: Pet | null
}
