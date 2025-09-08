import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './styles/accessibility.css'
import { Navbar } from './components/common/Navbar'
import { Footer } from './components/common/Footer'
import { SkipLinks } from './components/accessibility/SkipLinks'
import { HomePage } from './pages/home/HomePage'
import { PianosPage } from './pages/pianos/PianosPage'
import { PianoDetailPage } from './pages/pianos/PianoDetailPage'
import { AddPianoPage } from './pages/pianos/AddPianoPage'
import { MapPage } from './pages/pianos/MapPage'
import { EventsPage } from './pages/events/EventsPage'
import { EventDetailPage } from './pages/events/EventDetailPage'
import { AddEventPage } from './pages/events/AddEventPage'
import { BlogPage } from './pages/blog/BlogPage'
import { BlogPostPage } from './pages/blog/BlogPostPage'
import { ModerationQueuePage } from './pages/moderation/ModerationQueuePage'
import { ModerationRulesPage } from './pages/moderation/ModerationRulesPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { LoginPage } from './pages/auth/LoginPage'
import { SignupPage } from './pages/auth/SignupPage'
import { EmailConfirmationPage } from './pages/auth/EmailConfirmationPage'
import { OAuthCallbackPage } from './pages/auth/OAuthCallbackPage'
import { DashboardPage } from './pages/profile/DashboardPage'
import { PianoPassportPage } from './pages/profile/PianoPassportPage'
import { UnauthorizedPage } from './pages/auth/UnauthorizedPage'
import { UnsubscribePage } from './pages/newsletter/UnsubscribePage'
import { AboutPage } from './pages/static/AboutPage'
import { ContactPage } from './pages/static/ContactPage'
import { FAQPage } from './pages/static/FAQPage'
import { PrivacyPage } from './pages/static/PrivacyPage'
import { TermsPage } from './pages/static/TermsPage'
import { AuthProvider } from './components/auth/AuthProvider'
import { LanguageProvider } from './contexts/LanguageContext'
import { AccessibilityProvider } from './contexts/AccessibilityContext'
// Import admin utils for development
import './utils/adminUtils'
import './utils/debugUtils'
import './utils/simpleTest'
import './utils/connectionTest'
import './utils/fixSupabaseClient'
import './utils/directFetch'
import './utils/directAuth'
import './utils/csvImport'

function App() {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <SkipLinks />
              <Navbar />
              <main id="main-content" className="flex-1" tabIndex={-1}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/pianos" element={<PianosPage />} />
                  <Route path="/pianos/:id" element={<PianoDetailPage />} />
                  <Route path="/pianos/add" element={<AddPianoPage />} />
                  <Route path="/pianos/map" element={<MapPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/add" element={<AddEventPage />} />
                  <Route path="/events/:id" element={<EventDetailPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogPostPage />} />
                  <Route path="/moderation" element={<ModerationQueuePage />} />
                  <Route path="/moderation/rules" element={<ModerationRulesPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/auth/confirm-email" element={<EmailConfirmationPage />} />
                  <Route path="/auth/callback" element={<OAuthCallbackPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/passport" element={<PianoPassportPage />} />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="/unsubscribe" element={<UnsubscribePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  )
}

export default App