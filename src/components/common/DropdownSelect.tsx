import { useEffect, useRef, useState } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface DropdownSelectProps {
  label?: string
  placeholder?: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  className?: string
  buttonClassName?: string
  menuClassName?: string
}

export function DropdownSelect({
  label,
  placeholder = 'Select...',
  value,
  options,
  onChange,
  className = '',
  buttonClassName = '',
  menuClassName = ''
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const handleSelect = (val: string) => {
    onChange(val)
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prev => !prev)
  }

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}
      <div className={`dropdown w-full ${open ? 'dropdown-open' : ''}`}>
        <button
          type="button"
          className={`btn btn-lg btn-outline justify-between w-full text-left ${buttonClassName}`}
          onClick={handleToggle}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={`${selected ? '' : 'text-base-content/60'}`}>
            {selected ? selected.label : placeholder}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
        {open && (
          <ul
            key="dropdown-list"
            className={`menu menu-lg dropdown-content z-50 mt-2 p-2 shadow bg-base-100 rounded-box w-full max-h-[400px] overflow-y-auto ${menuClassName}`}
            role="listbox"
            tabIndex={0}
            onWheel={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              // Allow touch events for scrolling
              e.stopPropagation()
            }}
            onTouchMove={(e) => {
              // Allow touch scrolling within dropdown
              const ul = e.currentTarget
              const isScrollable = ul.scrollHeight > ul.clientHeight
              if (isScrollable) {
                e.stopPropagation()
              }
            }}
            style={{ 
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              touchAction: 'pan-y',
              willChange: 'scroll-position',
              display: 'block',
              overflowY: 'auto',
              maxHeight: 'min(60vh, 400px)'
            }}
          >
            {options.map(opt => (
              <li key={opt.value}>
                <button
                  type="button"
                  className={`justify-start ${value === opt.value ? 'active' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                  role="option"
                  aria-selected={value === opt.value}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
