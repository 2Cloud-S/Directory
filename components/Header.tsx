"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAuth, signOut } from 'firebase/auth'
import { Button } from "@/components/ui/button"
import { DarkModeToggle } from "@/components/ui/DarkModeToggle"
import { useAuthContext } from '@/components/AuthProvider'

export const Header = () => {
  const router = useRouter()
  const { user } = useAuthContext()

  const handleLogout = async () => {
    const auth = getAuth()
    await signOut(auth)
    router.push('/login')
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold">AI Directory</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <DarkModeToggle />
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}