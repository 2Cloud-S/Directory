"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getTool, updateTool } from '@/lib/firestore'
import { Header } from '@/components/Header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'react-hot-toast'

export default function EditTool({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tool, setTool] = useState<any>(null)

  useEffect(() => {
    const fetchTool = async () => {
      const fetchedTool = await getTool(params.id)
      setTool(fetchedTool)
    }
    fetchTool()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateTool(params.id, tool)
      toast.success('Tool updated successfully')
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error updating tool:', error)
      toast.error('Failed to update tool')
    }
  }

  if (!tool) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Edit Tool</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Tool Name"
            value={tool.name}
            onChange={(e) => setTool({ ...tool, name: e.target.value })}
            required
          />
          <Textarea
            placeholder="Description"
            value={tool.description}
            onChange={(e) => setTool({ ...tool, description: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Category"
            value={tool.category}
            onChange={(e) => setTool({ ...tool, category: e.target.value })}
            required
          />
          <Input
            type="url"
            placeholder="Website"
            value={tool.website}
            onChange={(e) => setTool({ ...tool, website: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Pricing"
            value={tool.pricing}
            onChange={(e) => setTool({ ...tool, pricing: e.target.value })}
            required
          />
          <Button type="submit">Update Tool</Button>
        </form>
      </div>
    </div>
  )
}