import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string; // Para navegação
  className?: string; // Classes adicionais
}

export default function Button({ children, href, className }: ButtonProps) {
  const baseStyles = "px-6 py-2 bg-primary text-primary-text rounded-lg font-medium transition-all hover:opacity-90";

  if (href) {
    return (
      <a href={href} className={`${baseStyles} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${baseStyles} ${className}`}>
      {children}
    </button>
  );
}
