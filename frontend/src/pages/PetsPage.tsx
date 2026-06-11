import { useState, type FormEvent } from 'react'
//import { AlertCircle, PackagePlus, Plus } from 'lucide-react'
import { isAxiosError } from 'axios'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { buttonClass, cardClass, inputClass, labelClass } from '../components/ui.ts'
import {usePets} from "../hooks/usePets.ts";
import {AlertCircle, Plus} from "lucide-react";

const fieldClass = 'flex min-w-0 flex-col gap-1.5'

export function PetsPage() {
  const { pets,  loading, error, addPet } = usePets()

  // "Add pet" form (the catalog entry: what a product is)
    const [name, setName] = useState('')
    const [breed, setBreed] = useState('')
    const [species, setSpecies] = useState('')
    const [dailyConsumption, setDailyConsumption] = useState('')
    const [saving, setSaving] = useState(false)


  const [formError, setFormError] = useState<string | null>(null)

  const submitError = (err: unknown, fallback: string) =>
    setFormError(
      isAxiosError(err) && typeof err.response?.data === 'string' ? err.response.data : fallback,
    )

  const onAddPet = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSaving(true)
    try {
      await addPet({ name, breed, species, dailyConsumption })
      setName('')
      setBreed('')
        setSpecies('')
        setDailyConsumption('')
    } catch (err) {
      submitError(err, 'Could not add the item')
    } finally {
      setSaving(false)
    }
  }
  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Items</h1>
          <p className="mt-1 text-[15px] text-muted">Your product catalog and current stock</p>
        </div>
        <ThemeToggle />
      </div>

      {(error || formError) && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-danger-soft px-3.5 py-3 text-sm text-danger" role="alert">
          <AlertCircle size={18} className="shrink-0" />
          {error ?? formError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* ---- Add item (catalog) ---- */}
        <form onSubmit={onAddPet} className={cardClass}>
          <h2 className="mb-3 flex items-center gap-2 text-[17px] font-semibold">
            <Plus size={18} className="text-primary" />
            Add item
          </h2>
          <div className="flex flex-col gap-3">
            <div className={fieldClass}>
              <label htmlFor="item-name" className={labelClass}>Name</label>
              <input id="item-name" required className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={fieldClass}>
              <label htmlFor="item-barcode" className={labelClass}>Species</label>
              <input id="item-barcode" required className={inputClass} value={species} onChange={(e) => setSpecies(e.target.value)} />
            </div>
              <div className={fieldClass}>
              <label htmlFor="item-barcode" className={labelClass}>Breed</label>
              <input id="item-barcode" required className={inputClass} value={breed} onChange={(e) => setBreed(e.target.value)} />
            </div>
              <div className={fieldClass}>
              <label htmlFor="item-barcode" className={labelClass}>Daily consumption</label>
              <input id="item-barcode" required className={inputClass} value={dailyConsumption} onChange={(e) => setDailyConsumption(e.target.value)} />
            </div>
            <button type="submit" className={buttonClass} disabled={saving}>
              {saving ? 'Adding…' : 'Add pet'}
            </button>
          </div>
        </form>
      </div>

      {/* ---- Catalog ---- */}
      <h2 className="mb-3 mt-8 text-[17px] font-semibold">All pets</h2>
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : pets.length === 0 ? (
        <div className={cardClass}>
          <p className="text-sm text-muted">You dont have any pets :(</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {pets.map((pets) => (
            <div className={cardClass} key={pets.petID}>
              <h3 className="font-semibold">{pets.name}</h3>
              <p className="mt-1 text-sm text-muted">Species: {pets.species}</p>
              <p className="mt-1 text-sm text-muted">Breed: {pets.breed}</p>
                <p className="mt-1 text-sm text-muted">Daily consumption: {pets.dailyConsumption}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
