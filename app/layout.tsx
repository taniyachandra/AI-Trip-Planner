import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Header from "./_components/Header";
export const metadata: Metadata = {
  title: "AI Trip Planner",
  description: "AI Trip Planner App",
};
const outfit = Outfit({subsets:["latin"]})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <ClerkProvider>
    <html lang="en">
      <body className={outfit.className}>
        <ConvexClientProvider>
          <Provider>
            <Header/>
            {children}
          </Provider>
        </ConvexClientProvider>
      </body>
    </html>
   </ClerkProvider>
  );
}
