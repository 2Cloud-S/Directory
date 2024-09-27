"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCategory, updateCategory } from '@/lib/firestore'
import { AdminCategoryForm } from '@/components/AdminCategoryForm'
import { Header } from '@/components/Header'
import { Category } from '@/backend/src/models/Category'

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      const fetchedCategory = await getCategory(params.id)
      setCategory(fetchedCategory)
    }
    fetchCategory()
  }, [params.id])

  const handleCategoryUpdated = () => {
    router.push('/admin/dashboard')
  }

  if (!category) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
        <AdminCategoryForm initialCategory={category} onCategoryAdded={handleCategoryUpdated} />
      </main>
    </div>
  )
}