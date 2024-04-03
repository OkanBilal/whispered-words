"use  client";

import React, { ReactNode } from "react";
import { Span } from "./text";

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
};

const ShootingStarButton = (props: ButtonProps) => {
  return (
    <button
      disabled={props.disabled}
      type="submit"
      className="group relative max-h-12 grid overflow-hidden rounded-full px-6 py-2 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200"
    >
      <Span>
        <Span className="spark mask-gradient animate-flip before:animate-rotate absolute inset-0 h-[100%] w-[100%] overflow-hidden rounded-full [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
      </Span>
      <Span
        className={`backdrop absolute inset-[1px] rounded-full bg-black transition-colors duration-200 ${
          props.disabled ? "group-hover:bg-black" : "group-hover:bg-slate-800"
        }`}
      />
      <Span
        className={`z-10 ${
          props.disabled ? "text-[#606060]" : "text-[#f0f0f0]"
        } `}
      >
        {props.children}
      </Span>
    </button>
  );
};

export default ShootingStarButton;
