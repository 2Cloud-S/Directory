"use client"

import { useState } from 'react'
import { createTool } from '@/lib/firestore'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'react-hot-toast'
import { categories } from '@/lib/categories'  // Import the categories

interface AdminToolFormProps {
  onToolAdded: () => void;
}

export function AdminToolForm({ onToolAdded }: AdminToolFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [website, setWebsite] = useState('')
  const [pricing, setPricing] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createTool({
        name,
        description,
        category,
        website,
        pricing,
      })
      toast.success('Tool added successfully')
      onToolAdded()
      // Reset form fields
      setName('')
      setDescription('')
      setCategory('')
      setWebsite('')
      setPricing('')
    } catch (error) {
      console.error('Error adding tool:', error)
      toast.error('Failed to add tool')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Tool Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        required
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <Input
        type="url"
        placeholder="Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Pricing"
        value={pricing}
        onChange={(e) => setPricing(e.target.value)}
        required
      />
      <Button type="submit">Add Tool</Button>
    </form>
  )
}