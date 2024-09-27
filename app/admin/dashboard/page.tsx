"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getUser, getAllTools, deleteTool, getAllCategories, deleteCategory } from '@/lib/firestore'
import { AdminToolForm } from '@/components/AdminToolForm'
import { AdminCategoryForm } from '@/components/AdminCategoryForm'
import { Header } from '@/components/Header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tool } from '@/backend/src/models/Tool'
import { Category } from '@/backend/src/models/Category'
import { Edit, Trash2, Plus, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'
import * as Icons from 'react-icons/fa'
import { iconComponents } from '@/lib/categories'

export default function AdminDashboard() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tools, setTools] = useState<Tool[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddToolForm, setShowAddToolForm] = useState(false)
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUser(firebaseUser.uid)
        if (userData && userData.role === 'admin') {
          setIsAdmin(true)
          fetchTools()
          fetchCategories()
        } else {
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const fetchTools = async () => {
    const fetchedTools = await getAllTools()
    setTools(fetchedTools)
  }

  const fetchCategories = async () => {
    const fetchedCategories = await getAllCategories()
    setCategories(fetchedCategories)
  }

  const handleDeleteTool = async (toolId: string) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      await deleteTool(toolId)
      toast.success('Tool deleted successfully')
      fetchTools()
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This will not delete the tools in this category.')) {
      await deleteCategory(categoryId)
      toast.success('Category deleted successfully')
      fetchCategories()
    }
  }

  const handleEditCategory = (categoryId: string) => {
    router.push(`/admin/categories/edit/${categoryId}`);
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedTools = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {} as Record<string, Tool[]>)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAdmin) {
    return <div>Access denied. You must be an admin to view this page.</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={() => setShowAddToolForm(!showAddToolForm)}>
            {showAddToolForm ? 'Cancel' : <><Plus className="mr-2" /> Add New Tool</>}
          </Button>
          <Button onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}>
            {showAddCategoryForm ? 'Cancel' : <><Plus className="mr-2" /> Add New Category</>}
          </Button>
        </div>

        {showAddToolForm && (
          <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Tool</h2>
            <AdminToolForm onToolAdded={() => { fetchTools(); setShowAddToolForm(false); }} />
          </div>
        )}

        {showAddCategoryForm && (
          <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
            <AdminCategoryForm onCategoryAdded={() => { fetchCategories(); setShowAddCategoryForm(false); }} />
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = iconComponents[category.iconName as keyof typeof iconComponents];
              return (
                <div key={category.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center mb-2">
                      {IconComponent && <IconComponent className="w-6 h-6 mr-2 text-blue-500" />}
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditCategory(category.id)}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <hr className="my-8 border-gray-300 dark:border-gray-700" />

        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTools.map((tool) => (
                <div key={tool.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{tool.pricing}</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/admin/edit-tool/${tool.id}`)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTool(tool.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}