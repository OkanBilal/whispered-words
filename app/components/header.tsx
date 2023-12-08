import React from "react";

export default function Header() {
  return (
    <header className="flex items-center p-8">
      <span
        className="text-xl font-semibold animate-text-gradient bg-gradient-to-r from-[#cad7ff] via-[#0141ff] to-[#94aefb] 
    bg-[200%_auto] bg-clip-text text-transparent"
      >
        🌬️ Whispered Words
      </span>
    </header>
  );
}
