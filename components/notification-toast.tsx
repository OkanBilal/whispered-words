"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux";
import { clearError } from "@/lib/redux";
import { X } from "lucide-react";

export default function NotificationToast() {
  const { message, type } = useAppSelector((state) => state.error);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  const getBgColor = () => {
    switch (type) {
      case "error":
        return "bg-red-500";
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-700";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${getBgColor()} text-white p-4 rounded-lg shadow-lg max-w-md flex justify-between items-center`}>
        <p>{message}</p>
        <button 
          onClick={() => dispatch(clearError())}
          className="ml-4 text-white hover:text-gray-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
