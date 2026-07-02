'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Clock, ExternalLink, Ticket } from 'lucide-react';
import NavLink from "next/link";
import { Button } from '@/components/ui/button';
import { Activity } from './ChatBox';
import axios from 'axios';
 type Props={
    activity:Activity
}
function PlaceCardItem({activity}:Props) {
    const [photoUrl, setPhotoUrl] = useState<string>('/placeholder.jpg');
    useEffect(()=>{
      activity && GetGooglePlaceDetail();
    },[activity])
  
  const GetGooglePlaceDetail = async () => {
    const result = await axios.post('/api/google-place-details', { 
      placeName :activity.place_name+":"+activity?.place_address
    });
    if(result?.data?.e){
    return;
    }
  
    setPhotoUrl(result?.data?.PhotoRefUrl); 
  }
  return (
    <div className="flex flex-col gap-2 border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow bg-white">
                {/* <Image src={photoUrl?photoUrl: '/placeholder.jpg'} alt='placeholder' width={220} height={140}
                className='object-cover rounded-xl' /> */}
                  <Image src={photoUrl?photoUrl: '/placeholder.jpg'} alt='placeholder' width={300} height={160} 
                                         className="rounded-xl  shadow object-cover w-full md-2"
/>
                <h2 className="text-lg font-semibold">{activity.place_name}</h2>
                <p className="text-gray-500 line-clamp-2">{activity.place_details}</p>
               <h2 className="flex gap-2 text-blue-600 line-clamp-1"><Ticket/> {activity?.ticket_pricing || "Free"}</h2>
                <p className="flex text-orange-400 gap-2 line-clamp-1"> <Clock/> {activity?.time_travel_each_location}</p>
                {/* <Link href={'https://www.google.com/maps/search/?api=1&query='+ activity.place_name} target="_blank">
                    <Button size={'sm'} variant="outline" className="w-full mt-2">View <ExternalLink /></Button>
                </Link> */}
           <NavLink 
  href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(activity.place_name)} 
  target="_blank"
>
  <Button size={'sm'} variant="outline" className="w-full mt-2">
    View <ExternalLink />
  </Button>
</NavLink>


            </div>
  )
}

export default PlaceCardItem