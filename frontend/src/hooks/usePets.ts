import { useCallback, useEffect, useState } from 'react'
import type { Pet } from '../domain/pet.ts'
import type { petRequest } from '../dto/petDto.ts'
import * as petService from '../services/petService.ts'

// Hook owning all item state for a page: the catalog (Item) and the actual
// stock (InventoryItem), plus actions that re-fetch after every change so
// the UI always shows what the database really contains.
export function usePets() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [petList] = await Promise.all([
        petService.getPets(),
      ])
      setPets(petList)
    } catch {
      setError('Could not load pets. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load once when the page using this hook mounts.
  useEffect(() => {
    void refresh()
  }, [refresh])

  const addPet = useCallback(
    async (data: petRequest) => {
      await petService.addPet(data)
      await refresh()
    },
    [refresh],
  )

  const deletePet = useCallback(
        async (petID: string) => {
          await petService.deletePet(petID)
          await refresh()
        },
      [refresh],
  )



  return { pets, loading, error, refresh, addPet, deletePet}
}
