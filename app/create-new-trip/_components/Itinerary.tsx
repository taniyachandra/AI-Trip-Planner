'use client'
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { Timeline } from "@/components/ui/timeline";
import HotelCardItem from './HotelCardItem';
import PlaceCardItem from './PlaceCardItem';
import { useTripDetail } from '@/app/provider';
import { Activity, TripInfo } from './ChatBox';
import { ArrowLeft } from 'lucide-react';

function Itinerary() {
    //@ts-ignore,
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const [tripData, setTripData] = useState<TripInfo |null>(null);

  useEffect(() => {
    tripDetailInfo && console.log("Trip Detail Info:", tripDetailInfo);
    }, [tripDetailInfo]
    )

  const data = tripDetailInfo ? [
    {
      title: "Hotels",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tripDetailInfo?.hotels?.map((hotel, index) => (
            <HotelCardItem key={index} hotel={hotel} />
          ))}
        </div>
      ),
    },
    ...(tripDetailInfo?.itinerary?.map((dayData) => ({
      title: `Day ${dayData?.day}`,
      content: (
        <div className="flex flex-col gap-5">
          <p className='text-primary font-bold'>
            Best Time: {dayData?.best_time_to_visit_day}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {dayData?.activities?.map((activity: Activity, index: number) => (
              <PlaceCardItem key={index} activity={activity} />
            ))}
          </div>
        </div>
      ),
    })) ?? []),
  ] : [];

 return (
  <div>
    {!tripDetailInfo ? (
      <div className="relative w-full h-screen overflow-hidden rounded-3xl">
        <h2 className='flex text-3xl text-white left-20 gap-2 items-center absolute bottom-23 z-10'>
          <ArrowLeft/>Getting to know you to build perfect trip here...
        </h2>
        <Image
          src={'/travel.jpg'}
          alt="travel"
          fill
          priority
          className="object-cover"
        />
      </div>
    ) : (
      <div className="p-6">
        <Timeline data={data} tripData={tripDetailInfo} />
      </div>
    )}
  </div>
);
}

export default Itinerary