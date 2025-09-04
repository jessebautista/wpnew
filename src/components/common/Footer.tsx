import { Link } from 'react-router-dom'
import { Piano } from 'lucide-react'
import { NewsletterSubscription } from '../newsletter/NewsletterSubscription'
import { SocialFollow } from '../social/SocialFollow'
import { useLanguage } from '../../contexts/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Newsletter - Shows first on mobile, last on desktop */}
          <div className="order-1 md:order-4">
            <NewsletterSubscription 
              source="footer"
              variant="sidebar"
              className="max-w-none"
            />
          </div>

          {/* Brand - Shows second on mobile, first on desktop */}
          <div className="space-y-4 order-2 md:order-1">
            <div className="flex items-center space-x-2">
              <Piano className="w-6 h-6" />
              <span className="text-xl font-bold">WorldPianos</span>
            </div>
            <p className="text-sm">
              {t('footer.description')}
            </p>
            <div className="flex justify-center md:justify-start">
              <SocialFollow 
                variant="horizontal" 
                size="sm" 
                showLabels={false}
              />
            </div>
          </div>

          {/* Quick Links - Shows third on mobile, second on desktop */}
          <div className="order-3 md:order-2 text-center">
            <h3 className="font-semibold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link to="/pianos" className="link link-hover">{t('footer.findPianos')}</Link></li>
              <li><Link to="/events" className="link link-hover">{t('footer.events')}</Link></li>
              <li><Link to="/blog" className="link link-hover">{t('footer.blog')}</Link></li>
              <li><Link to="/about" className="link link-hover">{t('footer.aboutUs')}</Link></li>
            </ul>
          </div>

          {/* Support - Shows fourth on mobile, third on desktop */}
          <div className="order-4 md:order-3 text-center">
            <h3 className="font-semibold text-lg mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="link link-hover">{t('footer.contactUs')}</Link></li>
              <li><Link to="/faq" className="link link-hover">{t('footer.faq')}</Link></li>
              <li><Link to="/report" className="link link-hover">{t('footer.reportIssue')}</Link></li>
              <li><Link to="/privacy" className="link link-hover">{t('footer.privacyPolicy')}</Link></li>
              <li><Link to="/terms" className="link link-hover">{t('footer.termsOfService')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="divider"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-sm">
            {t('footer.copyright', { year: currentYear })}
          </p>
          <div className="flex flex-col md:flex-row items-center gap-2 text-sm">
            <p>{t('footer.madeWith')}</p>
            <span className="hidden md:inline">•</span>
            <p>{t('footer.poweredBy')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}