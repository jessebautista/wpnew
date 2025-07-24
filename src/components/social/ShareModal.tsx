import { useState } from 'react'
import { 
  X,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  Send,
  Mail,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Download
} from 'lucide-react'
import { SocialSharingService, type ShareData, type SocialPlatform } from '../../services/socialSharingService'
import { useAuth } from '../auth/AuthProvider'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareData: ShareData
  contentType: 'piano' | 'event' | 'blog_post'
  contentId: string
}

const platformConfig = {
  facebook: {
    icon: Facebook,
    label: 'Facebook',
    description: 'Share with your friends',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
  },
  twitter: {
    icon: Twitter,
    label: 'Twitter',
    description: 'Tweet to your followers',
    color: 'text-sky-500',
    bgColor: 'bg-sky-50 hover:bg-sky-100 border-sky-200'
  },
  linkedin: {
    icon: Linkedin,
    label: 'LinkedIn',
    description: 'Share professionally',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
  },
  reddit: {
    icon: MessageSquare,
    label: 'Reddit',
    description: 'Post to communities',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100 border-orange-200'
  },
  whatsapp: {
    icon: MessageSquare,
    label: 'WhatsApp',
    description: 'Send to contacts',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100 border-green-200'
  },
  telegram: {
    icon: Send,
    label: 'Telegram',
    description: 'Send via Telegram',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
  },
  email: {
    icon: Mail,
    label: 'Email',
    description: 'Send via email',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 hover:bg-gray-100 border-gray-200'
  }
}

export function ShareModal({ isOpen, onClose, shareData, contentType, contentId }: ShareModalProps) {
  const { user } = useAuth()
  const [copiedLink, setCopiedLink] = useState(false)
  const [customMessage, setCustomMessage] = useState(shareData.text)
  const [showQRCode, setShowQRCode] = useState(false)

  const handlePlatformShare = (platform: SocialPlatform) => {
    const customShareData = {
      ...shareData,
      text: customMessage
    }

    SocialSharingService.shareToPlatform(platform, customShareData)
    SocialSharingService.trackShare(platform, contentType, contentId, user?.id)
  }

  const handleCopyLink = async () => {
    const success = await SocialSharingService.copyToClipboard({
      ...shareData,
      text: customMessage
    })
    
    if (success) {
      setCopiedLink(true)
      SocialSharingService.trackShare('copy', contentType, contentId, user?.id)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  const generateQRCode = () => {
    // Simple QR code generation using a free service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareData.url)}`
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">Share this {contentType.replace('_', ' ')}</h3>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview */}
        <div className="bg-base-200 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-2">{shareData.title}</h4>
          <p className="text-sm text-base-content/70 mb-2">{shareData.url}</p>
          {shareData.image && (
            <div className="w-full h-32 bg-base-300 rounded flex items-center justify-center">
              <img 
                src={shareData.image} 
                alt="Preview" 
                className="max-h-full max-w-full object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Custom Message */}
        <div className="mb-6">
          <label className="label">
            <span className="label-text font-medium">Customize your message</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-20"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Add your personal message..."
          />
          <div className="label">
            <span className="label-text-alt text-base-content/60">
              {customMessage.length}/280 characters
            </span>
          </div>
        </div>

        {/* Platform Options */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Share on social media</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(platformConfig).map(([platform, config]) => {
              const Icon = config.icon
              return (
                <button
                  key={platform}
                  onClick={() => handlePlatformShare(platform as SocialPlatform)}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${config.bgColor}`}
                >
                  <Icon className={`w-6 h-6 ${config.color}`} />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{config.label}</div>
                    <div className="text-sm text-base-content/60">{config.description}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-base-content/40" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Copy Link */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Or copy link</h4>
          <div className="flex gap-2">
            <input
              type="text"
              className="input input-bordered flex-1"
              value={shareData.url}
              readOnly
            />
            <button
              onClick={handleCopyLink}
              className={`btn ${copiedLink ? 'btn-success' : 'btn-outline'}`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">QR Code</h4>
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              className="btn btn-ghost btn-sm"
            >
              <QrCode className="w-4 h-4 mr-2" />
              {showQRCode ? 'Hide' : 'Show'} QR Code
            </button>
          </div>
          
          {showQRCode && (
            <div className="flex flex-col items-center gap-4 p-4 bg-base-200 rounded-lg">
              <img 
                src={generateQRCode()} 
                alt="QR Code" 
                className="border rounded"
              />
              <div className="flex gap-2">
                <a
                  href={generateQRCode()}
                  download={`worldpianos-qr-${contentId}.png`}
                  className="btn btn-outline btn-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR
                </a>
              </div>
              <p className="text-xs text-center text-base-content/60">
                Scan with any QR code reader to visit this page
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-action">
          <button onClick={onClose} className="btn">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}