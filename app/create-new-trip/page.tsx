import React, {  useState } from 'react'
import ChatBox from './_components/ChatBox'
import Itinerary from './_components/Itinerary'
// import { useTripDetail } from '../provider'

function CreateNewTrip() {
  return (
   <div className='grid grid-cols-1 md:grid-cols-5 gap-5 p-10'>
    <div className='md:col-span-2'>
     <ChatBox/>
    </div>
    <div className='md:col-span-3'>
    <Itinerary/>
    </div>
</div>
  )
}

export default CreateNewTrip