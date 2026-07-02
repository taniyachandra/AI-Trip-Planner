'use client'
import Itinerary from '@/app/create-new-trip/_components/Itinerary';
import { Trip } from '@/app/my-trips/page';
import { useTripDetail, useUserDetail } from '@/app/provider';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function ViewTrip() {
    const {tripid}= useParams();
    const {userDetail, setUserDetail}=useUserDetail();
    const convex=useConvex();
    const[tripData, setTripData]=useState<Trip>();
    //@ts-ignore
     const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
    useEffect(()=>{
        userDetail && GetTrip();
    },[userDetail])


    const GetTrip=async ()=>{
    console.log("tripid from URL:", tripid);
    console.log("uid:", userDetail?._id);
    const result=await convex.query(api.tripDetail.GetTripById, {
        uid:userDetail?._id,
         tripid:tripid+''
        });
        console.log("result:", result);
        setTripData(result);
        setTripDetailInfo(result?.tripDetail);
}
  return (
    <div>
     <Itinerary/>

    </div>
  )
}

export default ViewTrip