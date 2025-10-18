"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const styles = type === "success" 
    ? "bg-green-50 border-green-200 text-green-800"
    : "bg-red-50 border-red-200 text-red-800";

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-500">
      <div className={`flex items-center p-4 rounded-lg shadow-lg border ${styles}`}>
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 flex-shrink-0" />
        )}
        <div className="ml-3 text-sm font-medium flex-1">{message}</div>
        <button
          onClick={onClose}
          className="ml-4 inline-flex text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}