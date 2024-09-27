"use client"

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { CategoryTools } from '@/lib/categoryTools'

interface CategoryPageProps {
  category: {
    id: string
    name: string
    icon: React.ElementType
    description: string
  }
}

export function CategoryPage({ category }: CategoryPageProps) {
  const tools = CategoryTools[category.id] || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <header className="p-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-xl text-gray-400">{category.description}</p>
      </header>

      <main className="container mx-auto px-6 py-12">
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
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-400 mb-4">{tool.description}</p>
              <Link href={`/tools/${category.id}/${tool.id}`}>
                <Button>Learn More</Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}