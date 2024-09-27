"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DarkModeToggle } from "@/components/ui/DarkModeToggle"
import { Footer } from "@/components/Footer"
import { getAllCategories } from '@/lib/firestore'
import { getAllTools } from '@/lib/firestore'
import { Tool } from '@/backend/src/models/Tool'
import { Category } from '@/backend/src/models/Category'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.category as string
  const [category, setCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [tools, setTools] = useState<Tool[]>([])

  useEffect(() => {
    const fetchCategory = async () => {
      const allCategories = await getAllCategories()
      const foundCategory = allCategories.find(c => c.id === categoryId)
      setCategory(foundCategory || null)
    }
    fetchCategory()
  }, [categoryId])

  useEffect(() => {
    const fetchTools = async () => {
      const allTools = await getAllTools()
      const categoryTools = allTools.filter(tool => tool.category === categoryId)
      setTools(categoryTools)
    }
    fetchTools()
  }, [categoryId])

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!category) {
    return <div>Category not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
            </Button>
          </Link>
          <DarkModeToggle />
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{category.description}</p>

        <div className="mb-6 relative">
          <Input
            type="search"
            placeholder="Search tools..."
            className="w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredTools.map((tool) => (
            <motion.div
              key={tool.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              onClick={() => router.push(`/tools/${categoryId}/${tool.id}`)}
            >
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">{tool.pricing}</span>
                <Link href={tool.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm">
                    Visit Website <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredTools.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            No tools found. Try adjusting your search or add some tools to this category.
          </p>
        )}
      </main>

      <Footer />
    </div>
  )
}