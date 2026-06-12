import type {Household} from "./household.ts";

export  type user = {
    id: number,
    name: string,
    surname: string,
    username: string,
    email: string,
    password: string,
    createdAt: Date,
    isActive: boolean,
    role: string,
    household: Household
}