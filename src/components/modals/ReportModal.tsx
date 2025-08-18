import { useState } from 'react'
import { X, Flag, AlertTriangle } from 'lucide-react'
import { ReportService, REPORT_REASONS, type ReportReason } from '../../services/reportService'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  contentType: 'piano' | 'event' | 'blog_post'
  contentId: string
  contentTitle: string
  userId?: string | null
}

export function ReportModal({ 
  isOpen, 
  onClose, 
  contentType, 
  contentId, 
  contentTitle,
  userId 
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedReason) {
      setError('Please select a reason for reporting')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      await ReportService.submitReport(
        contentType,
        contentId,
        selectedReason as ReportReason,
        description || undefined,
        userId
      )

      setSubmitted(true)
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)
    } catch (error: any) {
      console.error('Error submitting report:', error)
      if (error.code === '23505') {
        setError('You have already reported this content.')
      } else {
        setError('Failed to submit report. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedReason('')
    setDescription('')
    setSubmitted(false)
    setError('')
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        <button
          onClick={handleClose}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="text-success text-6xl mb-4">✓</div>
            <h3 className="text-lg font-bold mb-2">Report Submitted</h3>
            <p className="text-base-content/70">
              Thank you for helping keep our community safe. We'll review your report shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <Flag className="w-6 h-6 text-error" />
              <div>
                <h3 className="text-lg font-bold">Report Content</h3>
                <p className="text-sm text-base-content/70">
                  Reporting: {contentTitle}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Reason for reporting *</span>
                </label>
                <div className="space-y-2">
                  {REPORT_REASONS.map((reason) => (
                    <label key={reason} className="label cursor-pointer justify-start gap-3">
                      <input
                        type="radio"
                        name="reason"
                        className="radio radio-primary"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={(e) => setSelectedReason(e.target.value as ReportReason)}
                      />
                      <span className="label-text">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Additional details (optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24 resize-none"
                  placeholder="Please provide any additional information about this report..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    {description.length}/500 characters
                  </span>
                </label>
              </div>

              {error && (
                <div className="alert alert-error">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="modal-action">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-ghost"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-error"
                  disabled={submitting || !selectedReason}
                >
                  {submitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Flag className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}