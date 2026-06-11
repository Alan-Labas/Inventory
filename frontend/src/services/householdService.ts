import type { Household } from '../domain/household.ts'
import { api } from './api.ts'

// Backend sends an empty body when the user has no household yet.
export const getMyHousehold = async (): Promise<Household | null> => {
  const response = await api.get('/household/my')
  return response.data === '' ? null : response.data
}

export const createHousehold = async (name: string): Promise<Household> => {
  const response = await api.post('/household/addHousehold', { name })
  return response.data
}

export const joinHousehold = async (inviteCode: string): Promise<Household> => {
  const response = await api.post('/household/join', { inviteCode })
  return response.data
}
