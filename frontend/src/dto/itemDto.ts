// Request shapes for the item endpoints. Linked entities are sent as a
// nested object containing only the ID — exactly what the backend expects.

export type AddItemRequest = {
  name: string
  barcode: string
  category?: { categoryID: number } | null
  household?: { householdID: string } | null
  pet?: { petID: string } | null
}

export type AddInventoryItemRequest = {
  quantity: number
  expiryDate: string // e.g. "2026-06-20T00:00:00.000Z"
  item: { itemID: string }
}
