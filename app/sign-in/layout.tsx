import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "@/styles/globals.css";

const inter = Mulish({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Whispered Words",
  description:
    "A web application, an automatic speech recognition (ASR) system, for efficient and accurate voice transcription.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`" h-screen w-full bg-black " ${inter.className} `}>
      {children}
    </div>
  );
}
