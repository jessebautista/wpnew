import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { Piano, Calendar, BookOpen, User, LogOut, Plus, Book, Accessibility, Menu, X, LayoutDashboard } from 'lucide-react'
import { LanguageSelector } from '../accessibility/LanguageSelector'
import { AccessibilityPanel } from '../accessibility/AccessibilityPanel'
import { useLanguage } from '../../contexts/LanguageContext'

export function Navbar() {
  const { user, signOut } = useAuth()
  const { canAccessAdminPanel, canCreate } = usePermissions()
  const { t } = useLanguage()
  const location = useLocation()
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  // Close menus when route changes
  useEffect(() => {
    setIsProfileMenuOpen(false)
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <nav className="navbar bg-base-100/95 backdrop-blur-md shadow-lg sticky top-0 z-50 min-h-16 px-2" id="main-navigation" role="navigation" aria-label="Main navigation">
        <div className="navbar-start flex-1">
          {/* Mobile menu button */}
          <button 
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <Link to="/" className="btn btn-ghost text-lg sm:text-xl px-2 sm:px-4 flex-shrink-0" aria-label="WorldPianos home">
            <Piano className="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" aria-hidden="true" />
            <span className="hidden sm:inline">WorldPianos</span>
            <span className="sm:hidden">WP</span>
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
      
        <div className="navbar-end flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
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
              <div className="relative">
                <div 
                  role="button" 
                  className="btn btn-ghost btn-circle avatar"
                  aria-label={t('a11y.userMenu')}
                  aria-haspopup="true"
                  aria-expanded={isProfileMenuOpen}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setIsProfileMenuOpen(!isProfileMenuOpen)
                  }}
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
                {isProfileMenuOpen && (
                  <ul 
                    className="absolute right-0 top-full mt-3 z-[1] p-2 shadow menu menu-sm bg-base-100 rounded-box w-52"
                    role="menu"
                    aria-label="User menu"
                  >
                    <li className="menu-title" role="presentation">
                      <span>{user.full_name || user.email}</span>
                    </li>
                    <li role="none">
                      <Link 
                        to="/dashboard" 
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                        {t('nav.dashboard')}
                      </Link>
                    </li>
                    <li role="none">
                      <Link 
                        to="/passport" 
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Book className="w-4 h-4" aria-hidden="true" />
                        Piano Passport
                      </Link>
                    </li>
                    {canAccessAdminPanel() && (
                      <>
                        <li role="none">
                          <Link 
                            to="/moderation" 
                            role="menuitem"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            {t('nav.moderation')}
                          </Link>
                        </li>
                        <li role="none">
                          <Link 
                            to="/admin" 
                            role="menuitem"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            {t('nav.admin')}
                          </Link>
                        </li>
                      </>
                    )}
                    <li role="none">
                      <button 
                        onClick={() => {
                          setIsProfileMenuOpen(false)
                          signOut()
                        }} 
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        {t('nav.logout')}
                      </button>
                    </li>
                  </ul>
                )}
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

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" style={{ top: '64px' }} onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="bg-base-100 shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <Link 
                to="/pianos" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Piano className="w-5 h-5 text-primary" />
                <span>{t('nav.pianos')}</span>
              </Link>
              <Link 
                to="/events" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="w-5 h-5 text-secondary" />
                <span>{t('nav.events')}</span>
              </Link>
              <Link 
                to="/blog" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5 text-accent" />
                <span>{t('nav.blog')}</span>
              </Link>
              {canCreate() && (
                <>
                  <div className="divider my-2"></div>
                  <Link 
                    to="/pianos/add" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Plus className="w-5 h-5 text-primary" />
                    <span>Add Piano</span>
                  </Link>
                  <Link 
                    to="/events/add" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Plus className="w-5 h-5 text-secondary" />
                    <span>Add Event</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={isAccessibilityPanelOpen}
        onClose={() => setIsAccessibilityPanelOpen(false)}
      />
    </>
  )
}