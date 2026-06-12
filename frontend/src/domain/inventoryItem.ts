import type { Item } from './item.ts'

export type InventoryItem = {
  inventoryItemID: string // UUID
  quantity: number
  expiryDate: string
  addedAt: string
  updatedAt: string
  item: Item | null
}
