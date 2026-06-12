import {api} from './api';
import type {Pet} from "../domain/pet.ts";
import type {petRequest} from "../dto/petDto.ts";

export const getPets = async (): Promise<Pet[]> => {
    const response = await api.get('/pet/getPet')
    return response.data
}

export const addPet = async (data: petRequest): Promise<string> => {
    const response = await api.post('/pet/addPet', data)
    return response.data
}


export const deletePet = async (petID: string): Promise<string> => {
    const response = await api.delete('/pet/' + petID)
    return response.data
}