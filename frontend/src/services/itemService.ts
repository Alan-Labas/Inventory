import type { InventoryItem } from '../domain/inventoryItem.ts'
import type { Item } from '../domain/item.ts'
import type { AddInventoryItemRequest, AddItemRequest } from '../dto/itemDto.ts'
import { api } from './api.ts'

export const getItems = async (): Promise<Item[]> => {
  const response = await api.get('/item/getItems')
  return response.data
}

// Backend responds with a plain confirmation string, not the created item.
export const addItem = async (data: AddItemRequest): Promise<string> => {
  const response = await api.post('/item/addItem', data)
  return response.data
}

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const response = await api.get('/inventoryItem/getAll')
  return response.data
}

export const addInventoryItem = async (data: AddInventoryItemRequest): Promise<string> => {
  const response = await api.post('/inventoryItem/addInventoryItem', data)
  return response.data
}

export const deleteItem = async (itemID: string): Promise<string> => {
  const response = await api.delete('/item/' +itemID)
  return response.data
}

export const deleteItemFromInventory = async (inventoryItemID: string): Promise<string> => {
  const response = await api.delete('/inventoryItem/'+inventoryItemID)
  return response.data
}
