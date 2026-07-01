import { suggestions } from '@/app/_components/Hero'
import React from 'react'

function EmptyBoxState({onSelectOption}:any) {
  return (
    <div className='mt-3'>
        <h2 className='font-bold text-3xl text-center'>Start Planning New <strong className='text-primary'>Trip </strong>Using AI</h2>
        <p className='text-center text-gray-400 mt-2'> Discover personalized travel itineraries, find the best destinations, and plan your dream vacation effortlessly with the power of AI. let our smart assistant do the haed work while you enjoy the journey.</p>
            <div className='flex flex-col gap-2 mt-3'>
                {suggestions.map((suggestions,index)=>(
                    <div key={index} 
                    onClick={()=>onSelectOption(suggestions.title)}
                    className='flex item-center gap-2 border rounded-xl p-3 curser-pointer hover:border-primary hover:text-primary'>
                        {suggestions.icon}
                        <h2 className='text-lg '>{suggestions.title}</h2>
                    </div>
                ))}
               </div>
    </div>
  )
}

export default EmptyBoxState