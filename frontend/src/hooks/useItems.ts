import { useCallback, useEffect, useState } from 'react'
import type { InventoryItem } from '../domain/inventoryItem.ts'
import type { Item } from '../domain/item.ts'
import type { AddInventoryItemRequest, AddItemRequest } from '../dto/itemDto.ts'
import * as itemService from '../services/itemService.ts'

// Hook owning all item state for a page: the catalog (Item) and the actual
// stock (InventoryItem), plus actions that re-fetch after every change so
// the UI always shows what the database really contains.
export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [itemList, inventoryList] = await Promise.all([
        itemService.getItems(),
        itemService.getInventoryItems(),
      ])
      setItems(itemList)
      setInventory(inventoryList)
    } catch {
      setError('Could not load items. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load once when the page using this hook mounts.
  useEffect(() => {
    void refresh()
  }, [refresh])

  const addItem = useCallback(
    async (data: AddItemRequest) => {
      await itemService.addItem(data)
      await refresh()
    },
    [refresh],
  )

  const addInventoryItem = useCallback(
    async (data: AddInventoryItemRequest) => {
      await itemService.addInventoryItem(data)
      await refresh()
    },
    [refresh],
  )

  const deleteItemFromInventory = useCallback(
      async (inventoryID: string) => {
        await itemService.deleteItemFromInventory(inventoryID)
        await refresh()
      },
      [refresh],
  )

  const deleteItem = useCallback(
      async (itemID: string) => {
        await itemService.deleteItem(itemID)
        await refresh()
      },
      [refresh],
  )

  return { items, inventory, loading, error, refresh, addItem, addInventoryItem, deleteItem, deleteItemFromInventory }
}
