'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Star, Wallet } from "lucide-react";
import { Button } from '@/components/ui/button';
import NavLink from "next/link";
import { Hotel } from './ChatBox';
import axios from 'axios';

type Props={
    hotel:Hotel
}

function HotelCardItem({hotel}:Props) {
  const [photoUrl, setPhotoUrl] = useState<string>('/placeholder.jpg');
  useEffect(()=>{
    hotel && GetGooglePlaceDetail();
  },[hotel])

const GetGooglePlaceDetail = async () => {
  const result = await axios.post('/api/google-place-details', { 
    placeName :hotel.hotel_name
  });
  if(result?.data?.e){
  return;
  }

  setPhotoUrl(result?.data?.PhotoRefUrl); 
}
    

  return (
      <div className="flex flex-col gap-2 border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow bg-white">
                         <Image src={photoUrl?photoUrl: '/placeholder.jpg'} alt='placeholder' width={300} height={160} 
                         className="rounded-xl  shadow object-cover w-full md-2"
                         />
                         <h2 className="text-lg font-semibold ">{hotel.hotel_name}</h2>
                         <h2 className=" text-gray-500">{hotel.hotel_address}</h2>
                         <div className="flex justify-between items-center">
                         <p className="flex gap-2 text-green-600"><Wallet/>{hotel.price_per_night}</p>
                         <p className=" text-yellow-500"><Star/> {hotel.rating}</p>
                         </div>
                         {/* <p className="line-clamp-2 text-gray-500">{hotel.description}</p> */}
                           <NavLink 
       href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(hotel?.hotel_name)} 
       target="_blank"
     >
        <Button variant="outline" className="w-full mt-1">View </Button>
     </NavLink>
                     </div>
  )
}

export default HotelCardItem