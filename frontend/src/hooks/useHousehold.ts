import { useCallback, useEffect, useState } from 'react'
import type { Household } from '../domain/household.ts'
import * as householdService from '../services/householdService.ts'

export function useHousehold() {
    const [household, setHousehold] = useState<Household | null>(null)
    const [Loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [household] = await Promise.all([
        householdService.getMyHousehold()
      ])
      setHousehold(household)
    } catch {
      setError('Could not load household. Is the backend running?')
    } finally {
      setLoading(false)
    }
    }, [])


    useEffect(() => {
    void refresh()
    }, [refresh])

    const leaveFromHousehold = useCallback(
        async (householdID: string) => {
            await householdService.leaveFromHousehold(householdID)
            await refresh()
        },
        [refresh],
    )


    return {leaveFromHousehold, household, Loading, error, refresh}
}
