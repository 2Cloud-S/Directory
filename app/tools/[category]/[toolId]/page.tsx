"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getTool, addRecentlyViewedTool, saveTool, unsaveTool, getUser } from '@/lib/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Tool } from '@/backend/src/models/Tool'
import { User } from '@/backend/src/models/User'

export default function ToolPage() {
  const { category, toolId } = useParams()
  const [tool, setTool] = useState<Tool | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUser(firebaseUser.uid)
        setUser(userData)
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchToolData = async () => {
      if (toolId && typeof toolId === 'string') {
        const fetchedTool = await getTool(toolId)
        setTool(fetchedTool)
        
        if (user) {
          await addRecentlyViewedTool(user.id, toolId)
          setIsSaved(user.savedTools?.includes(toolId) || false)
        }
      }
    }

    fetchToolData()
  }, [toolId, user])

  const handleSaveTool = async () => {
    if (user && tool) {
      if (isSaved) {
        await unsaveTool(user.id, tool.id)
        setIsSaved(false)
      } else {
        await saveTool(user.id, tool.id)
        setIsSaved(true)
      }
    }
  }

  if (!tool) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{tool.name}</h1>
      <p className="text-gray-600 mb-4">{tool.description}</p>
      <div className="mb-4">
        <strong>Category:</strong> {category}
      </div>
      <div className="mb-4">
        <strong>Website:</strong> <a href={tool.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{tool.website}</a>
      </div>
      <div className="mb-4">
        <strong>Pricing:</strong> {tool.pricing}
      </div>
      <div className="mb-4">
        <strong>Features:</strong>
        <ul className="list-disc list-inside">
          {tool.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <strong>Rating:</strong> {tool.rating.toFixed(1)} ({tool.reviewCount} reviews)
      </div>
      {user && (
        <button
          onClick={handleSaveTool}
          className={`px-4 py-2 rounded ${isSaved ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {isSaved ? 'Unsave Tool' : 'Save Tool'}
        </button>
      )}
    </div>
  )
}