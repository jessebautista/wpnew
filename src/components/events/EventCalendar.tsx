import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { generateEventSlug } from '../../utils/slugUtils'
import type { Event } from '../../types'

interface EventCalendarProps {
  events: Event[]
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  events: Event[]
  isToday: boolean
  isSelected: boolean
}

export function EventCalendar({ events, onDateSelect, selectedDate }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])

  useEffect(() => {
    generateCalendarDays()
  }, [currentDate, events, selectedDate])

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Get first day of the month and calculate start of calendar
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay()) // Start from Sunday
    
    // Get last day of the month and calculate end of calendar
    const lastDay = new Date(year, month + 1, 0)
    const endDate = new Date(lastDay)
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay())) // End on Saturday
    
    const days: CalendarDay[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate.toDateString() === date.toDateString()
      })
      
      const isSelected = selectedDate ? date.toDateString() === selectedDate.toDateString() : false
      
      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        events: dayEvents,
        isToday: date.toDateString() === today.toDateString(),
        isSelected
      })
    }
    
    setCalendarDays(days)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date)
    }
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title">
            <CalendarIcon className="w-5 h-5" />
            Event Calendar
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="btn btn-ghost btn-sm btn-square"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold min-w-fit">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="btn btn-ghost btn-sm btn-square"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-base-content/70">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day.date)}
              className={`
                relative p-2 min-h-[60px] cursor-pointer border border-base-300 rounded-lg
                hover:bg-base-200 transition-colors
                ${!day.isCurrentMonth ? 'opacity-30' : ''}
                ${day.isToday ? 'bg-primary/10 border-primary' : ''}
                ${day.isSelected ? 'bg-secondary/20 border-secondary' : ''}
              `}
            >
              {/* Date Number */}
              <div className={`
                text-sm font-medium mb-1
                ${day.isToday ? 'text-primary font-bold' : ''}
                ${day.isSelected ? 'text-secondary font-bold' : ''}
              `}>
                {day.date.getDate()}
              </div>
              
              {/* Event Indicators */}
              {day.events.length > 0 && (
                <div className="space-y-1">
                  {day.events.slice(0, 2).map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${generateEventSlug(event.title, event.id, event.date)}`}
                      className="block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={`
                        text-xs px-1 py-0.5 rounded truncate
                        ${event.category === 'Concert' ? 'bg-purple-100 text-purple-800' :
                          event.category === 'Meetup' ? 'bg-blue-100 text-blue-800' :
                          event.category === 'Workshop' ? 'bg-green-100 text-green-800' :
                          event.category === 'Festival' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {event.title}
                      </div>
                    </Link>
                  ))}
                  {day.events.length > 2 && (
                    <div className="text-xs text-base-content/50 px-1">
                      +{day.events.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-base-300">
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-100 rounded"></div>
              <span>Concert</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 rounded"></div>
              <span>Meetup</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 rounded"></div>
              <span>Workshop</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 rounded"></div>
              <span>Festival</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}