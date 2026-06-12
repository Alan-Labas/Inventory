// Mirrors the JSON the backend sends for a Household entity.
// Field names must match the Java fields exactly (householdID, not id).
export type Household = {
  householdID: string // UUID
  name: string
  createdAt: string // dates arrive as ISO strings in JSON, not Date objects
  inviteCode?: string
}
