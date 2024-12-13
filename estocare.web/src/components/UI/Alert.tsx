"use client";

import { useEffect } from "react";

interface AlertProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  autoClose?: number; // em ms (ex: 3000 para 3 segundos)
}

export default function Alert({
  message,
  type = "info",
  onClose,
  autoClose,
}: AlertProps) {
  // Fechamento automático
  useEffect(() => {
    if (autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  // Estilos baseados no tipo de alerta
  let bgColor = "bg-gray-200";
  let textColor = "text-gray-800";
  let borderColor = "border-gray-300";

  if (type === "success") {
    bgColor = "bg-green-100";
    textColor = "text-green-800";
    borderColor = "border-green-200";
  } else if (type === "error") {
    bgColor = "bg-red-100";
    textColor = "text-red-800";
    borderColor = "border-red-200";
  } else if (type === "info") {
    bgColor = "bg-blue-100";
    textColor = "text-blue-800";
    borderColor = "border-blue-200";
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${bgColor} ${textColor} ${borderColor} border px-4 py-2 rounded shadow-lg flex items-center gap-2`}
    >
      <span>{message}</span>
      <button
        className="text-sm font-bold hover:opacity-80"
        onClick={onClose}
        title="Fechar alerta"
      >
        ×
      </button>
    </div>
  );
}
