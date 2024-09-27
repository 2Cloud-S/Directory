"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()

  const handleContactClick = () => {
    // For now, let's just navigate to a hypothetical contact page
    router.push('/contact')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <header className="p-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <h1 className="text-4xl font-bold mb-4">About AI Directory</h1>
      </header>

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg mb-4">
              AI Directory is dedicated to providing a comprehensive and user-friendly platform for discovering, comparing, and learning about the latest AI tools and technologies. Our mission is to empower developers, businesses, and AI enthusiasts with the knowledge and resources they need to harness the power of artificial intelligence.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-lg space-y-2">
              <li>Curated collection of AI tools across various categories</li>
              <li>Detailed information and reviews for each tool</li>
              <li>Comparison features to help you choose the right AI solution</li>
              <li>Regular updates on new AI technologies and trends</li>
              <li>Community-driven insights and ratings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
            <p className="text-lg mb-4">
              We believe in the power of community. If you're passionate about AI and want to contribute to our directory, we'd love to hear from you. Whether it's suggesting new tools, providing reviews, or sharing your expertise, your input helps make AI Directory a valuable resource for everyone.
            </p>
            <Button className="mt-4" onClick={handleContactClick}>Contact Us</Button>
          </section>
        </motion.div>
      </main>
    </div>
  )
}