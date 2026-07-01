'use client'
import React, { useContext, useEffect, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { UserDetailContext } from "./context/UserDetailContext"
import { TripDetailContext,  TripDetailContextType } from "./context/TripDetailContext"
// import Header from "./_components/Header"
import { TripInfo, UserDetailContextType } from "./create-new-trip/_components/ChatBox"

function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const CreateUser = useMutation(api.users.CreateNewUser);
  const [userDetail, setUserDetail] = useState<any>();
  const [tripDetailInfo, setTripDetailInfo] = useState<TripInfo | null>(null);
  const { user } = useUser();

  const CreateNewUser = async () => {
    if (user) {
      const result = await CreateUser({
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: user?.imageUrl ?? "",
        name: user?.fullName ?? ""
      });
      setUserDetail(result);
    }
  }

  useEffect(() => {
    if (user) { CreateNewUser(); }
  }, [user]);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <TripDetailContext.Provider value={{ tripDetailInfo, setTripDetailInfo }}>
        
          {/* <Header /> */}
        {children}
      </TripDetailContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default Provider

export const useUserDetail = () => { return useContext(UserDetailContext); }
export const useTripDetail = ():TripDetailContextType | undefined => { return useContext(TripDetailContext); }
