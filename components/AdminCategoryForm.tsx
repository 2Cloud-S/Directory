"use client"

import React, { useState, useEffect } from 'react'
import { createCategory, updateCategory } from '@/lib/firestore'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'react-hot-toast'
import { Category } from '@/backend/src/models/Category'
import * as Icons from 'react-icons/fa'
import { IconType } from 'react-icons'
import { iconComponents } from '@/lib/categories'

interface AdminCategoryFormProps {
  initialCategory?: Category;
  onCategoryAdded: () => void;
}

export function AdminCategoryForm({ initialCategory, onCategoryAdded }: AdminCategoryFormProps) {
  const [name, setName] = useState(initialCategory?.name || '')
  const [description, setDescription] = useState(initialCategory?.description || '')
  const [id, setId] = useState(initialCategory?.id || '')
  const [iconName, setIconName] = useState(initialCategory?.iconName || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (initialCategory) {
        await updateCategory({ id, name, description, iconName })
        toast.success('Category updated successfully')
      } else {
        await createCategory({ name, description, id, iconName })
        toast.success('Category added successfully')
      }
      onCategoryAdded()
    } catch (error) {
      console.error('Error adding/updating category:', error)
      toast.error('Failed to add/update category')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Category ID (unique identifier)"
        value={id}
        onChange={(e) => setId(e.target.value)}
        required
      />
      <Textarea
        placeholder="Category Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <div>
        <label htmlFor="iconName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Icon
        </label>
        <select
          id="iconName"
          value={iconName}
          onChange={(e) => setIconName(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="" disabled>Select Icon</option>
          {Object.keys(iconComponents).map((key) => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
      <Button type="submit">
        {initialCategory ? 'Update Category' : 'Add Category'}
      </Button>
    </form>
  )
}