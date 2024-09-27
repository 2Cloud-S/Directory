"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Settings, Star, Clock, LogOut, Save, Eye, Home, Info } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { DarkModeToggle } from "@/components/ui/DarkModeToggle"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUser, updateUser, getRecentlyViewedTools, getSavedTools } from '@/lib/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [recentlyViewedTools, setRecentlyViewedTools] = useState([])
  const [savedTools, setSavedTools] = useState([])

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userId = firebaseUser.uid
        console.log('Authenticated user ID:', userId)
        const userData = await getUser(userId)
        if (userData) {
          setUser(userData)
          setName(userData.name)
          setEmail(userData.email)
          
          // Fetch recently viewed tools
          const recentTools = await getRecentlyViewedTools(userId)
          setRecentlyViewedTools(recentTools)

          // Fetch saved tools
          const userSavedTools = await getSavedTools(userId)
          setSavedTools(userSavedTools)
        } else {
          console.error('User data not found in Firestore')
          router.push('/login')
        }
      } else {
        // Handle not authenticated state
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (user) {
      const updatedUser = { ...user, name, email }
      try {
        await updateUser(user.id, { name, email })
        setUser(updatedUser)
        toast.success('Profile updated successfully!')
      } catch (error) {
        console.error('Error updating user:', error)
        toast.error('Failed to update profile')
      }
    } else {
      console.error('User is not defined')
    }
  }

  const handleLogout = () => {
    const auth = getAuth()
    auth.signOut()
    router.push('/login')
  }

  const handleViewTool = (toolId, categoryId) => {
    router.push(`/tools/${categoryId}/${toolId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Directory Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push('/')}>
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="mr-2" /> Profile
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Save className="mr-2" /> Save Changes
                </Button>
              </form>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="mr-2" /> Recently Viewed
              </h2>
              <ul className="space-y-2">
                {recentlyViewedTools.length > 0 ? (
                  recentlyViewedTools.map((tool) => (
                    <li key={tool.id} className="flex justify-between items-center">
                      <span>{tool.name}</span>
                      <Button variant="ghost" onClick={() => handleViewTool(tool.id, tool.category)}>
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 dark:text-gray-400">No recently viewed tools.</li>
                )}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Star className="mr-2" /> Saved Tools
              </h2>
              <ul className="space-y-2">
                {savedTools.length > 0 ? (
                  savedTools.map((tool) => (
                    <li key={tool.id} className="flex justify-between items-center">
                      <span>{tool.name}</span>
                      <Button variant="ghost" onClick={() => handleViewTool(tool.id, tool.category)}>
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 dark:text-gray-400">No saved tools.</li>
                )}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Info className="mr-2" /> Account Actions
              </h2>
              <Button variant="destructive" onClick={handleLogout} className="w-full">
                <LogOut className="mr-2" /> Logout
              </Button>
            </div>

            {user?.role === 'admin' && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Settings className="mr-2" /> Admin Access
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You have admin privileges. Access the admin dashboard to manage tools and users.
                </p>
                <Link href="/admin/dashboard" passHref>
                  <Button variant="secondary" className="w-full">
                    <Settings className="mr-2" /> Go to Admin Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}