"use client";

import React, { ReactNode } from "react";
import cx from "@/lib/cx";
import { toast } from "sonner";

export interface ToastProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  textClass?: string;
  text?: string;
  style?: any;
}

const Toaster = ({ ...props }) => {
  return (
    <button
      type="button"
      className={cx(" inline-flex flex-row items-center", props.className)}
      onClick={() => toast(props.text)}
      disabled={props.disabled}
    >
      {props.leftIcon && <span className="mr-2">{props.leftIcon}</span>}
      <span style={props.style} className={cx(props.textClass)}>
        {props.children}
      </span>
      {props.rightIcon && <span className="ml-2">{props.rightIcon}</span>}
    </button>
  );
};

export default Toaster;
