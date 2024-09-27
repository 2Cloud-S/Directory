"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, SortAsc, SortDesc } from 'lucide-react'
import Link from 'next/link'
import { DarkModeToggle } from "@/components/ui/DarkModeToggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAllTools } from '@/lib/firestore'
import { Footer } from '@/components/Footer'  // Add this import

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [tools, setTools] = useState<any[]>([])

  useEffect(() => {
    const fetchTools = async () => {
      const fetchedTools = await getAllTools()
      setTools(fetchedTools)
    }
    fetchTools()
  }, [])

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedTools = [...filteredTools].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name)
    } else {
      return b.name.localeCompare(a.name)
    }
  })

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            AI Directory
          </Link>
          <nav className="space-x-4">
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
            <Button variant="ghost">Contact</Button>
            <DarkModeToggle />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6">Explore AI Tools</h1>
          <div className="flex mb-6">
            <div className="relative flex-grow">
              <Input
                type="search"
                placeholder="Search AI tools..."
                className="w-full pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTools.map((tool) => (
              <motion.div
                key={tool.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
                <Link href={`/tools/${tool.category}/${tool.id}`}>
                  <Button>Learn More</Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
              No tools found. Try adjusting your search.
            </p>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}