import React, { useEffect, useState } from 'react'
import { Trip } from '../page'
import Image from "next/image";
import Link from 'next/link';
import { ArrowBigRightIcon } from 'lucide-react';
import axios from 'axios';

type Props={
    trip:Trip
}

function MyTripCardItem({trip}:Props) {
      const [photoUrl, setPhotoUrl] = useState<string>('/placeholder.jpg');
        useEffect(()=>{
          trip && GetGooglePlaceDetail();
        },[trip])
      
      const GetGooglePlaceDetail = async () => {
        const result = await axios.post('/api/google-place-details', { 
        //   placeName :trip?.tripDetail?.itinerary[0]?.activities[0].place_name
        placeName: trip?.tripDetail?.destination
        });
        if(result?.data?.e){
        return;
        }
      
        setPhotoUrl(result?.data?.PhotoRefUrl); 
      }
  return (
    <Link href={'/view-trip/'+trip?.tripId} className='p-5 shadow rounded-2xl'>
               <Image src={photoUrl?photoUrl:'/placeholder.jpg'} alt={trip.tripId} width={200} height={200}
               className='rounded-2xl object-cover w-full h-[270px]' />
               <h2 className='flex gap-2 font-semibold text-xl mt-2'>{trip?.tripDetail?.origin}<ArrowBigRightIcon/>{trip?.tripDetail?.destination}</h2>
               <h2 className='mt-2 text-gray-500'>{trip?.tripDetail?.duration} Trip With {trip?.tripDetail?.budget} Budget</h2>
           </Link>
  )
}

export default MyTripCardItem