import { useLanguage } from '../../contexts/LanguageContext'
import { Shield, Eye, Lock, Users, Globe, Mail } from 'lucide-react'

export function PrivacyPage() {
  const { } = useLanguage()

  const lastUpdated = 'January 15, 2024'

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl opacity-90">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-sm opacity-75 mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Quick Summary */}
          <div className="card bg-base-100 shadow-xl mb-12">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">
                <Shield className="w-6 h-6" />
                Privacy at a Glance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">What We Collect</h3>
                    <p className="text-sm text-base-content/70">Basic account info, piano locations you add, and usage data to improve our service.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">How We Protect It</h3>
                    <p className="text-sm text-base-content/70">Industry-standard security, encrypted data transmission, and secure storage practices.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">How We Use It</h3>
                    <p className="text-sm text-base-content/70">To provide our service, send notifications you've opted into, and improve the platform.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Who We Share With</h3>
                    <p className="text-sm text-base-content/70">We don't sell your data. Limited sharing only with service providers and when legally required.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Policy */}
          <div className="prose prose-lg max-w-none">
            <h2>1. Information We Collect</h2>
            
            <h3>Account Information</h3>
            <p>
              When you create an account, we collect:
            </p>
            <ul>
              <li>Email address</li>
              <li>Full name (optional)</li>
              <li>Username</li>
              <li>Profile picture (optional)</li>
              <li>Location (optional, for finding nearby pianos)</li>
            </ul>

            <h3>Content You Provide</h3>
            <p>
              When you use our service, you may provide:
            </p>
            <ul>
              <li>Piano locations and descriptions</li>
              <li>Event information and descriptions</li>
              <li>Comments and reviews</li>
              <li>Photos and media uploads</li>
              <li>Messages and communications</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>
              We automatically collect certain information about your use of our service:
            </p>
            <ul>
              <li>IP address and general location</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and features used</li>
              <li>Time stamps and duration of visits</li>
              <li>Referring websites</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            
            <p>We use your information to:</p>
            <ul>
              <li><strong>Provide our service:</strong> Display pianos, organize events, facilitate community interactions</li>
              <li><strong>Maintain your account:</strong> Authentication, password resets, account preferences</li>
              <li><strong>Send communications:</strong> Service updates, notifications you've opted into, important announcements</li>
              <li><strong>Improve our platform:</strong> Analytics, bug fixes, feature development</li>
              <li><strong>Ensure safety:</strong> Moderation, abuse prevention, spam detection</li>
              <li><strong>Comply with legal requirements:</strong> Respond to legal requests, protect rights and safety</li>
            </ul>

            <h2>3. Information Sharing and Disclosure</h2>
            
            <h3>Public Information</h3>
            <p>
              Some information is public by design:
            </p>
            <ul>
              <li>Piano locations and descriptions you add</li>
              <li>Public events you create</li>
              <li>Comments and reviews you post</li>
              <li>Your username and public profile information</li>
            </ul>

            <h3>Service Providers</h3>
            <p>
              We may share information with third-party service providers who help us operate our platform:
            </p>
            <ul>
              <li>Cloud hosting providers (for data storage and processing)</li>
              <li>Email service providers (for notifications and communications)</li>
              <li>Analytics services (for understanding usage patterns)</li>
              <li>Payment processors (for donations and transactions)</li>
            </ul>

            <h3>Legal Requirements</h3>
            <p>
              We may disclose information when required by law or to:
            </p>
            <ul>
              <li>Comply with legal process or government requests</li>
              <li>Protect the rights, property, or safety of WorldPianos, our users, or others</li>
              <li>Prevent fraud or abuse of our service</li>
              <li>Enforce our Terms of Service</li>
            </ul>

            <h2>4. Data Security</h2>
            
            <p>
              We implement appropriate technical and organizational measures to protect your information:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>

            <p>
              While we strive to protect your information, no method of transmission or storage is 100% secure. 
              We cannot guarantee absolute security but will notify you of any material breaches as required by law.
            </p>

            <h2>5. Your Rights and Choices</h2>
            
            <h3>Account Management</h3>
            <ul>
              <li><strong>Access:</strong> View and download your personal information</li>
              <li><strong>Update:</strong> Modify your account information and preferences</li>
              <li><strong>Delete:</strong> Request deletion of your account and associated data</li>
              <li><strong>Export:</strong> Download your contributed content</li>
            </ul>

            <h3>Privacy Controls</h3>
            <ul>
              <li><strong>Email preferences:</strong> Control notification types and frequency</li>
              <li><strong>Profile visibility:</strong> Choose what information is public</li>
              <li><strong>Location sharing:</strong> Control whether your location is used for recommendations</li>
              <li><strong>Analytics:</strong> Opt out of certain tracking and analytics</li>
            </ul>

            <h3>European Users (GDPR)</h3>
            <p>
              If you're in the European Economic Area, you have additional rights:
            </p>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>

            <h2>6. Cookies and Tracking Technologies</h2>
            
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul>
              <li>Keep you signed in</li>
              <li>Remember your preferences</li>
              <li>Analyze how you use our service</li>
              <li>Provide personalized content</li>
              <li>Improve our platform</li>
            </ul>

            <p>
              You can control cookies through your browser settings. Note that disabling cookies may affect 
              some functionality of our service.
            </p>

            <h2>7. Children's Privacy</h2>
            
            <p>
              Our service is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If we become aware that we have collected personal 
              information from a child under 13, we will take steps to delete such information.
            </p>

            <h2>8. International Data Transfers</h2>
            
            <p>
              WorldPianos is based in the United States. If you access our service from outside the US, 
              your information may be transferred to, stored, and processed in the US or other countries 
              where our service providers operate. We ensure appropriate safeguards are in place for 
              international transfers.
            </p>

            <h2>9. Data Retention</h2>
            
            <p>
              We retain your information for as long as necessary to provide our service and fulfill 
              the purposes outlined in this policy. Specifically:
            </p>
            <ul>
              <li>Account information: Until you delete your account</li>
              <li>Piano and event data: Indefinitely (as part of our public database)</li>
              <li>Usage data: Up to 2 years for analytics purposes</li>
              <li>Support communications: Up to 3 years</li>
            </ul>

            <h2>10. Changes to This Policy</h2>
            
            <p>
              We may update this privacy policy from time to time. We will notify you of material changes by:
            </p>
            <ul>
              <li>Posting the updated policy on our website</li>
              <li>Sending an email notification to registered users</li>
              <li>Displaying a notice on our platform</li>
            </ul>

            <p>
              Continued use of our service after changes take effect constitutes acceptance of the updated policy.
            </p>

            <h2>11. Contact Us</h2>
            
            <p>
              If you have questions about this privacy policy or our data practices, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> privacy@worldpianos.org</li>
              <li><strong>Mail:</strong> WorldPianos Privacy Team, 123 Music Street, San Francisco, CA 94102</li>
              <li><strong>Contact Form:</strong> <a href="/contact">worldpianos.org/contact</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="card bg-primary text-primary-content shadow-xl mt-12">
            <div className="card-body text-center">
              <h2 className="card-title text-2xl justify-center mb-4">
                <Mail className="w-6 h-6" />
                Questions About Your Privacy?
              </h2>
              <p className="mb-6 opacity-90">
                We're committed to transparency and protecting your privacy. 
                Contact us if you have any questions or concerns.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/contact" className="btn btn-accent">
                  Contact Privacy Team
                </a>
                <a href="mailto:privacy@worldpianos.org" className="btn btn-outline text-white border-white hover:bg-white hover:text-primary">
                  Email Us Directly
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}