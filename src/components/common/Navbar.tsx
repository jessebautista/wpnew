import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { Piano, Calendar, BookOpen, User, LogOut, Plus, Book, Accessibility, Menu, X } from 'lucide-react'
import { LanguageSelector } from '../accessibility/LanguageSelector'
import { AccessibilityPanel } from '../accessibility/AccessibilityPanel'
import { useLanguage } from '../../contexts/LanguageContext'

export function Navbar() {
  const { user, signOut } = useAuth()
  const { canAccessAdminPanel, canCreate } = usePermissions()
  const { t } = useLanguage()
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="navbar bg-base-100 shadow-lg" id="main-navigation" role="navigation" aria-label="Main navigation">
        <div className="navbar-start">
          <div className="dropdown">
            <button 
              tabIndex={0} 
              className="btn btn-ghost lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={t('a11y.openMenu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
            {isMobileMenuOpen && (
              <ul 
                id="mobile-menu"
                tabIndex={0} 
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                role="menu"
              >
                <li role="none"><Link to="/pianos" role="menuitem"><Piano className="w-4 h-4" aria-hidden="true" />{t('nav.pianos')}</Link></li>
                <li role="none"><Link to="/events" role="menuitem"><Calendar className="w-4 h-4" aria-hidden="true" />{t('nav.events')}</Link></li>
                <li role="none"><Link to="/blog" role="menuitem"><BookOpen className="w-4 h-4" aria-hidden="true" />{t('nav.blog')}</Link></li>
                {canCreate() && (
                  <>
                    <li className="menu-title" role="presentation">Add Content</li>
                    <li role="none"><Link to="/pianos/add" role="menuitem"><Plus className="w-4 h-4" aria-hidden="true" />Add Piano</Link></li>
                    <li role="none"><Link to="/events/add" role="menuitem"><Plus className="w-4 h-4" aria-hidden="true" />Add Event</Link></li>
                  </>
                )}
              </ul>
            )}
          </div>
          <Link to="/" className="btn btn-ghost text-xl" aria-label="WorldPianos home">
            <Piano className="w-6 h-6 mr-2" aria-hidden="true" />
            WorldPianos
          </Link>
        </div>
      
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1" role="menubar">
            <li role="none"><Link to="/pianos" className="btn btn-ghost" role="menuitem"><Piano className="w-4 h-4 mr-2" aria-hidden="true" />{t('nav.pianos')}</Link></li>
            <li role="none"><Link to="/events" className="btn btn-ghost" role="menuitem"><Calendar className="w-4 h-4 mr-2" aria-hidden="true" />{t('nav.events')}</Link></li>
            <li role="none"><Link to="/blog" className="btn btn-ghost" role="menuitem"><BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />{t('nav.blog')}</Link></li>
            {canCreate() && (
              <li className="dropdown dropdown-hover" role="none">
                <div tabIndex={0} role="button" className="btn btn-ghost" aria-haspopup="true" aria-expanded="false">
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />Add
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40" role="menu">
                  <li role="none"><Link to="/pianos/add" role="menuitem">Add Piano</Link></li>
                  <li role="none"><Link to="/events/add" role="menuitem">Add Event</Link></li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      
        <div className="navbar-end">
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <LanguageSelector showText={false} />
            
            {/* Accessibility Panel Toggle */}
            <button
              onClick={() => setIsAccessibilityPanelOpen(true)}
              className="btn btn-ghost btn-sm"
              aria-label="Open accessibility settings"
              title="Accessibility Settings"
            >
              <Accessibility className="w-4 h-4" aria-hidden="true" />
            </button>

            {user ? (
              <div className="dropdown dropdown-end">
                <div 
                  tabIndex={0} 
                  role="button" 
                  className="btn btn-ghost btn-circle avatar"
                  aria-label={t('a11y.userMenu')}
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <div className="w-10 rounded-full">
                    {user.avatar_url ? (
                      <img alt={`${user.full_name || 'User'} avatar`} src={user.avatar_url} />
                    ) : (
                      <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 flex items-center justify-center">
                        <User className="w-5 h-5" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                </div>
                <ul 
                  tabIndex={0} 
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                  role="menu"
                  aria-label="User menu"
                >
                  <li className="menu-title" role="presentation">
                    <span>{user.full_name || user.email}</span>
                  </li>
                  <li role="none"><Link to="/profile" role="menuitem">{t('nav.profile')}</Link></li>
                  <li role="none"><Link to="/dashboard" role="menuitem">{t('nav.dashboard')}</Link></li>
                  <li role="none"><Link to="/passport" role="menuitem"><Book className="w-4 h-4" aria-hidden="true" />Piano Passport</Link></li>
                  {canAccessAdminPanel() && (
                    <>
                      <li role="none"><Link to="/moderation" role="menuitem">{t('nav.moderation')}</Link></li>
                      <li role="none"><Link to="/admin" role="menuitem">{t('nav.admin')}</Link></li>
                    </>
                  )}
                  <li role="none">
                    <button onClick={() => signOut()} role="menuitem">
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      {t('nav.logout')}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="btn btn-ghost">{t('nav.login')}</Link>
                <Link to="/signup" className="btn btn-primary">{t('nav.signup')}</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={isAccessibilityPanelOpen}
        onClose={() => setIsAccessibilityPanelOpen(false)}
      />
    </>
  )
}