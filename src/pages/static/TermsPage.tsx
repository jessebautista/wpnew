import { useLanguage } from '../../contexts/LanguageContext'
import { Scale, Shield, Users, AlertTriangle, Mail, FileText } from 'lucide-react'

export function TermsPage() {
  const { t } = useLanguage()

  const lastUpdated = 'January 15, 2024'

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl opacity-90">
              The terms and conditions that govern your use of WorldPianos and our community.
            </p>
            <p className="text-sm opacity-75 mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Important Notice */}
          <div className="alert alert-info mb-12">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h3 className="font-bold">Please Read Carefully</h3>
              <div className="text-sm">
                By using WorldPianos, you agree to these terms. If you don't agree with any part of these terms, 
                please don't use our service.
              </div>
            </div>
          </div>

          {/* Quick Overview */}
          <div className="card bg-base-100 shadow-xl mb-12">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">
                <FileText className="w-6 h-6" />
                Key Points
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Community-Driven</h3>
                    <p className="text-sm text-base-content/70">Be respectful, accurate, and helpful in your contributions to our community.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Your Safety</h3>
                    <p className="text-sm text-base-content/70">Use pianos at your own risk. We help connect you but don't control the pianos themselves.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Fair Use</h3>
                    <p className="text-sm text-base-content/70">Don't spam, harass, or misuse our platform. Respect intellectual property rights.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Get Help</h3>
                    <p className="text-sm text-base-content/70">Questions about these terms? Contact us - we're here to help clarify anything.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Terms */}
          <div className="prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to WorldPianos! These Terms of Service ("Terms") govern your use of our website, 
              mobile application, and related services (collectively, the "Service") operated by WorldPianos 
              ("we," "us," or "our").
            </p>
            <p>
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree 
              with any part of these terms, then you may not access the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              WorldPianos is a community-driven platform that helps people discover, share, and connect 
              around public pianos worldwide. Our Service includes:
            </p>
            <ul>
              <li>A database of public piano locations</li>
              <li>Community-generated content including reviews, photos, and descriptions</li>
              <li>Event organization and discovery tools</li>
              <li>Social features for connecting piano enthusiasts</li>
              <li>Resources and information about public pianos</li>
            </ul>

            <h2>3. User Accounts</h2>
            
            <h3>Account Creation</h3>
            <p>
              To access certain features, you must create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information as needed</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Take responsibility for all activities under your account</li>
            </ul>

            <h3>Account Eligibility</h3>
            <p>
              You must be at least 13 years old to create an account. If you are under 18, 
              you represent that you have your parent or guardian's permission to use the Service.
            </p>

            <h2>4. User Content and Conduct</h2>
            
            <h3>Content You Submit</h3>
            <p>
              You may submit various types of content to our Service, including:
            </p>
            <ul>
              <li>Piano location information and descriptions</li>
              <li>Photos and videos</li>
              <li>Reviews and comments</li>
              <li>Event information</li>
              <li>Profile information</li>
            </ul>

            <h3>Content Guidelines</h3>
            <p>
              All content you submit must:
            </p>
            <ul>
              <li>Be accurate and truthful</li>
              <li>Not violate any laws or regulations</li>
              <li>Not infringe on intellectual property rights</li>
              <li>Not contain harmful, offensive, or inappropriate material</li>
              <li>Not include spam or unauthorized advertising</li>
              <li>Respect the privacy of others</li>
            </ul>

            <h3>Prohibited Conduct</h3>
            <p>
              You agree not to:
            </p>
            <ul>
              <li>Harass, threaten, or abuse other users</li>
              <li>Create multiple accounts to evade restrictions</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to access or scrape our Service</li>
              <li>Interfere with or disrupt the Service's operation</li>
              <li>Post false, misleading, or fraudulent information</li>
              <li>Engage in any activity that could harm minors</li>
            </ul>

            <h2>5. Content Ownership and License</h2>
            
            <h3>Your Content</h3>
            <p>
              You retain ownership of content you submit to WorldPianos. However, by submitting content, 
              you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, 
              publish, and distribute your content for the purpose of operating and improving our Service.
            </p>

            <h3>Our Content</h3>
            <p>
              The Service and its original content, features, and functionality are owned by WorldPianos 
              and are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>

            <h2>6. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the Service, to understand our practices regarding the collection, use, 
              and disclosure of your personal information.
            </p>

            <h2>7. Safety and Disclaimers</h2>
            
            <h3>Use at Your Own Risk</h3>
            <p>
              Public pianos are located in various environments and conditions. You use them at your own risk. 
              We are not responsible for:
            </p>
            <ul>
              <li>The safety, condition, or maintenance of pianos</li>
              <li>Injuries that may occur while using pianos</li>
              <li>Theft or damage to personal property</li>
              <li>Interactions with other users or third parties</li>
              <li>The accuracy of user-generated location information</li>
            </ul>

            <h3>No Warranties</h3>
            <p>
              The Service is provided "as is" and "as available" without warranties of any kind. 
              We disclaim all warranties, express or implied, including but not limited to warranties 
              of merchantability, fitness for a particular purpose, and non-infringement.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, WorldPianos shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
              whether incurred directly or indirectly, or any loss of data, use, goodwill, or other 
              intangible losses resulting from your use of the Service.
            </p>

            <h2>9. Moderation and Enforcement</h2>
            
            <h3>Content Review</h3>
            <p>
              We reserve the right to review, moderate, or remove any content that violates these Terms 
              or our community guidelines. However, we are not obligated to monitor all content and 
              cannot guarantee the accuracy or appropriateness of user-generated content.
            </p>

            <h3>Account Suspension</h3>
            <p>
              We may suspend or terminate your account if you violate these Terms or engage in behavior 
              that harms our community. We will generally provide notice and an opportunity to correct 
              violations, except in cases of severe misconduct.
            </p>

            <h2>10. Intellectual Property</h2>
            
            <h3>Respecting Others' Rights</h3>
            <p>
              We respect intellectual property rights and expect our users to do the same. If you believe 
              your copyright has been infringed, please contact us with:
            </p>
            <ul>
              <li>A description of the copyrighted work</li>
              <li>The location of the infringing material on our Service</li>
              <li>Your contact information</li>
              <li>A statement of good faith belief that use is not authorized</li>
              <li>A statement that the information is accurate and you're authorized to act</li>
            </ul>

            <h2>11. Third-Party Services</h2>
            <p>
              Our Service may contain links to third-party websites or services that are not owned or 
              controlled by WorldPianos. We have no control over and assume no responsibility for the 
              content, privacy policies, or practices of any third-party websites or services.
            </p>

            <h2>12. Termination</h2>
            <p>
              You may terminate your account at any time by contacting us or using account deletion 
              features in the Service. We may terminate or suspend your account immediately, without 
              prior notice, for conduct that we believe violates these Terms or is harmful to other 
              users or our Service.
            </p>

            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of material 
              changes by email or through the Service. Your continued use of the Service after changes 
              take effect constitutes acceptance of the new Terms.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the State of 
              California, United States, without regard to its conflict of law principles. Any disputes 
              arising under these Terms will be subject to the exclusive jurisdiction of the courts 
              located in San Francisco County, California.
            </p>

            <h2>15. Severability</h2>
            <p>
              If any provision of these Terms is held to be invalid or unenforceable, the remaining 
              provisions will remain in full force and effect. The invalid or unenforceable provision 
              will be replaced with a valid provision that best approximates the intent of the original.
            </p>

            <h2>16. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> legal@worldpianos.org</li>
              <li><strong>Mail:</strong> WorldPianos Legal Team, 123 Music Street, San Francisco, CA 94102</li>
              <li><strong>Contact Form:</strong> <a href="/contact">worldpianos.org/contact</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="card bg-primary text-primary-content shadow-xl mt-12">
            <div className="card-body text-center">
              <h2 className="card-title text-2xl justify-center mb-4">
                <Mail className="w-6 h-6" />
                Questions About These Terms?
              </h2>
              <p className="mb-6 opacity-90">
                We're here to help you understand your rights and responsibilities. 
                Don't hesitate to reach out if anything is unclear.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/contact" className="btn btn-accent">
                  Contact Legal Team
                </a>
                <a href="mailto:legal@worldpianos.org" className="btn btn-outline text-white border-white hover:bg-white hover:text-primary">
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