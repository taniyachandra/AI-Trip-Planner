'use client'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

function SelectDaysUi({ onSelectOption }: any) {
  const [days, setDays] = useState(3)

  const increment = () => setDays((prev) => Math.min(prev + 1, 30))
  const decrement = () => setDays((prev) => Math.max(prev - 1, 1))

  return (
    <div className='p-4 border rounded-2xl bg-white mt-2 flex flex-col items-center gap-4 w-full'>
      <h2 className='text-base font-semibold text-gray-700'>
        How many days do you want to travel?
      </h2>

      <div className='flex items-center gap-6'>
        <button
          onClick={decrement}
          className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xl font-bold hover:bg-gray-100'
        >
          −
        </button>

        <span className='text-2xl font-bold text-primary min-w-20 text-center'>
          {days} {days === 1 ? 'Day' : 'Days'}
        </span>

        <button
          onClick={increment}
          className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xl font-bold hover:bg-gray-100'
        >
          +
        </button>
      </div>

      <Button
        className='mt-1'
        onClick={() => onSelectOption(`${days} days`)}
      >
        Confirm
      </Button>
    </div>
  )
}

export default SelectDaysUi