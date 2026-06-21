'use client'
import { Button } from '@/components/ui/button'
import { Globe2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'

// ---------- types ----------
type DayPlan = {
  day: number
  title?: string
  activities: string[]
}

type TripData = {
  destination?: string
  duration?: string
  budget?: string
  groupSize?: string
  interests?: string
  itinerary?: DayPlan[]
  tips?: string[]
  summary?: string
}

// ---------- helpers ----------
const tryParseTrip = (raw: string): TripData | null => {
  try {
    // Sometimes the AI wraps JSON in a "tripPlan" key or sends raw object
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    return parsed?.tripPlan ?? parsed
  } catch {
    return null
  }
}

// ---------- component ----------
function FinalUi({ viewTrip, disable}:any) {
  const [trip, setTrip] = useState<TripData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!viewTrip) return
    const parsed = tryParseTrip(viewTrip)
    setTrip(parsed)
    setLoading(false)
  }, [viewTrip])

  // ---- Loading state (shown while AI is still responding) ----
  if (loading || !viewTrip) {
    return (
      <div className='flex flex-col items-center justify-center mt-6 p-6 bg-white rounded-2xl border'>
        <Globe2 className='text-primary text-4xl animate-bounce' />
        <h2 className='mt-3 text-lg font-semibold text-primary'>
          ✈️ Planning your dream trip...
        </h2>
        <p className='text-gray-500 text-sm text-center mt-1'>
          Gathering best destinations, activities, and travel details for you.
        </p>
        <Button disabled={disable} onClick={viewTrip}className='mt-2 w-full'>
          View Trip
        </Button>
      </div>
    )
  }

  // ---- Fallback: AI replied but JSON couldn't be parsed properly ----
  if (!trip) {
    return (
      <div className='mt-4 p-4 bg-white rounded-2xl border'>
        <p className='text-sm text-gray-600 whitespace-pre-wrap'>{viewTrip}</p>
      </div>
    )
  }

  // ---- Full itinerary display ----
  return (
    <div className='mt-4 p-4 bg-white rounded-2xl border space-y-4'>
      {/* Header */}
      <div className='flex items-center gap-2'>
        <Globe2 className='text-primary w-6 h-6' />
        <div>
          <h2 className='text-lg font-bold text-gray-800'>
            {trip.destination ?? 'Your Trip'}
          </h2>
          <p className='text-sm text-gray-500'>
            {[trip.duration, trip.budget, trip.groupSize]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
      </div>

      {/* Summary */}
      {trip.summary && (
        <p className='text-sm text-gray-600 bg-orange-50 p-3 rounded-xl'>
          {trip.summary}
        </p>
      )}

      {/* Day-by-day itinerary */}
      {trip.itinerary && trip.itinerary.length > 0 && (
        <div className='space-y-3'>
          <h3 className='font-semibold text-gray-700'>📅 Itinerary</h3>
          {trip.itinerary.map((day, i) => (
            <div key={i} className='border rounded-xl p-3'>
              <p className='font-semibold text-primary text-sm mb-1'>
                Day {day.day}{day.title ? ` — ${day.title}` : ''}
              </p>
              <ul className='list-disc list-inside space-y-1'>
                {day.activities.map((act, j) => (
                  <li key={j} className='text-sm text-gray-600'>
                    {act}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      {trip.tips && trip.tips.length > 0 && (
        <div>
          <h3 className='font-semibold text-gray-700 mb-2'>💡 Travel Tips</h3>
          <ul className='list-disc list-inside space-y-1'>
            {trip.tips.map((tip, i) => (
              <li key={i} className='text-sm text-gray-600'>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default FinalUi