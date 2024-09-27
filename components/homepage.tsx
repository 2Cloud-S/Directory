"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Search, X, Filter, SortAsc, SortDesc } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DarkModeToggle } from "@/components/ui/DarkModeToggle"
import { iconComponents } from '@/lib/categories'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Footer } from "@/components/Footer"
import { useAuth } from "@/lib/auth"
import { IconType } from 'react-icons'
import { getAllCategories } from '@/lib/firestore'
import { Category } from '@/backend/src/models/Category'

export function Homepage() {
  const router = useRouter()
  const { user } = useAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showFilters, setShowFilters] = useState(false)
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getAllCategories()
      setDynamicCategories(fetchedCategories)
    }
    fetchCategories()
  }, [])

  const handleSearch = useCallback(() => {
    // Filter logic remains the same, but now only uses dynamicCategories
  }, [searchTerm, selectedCategories, sortOrder, dynamicCategories])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/tools/${categoryId}`)
  }

  const toggleCategoryFilter = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSearchTerm('')
    setSortOrder('asc')
  }

  const filteredAndSortedCategories = useMemo(() => {
    return dynamicCategories
      .filter(category => {
        const categoryMatch = 
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        return categoryMatch &&
          (selectedCategories.length === 0 || selectedCategories.includes(category.id));
      })
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.name.localeCompare(b.name)
        } else {
          return b.name.localeCompare(a.name)
        }
      });
  }, [searchTerm, selectedCategories, sortOrder, dynamicCategories]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          AI Directory
        </h1>
        <nav className="space-x-4">
          <Link href="/explore">
            <Button variant="ghost">Explore</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>
          <Button variant="ghost">Contact</Button>
          {user ? (
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
          )}
          <DarkModeToggle />
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">Discover AI Tools</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Explore a comprehensive collection of AI tools for developers, designers, and businesses.
          </p>
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-md">
              <Input
                type="search"
                placeholder="Search AI tools and categories..."
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
          </div>
          <AnimatePresence key={showFilters ? 'show' : 'hide'}>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-md shadow-md"
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Filter by Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {dynamicCategories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategoryFilter(category.id)}
                      />
                      <Label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700 dark:text-gray-300">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="mt-2 text-gray-700 dark:text-gray-300" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
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
          {filteredAndSortedCategories.map((category) => {
            const IconComponent = iconComponents[category.iconName as keyof typeof iconComponents] || null;

            return (
              <motion.div
                key={category.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col justify-between h-full"
                whileHover={{ scale: 1.05 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div>
                  {IconComponent && (
                    <IconComponent className="w-12 h-12 mb-4 text-blue-600 dark:text-blue-400" />
                  )}
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{category.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {filteredAndSortedCategories.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 dark:text-gray-400 mt-8"
          >
            No results found. Try adjusting your search or filters.
          </motion.p>
        )}
      </main>

      <Footer />
    </div>
  )
}