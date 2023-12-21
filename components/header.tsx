import React from "react";
import { Span } from "./ui/text";

export default function Header() {
  return (
    <header className="flex items-center py-6 px-6 sm:py-8 sm:px-24">
      <Span className=" text-2xl mr-1 text-gradient">🌬️</Span>
      <Span className="text-xl font-semibold text-gradient ">
        Whispered Words
      </Span>
    </header>
  );
}
