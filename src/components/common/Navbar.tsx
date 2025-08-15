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
      <nav className="navbar bg-base-100/95 backdrop-blur-md shadow-lg sticky top-0 z-50 min-h-16 px-2" id="main-navigation" role="navigation" aria-label="Main navigation">
        <div className="navbar-start flex-1">
          <div className="dropdown">
            <button 
              tabIndex={0} 
              className="btn btn-ghost lg:hidden p-2 min-h-12 h-12 w-12 mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={t('a11y.openMenu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-base-content" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6 text-base-content" aria-hidden="true" />
              )}
            </button>
            {isMobileMenuOpen && (
              <ul 
                id="mobile-menu"
                tabIndex={0} 
                className="menu menu-sm dropdown-content mt-3 z-[1000] p-2 shadow-2xl bg-base-100 rounded-2xl w-64 border border-base-300 fixed left-2"
                role="menu"
              >
                <li role="none">
                  <Link 
                    to="/pianos" 
                    role="menuitem"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Piano className="w-5 h-5 text-primary" aria-hidden="true" />
                    <span className="font-medium">{t('nav.pianos')}</span>
                  </Link>
                </li>
                <li role="none">
                  <Link 
                    to="/events" 
                    role="menuitem"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar className="w-5 h-5 text-secondary" aria-hidden="true" />
                    <span className="font-medium">{t('nav.events')}</span>
                  </Link>
                </li>
                <li role="none">
                  <Link 
                    to="/blog" 
                    role="menuitem"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <BookOpen className="w-5 h-5 text-accent" aria-hidden="true" />
                    <span className="font-medium">{t('nav.blog')}</span>
                  </Link>
                </li>
                {canCreate() && (
                  <>
                    <li className="divider my-2" role="presentation"></li>
                    <li className="menu-title text-xs font-semibold text-base-content/60 px-3 py-2" role="presentation">Add Content</li>
                    <li role="none">
                      <Link 
                        to="/pianos/add" 
                        role="menuitem"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Plus className="w-5 h-5 text-primary" aria-hidden="true" />
                        <span className="font-medium">Add Piano</span>
                      </Link>
                    </li>
                    <li role="none">
                      <Link 
                        to="/events/add" 
                        role="menuitem"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Plus className="w-5 h-5 text-secondary" aria-hidden="true" />
                        <span className="font-medium">Add Event</span>
                      </Link>
                    </li>
                  </>
                )}
                <li className="divider my-2 sm:hidden" role="presentation"></li>
                <li role="none" className="sm:hidden">
                  <button
                    onClick={() => {
                      setIsAccessibilityPanelOpen(true)
                      setIsMobileMenuOpen(false)
                    }}
                    role="menuitem"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-200 transition-colors"
                  >
                    <Accessibility className="w-5 h-5 text-info" aria-hidden="true" />
                    <span className="font-medium">Accessibility</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
          <Link to="/" className="btn btn-ghost text-lg sm:text-xl px-2 sm:px-4 flex-shrink-0" aria-label="WorldPianos home">
            <Piano className="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" aria-hidden="true" />
            <span className="hidden xs:inline sm:inline">WorldPianos</span>
            <span className="xs:hidden sm:hidden">WP</span>
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
      
        <div className="navbar-end flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Language Selector - Hidden on very small screens */}
            <div className="hidden sm:block z-40">
              <LanguageSelector showText={false} />
            </div>
            
            {/* Accessibility Panel Toggle - Hidden on very small screens */}
            <button
              onClick={() => setIsAccessibilityPanelOpen(true)}
              className="btn btn-ghost btn-sm hidden sm:flex"
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
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                <Link to="/login" className="btn btn-ghost btn-sm text-xs sm:text-sm px-2 sm:px-4">Sign In</Link>
                <Link to="/signup" className="btn btn-primary btn-sm text-xs sm:text-sm px-2 sm:px-4">Sign Up</Link>
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