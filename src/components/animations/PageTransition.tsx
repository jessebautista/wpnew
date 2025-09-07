import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Wrapper for AnimatePresence with page transitions
interface AnimatedPageProps {
  children: ReactNode
  key?: string
  className?: string
}

export function AnimatedPage({ children, key, className }: AnimatedPageProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={key} className={className}>
        {children}
      </PageTransition>
    </AnimatePresence>
  )
}

// Staggered container for animating children
export function StaggerContainer({ children, className = '', delay = 0.1 }: { 
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

// Individual staggered item
export function StaggerItem({ children, className = '' }: { 
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            type: 'tween',
            ease: 'easeOut',
            duration: 0.3
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}