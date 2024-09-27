import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">AI Directory</h3>
            <p className="text-sm">Discover and compare the best AI tools for your needs.</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-md font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm">
              <li className="mb-1"><Link href="/" className="hover:text-gray-900 dark:hover:text-gray-200">Home</Link></li>
              <li className="mb-1"><Link href="/about" className="hover:text-gray-900 dark:hover:text-gray-200">About</Link></li>
              <li className="mb-1"><Link href="/contact" className="hover:text-gray-900 dark:hover:text-gray-200">Contact</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-md font-semibold mb-2">Legal</h4>
            <ul className="text-sm">
              <li className="mb-1"><Link href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-200">Privacy Policy</Link></li>
              <li className="mb-1"><Link href="/terms" className="hover:text-gray-900 dark:hover:text-gray-200">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-md font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-gray-200">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-gray-200">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-gray-200">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} AI Directory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}