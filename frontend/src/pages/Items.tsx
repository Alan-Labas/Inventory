import { useState, type FormEvent } from 'react'
import { AlertCircle, PackagePlus, Plus, Trash } from 'lucide-react'
import { isAxiosError } from 'axios'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { buttonClass, cardClass, inputClass, labelClass } from '../components/ui.ts'
import { useItems } from '../hooks/useItems.ts'

const fieldClass = 'flex min-w-0 flex-col gap-1.5'

export function ItemsPage() {
  const { items, inventory, loading, error, addItem, addInventoryItem, deleteItem, deleteItemFromInventory } = useItems()

  // "Add item" form (the catalog entry: what a product is)
  const [name, setName] = useState('')
  const [barcode, setBarcode] = useState('')
  const [saving, setSaving] = useState(false)

  // "Add to inventory" form (the stock: how much of an item you have)
  const [selectedItemID, setSelectedItemID] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [expiryDate, setExpiryDate] = useState('')
  const [savingInventory, setSavingInventory] = useState(false)

  const [formError, setFormError] = useState<string | null>(null)

  const submitError = (err: unknown, fallback: string) =>
    setFormError(
      isAxiosError(err) && typeof err.response?.data === 'string' ? err.response.data : fallback,
    )

  const onAddItem = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSaving(true)
    try {
      await addItem({ name, barcode })
      setName('')
      setBarcode('')
    } catch (err) {
      submitError(err, 'Could not add the item')
    } finally {
      setSaving(false)
    }
  }

  const onAddInventoryItem = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSavingInventory(true)
    try {
      await addInventoryItem({
        quantity: Number(quantity),
        // date input gives "2026-06-20"; backend's java.util.Date needs a full timestamp
        expiryDate: new Date(expiryDate).toISOString(),
        item: { itemID: selectedItemID },
      })
      setSelectedItemID('')
      setQuantity('1')
      setExpiryDate('')
    } catch (err) {
      submitError(err, 'Could not add to inventory')
    } finally {
      setSavingInventory(false)
    }
  }

  const onDeleteItem = async (itemID: string) => {
    try{
      await deleteItem(itemID)
    }catch (err){
      submitError(err, 'could not delete this item')
    }
  }

  const onDeleteInventoryItem = async (inventoryItemID: string) => {
    try{
      await deleteItemFromInventory(inventoryItemID)
    }catch (err){
      submitError(err, 'could not delete this item from inventory')
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
        <form onSubmit={onAddItem} className={cardClass}>
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
              <label htmlFor="item-barcode" className={labelClass}>Barcode</label>
              <input id="item-barcode" required className={inputClass} value={barcode} onChange={(e) => setBarcode(e.target.value)} />
            </div>
            <button type="submit" className={buttonClass} disabled={saving}>
              {saving ? 'Adding…' : 'Add item'}
            </button>
          </div>
        </form>

        {/* ---- Add to inventory (stock) ---- */}
        <form onSubmit={onAddInventoryItem} className={cardClass}>
          <h2 className="mb-3 flex items-center gap-2 text-[17px] font-semibold">
            <PackagePlus size={18} className="text-primary" />
            Add to inventory
          </h2>
          <div className="flex flex-col gap-3">
            <div className={fieldClass}>
              <label htmlFor="inv-item" className={labelClass}>Item</label>
              <select
                id="inv-item"
                required
                className={inputClass}
                value={selectedItemID}
                onChange={(e) => setSelectedItemID(e.target.value)}
              >
                <option value="" disabled>Choose an item…</option>
                {items.map((item) => (
                  <option key={item.itemID} value={item.itemID}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className={fieldClass}>
                <label htmlFor="inv-quantity" className={labelClass}>Quantity</label>
                <input
                  id="inv-quantity"
                  type="number"
                  min="1"
                  required
                  className={inputClass}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className={fieldClass}>
                <label htmlFor="inv-expiry" className={labelClass}>Expiry date</label>
                <input
                  id="inv-expiry"
                  type="date"
                  required
                  className={inputClass}
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className={buttonClass} disabled={savingInventory || items.length === 0}>
              {savingInventory ? 'Adding…' : 'Add to inventory'}
            </button>
          </div>
        </form>
      </div>

      {/* ---- Current stock ---- */}
      <h2 className="mb-3 mt-8 text-[17px] font-semibold">In stock</h2>
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : inventory.length === 0 ? (
        <div className={cardClass}>
          <p className="text-sm text-muted">Nothing in stock yet. Add an item, then add it to your inventory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {inventory.map((entry) => (
            <div className={cardClass} key={entry.inventoryItemID}>
              <h3 className="font-semibold">{entry.item?.name ?? 'Unknown item'}</h3>
              <p className="mt-1 text-sm text-muted">Quantity: {entry.quantity}</p>
              <p className="text-sm text-muted">
                Expires: {new Date(entry.expiryDate).toLocaleDateString()}
              </p>
              <button  type="button" className={buttonClass} onClick={() => onDeleteInventoryItem(entry.inventoryItemID)}>
                <Trash size={16} className="text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---- Catalog ---- */}
      <h2 className="mb-3 mt-8 text-[17px] font-semibold">All items</h2>
      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className={cardClass}>
          <p className="text-sm text-muted">No items yet — add your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {items.map((item) => (
            <div className={cardClass} key={item.itemID}>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="mt-1 text-sm text-muted">Barcode: {item.barcode}</p>
              {item.category && <p className="text-sm text-muted">Category: {item.category.name}</p>}
              <br/>
              <button type="button" className={buttonClass} onClick={() => onDeleteItem(item.itemID)}>
              <Trash size={16} className="text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
