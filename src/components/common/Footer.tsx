import { Link } from 'react-router-dom'
import { Piano } from 'lucide-react'
import { NewsletterSubscription } from '../newsletter/NewsletterSubscription'
import { SocialFollow } from '../social/SocialFollow'

export function Footer() {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Piano className="w-6 h-6" />
              <span className="text-xl font-bold">WorldPianos</span>
            </div>
            <p className="text-sm">
              Connecting piano enthusiasts worldwide, making it easy to find, share, and celebrate public pianos.
            </p>
            <SocialFollow 
              variant="horizontal" 
              size="sm" 
              showLabels={false}
            />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/pianos" className="link link-hover">Find Pianos</Link></li>
              <li><Link to="/events" className="link link-hover">Events</Link></li>
              <li><Link to="/blog" className="link link-hover">Blog</Link></li>
              <li><Link to="/about" className="link link-hover">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="link link-hover">Contact Us</Link></li>
              <li><Link to="/faq" className="link link-hover">FAQ</Link></li>
              <li><Link to="/report" className="link link-hover">Report an Issue</Link></li>
              <li><Link to="/privacy" className="link link-hover">Privacy Policy</Link></li>
              <li><Link to="/terms" className="link link-hover">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterSubscription 
              source="footer"
              variant="sidebar"
              className="max-w-none"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="divider"></div>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © 2024 WorldPianos.org. All rights reserved.
          </p>
          <p className="text-sm">
            Made with ♪ for piano lovers worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}