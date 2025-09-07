import { motion } from 'framer-motion'
import { ReactNode } from 'react'

// Animated card with hover effects
interface AnimatedCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  whileHover?: boolean
  delay?: number
}

export function AnimatedCard({ 
  children, 
  className = '', 
  onClick, 
  whileHover = true,
  delay = 0 
}: AnimatedCardProps) {
  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay, duration: 0.3, ease: 'easeOut' }
      }}
      whileHover={whileHover ? {
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeInOut' }
      } : {}}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  )
}

// Animated button
interface AnimatedButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
}

export function AnimatedButton({ 
  children, 
  className = '', 
  onClick, 
  disabled = false,
  variant = 'primary'
}: AnimatedButtonProps) {
  return (
    <motion.button
      className={`btn ${variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-outline'} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { 
        scale: 1.05,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.button>
  )
}

// Loading spinner with animation
export function AnimatedSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'loading-sm' : size === 'lg' ? 'loading-lg' : ''
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.3 }
      }}
      className="flex justify-center items-center p-4"
    >
      <span className={`loading loading-spinner ${sizeClass}`}></span>
    </motion.div>
  )
}

// Fade in animation for content
interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function FadeIn({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up' 
}: FadeInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 20 }
      case 'down': return { y: -20 }
      case 'left': return { x: -20 }
      case 'right': return { x: 20 }
      default: return { y: 20 }
    }
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: 0,
        transition: { 
          delay, 
          duration: 0.5, 
          ease: 'easeOut' 
        }
      }}
    >
      {children}
    </motion.div>
  )
}

// Scale animation for modals and overlays
interface ScaleAnimationProps {
  children: ReactNode
  className?: string
  isVisible: boolean
}

export function ScaleAnimation({ children, className = '', isVisible }: ScaleAnimationProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isVisible ? {
        opacity: 1,
        scale: 1,
        transition: { 
          duration: 0.3,
          ease: [0.23, 1, 0.32, 1] // Custom easing for smooth feel
        }
      } : {
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  )
}

// Slide in animation
interface SlideInProps {
  children: ReactNode
  className?: string
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
}

export function SlideIn({ 
  children, 
  className = '', 
  direction = 'left',
  delay = 0 
}: SlideInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -50 }
      case 'right': return { x: 50 }
      case 'up': return { y: -50 }
      case 'down': return { y: 50 }
      default: return { x: -50 }
    }
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: 0,
        transition: { 
          delay, 
          duration: 0.4, 
          ease: 'easeOut' 
        }
      }}
    >
      {children}
    </motion.div>
  )
}