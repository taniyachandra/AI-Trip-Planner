import { createContext } from "react";   // ✅ Sahi import
import { TripInfo } from "../create-new-trip/_components/ChatBox";

 export type TripDetailContextType = {
    tripDetailInfo:TripInfo | null,
    setTripDetailInfo: React.Dispatch<React.SetStateAction<TripInfo | null>>;
}


export const TripDetailContext = createContext<TripDetailContextType | undefined>(undefined);