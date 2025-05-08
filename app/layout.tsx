import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import ReduxProvider from "@/components/ReduxProvider";

const inter = Mulish({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Whispered Words",
//   description:
//     "A web application, an automatic speech recognition (ASR) system, for efficient and accurate voice transcription.",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ReduxProvider>
        <body
          className={`"absolute inset-0 h-full w-full bg-black bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:32px_32px] " ${inter.className} `}
        >
          <main className="relative ">{children}</main>
          <Toaster richColors />
        </body>
      </ReduxProvider>
    </html>
  );
}
