import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggleButton from "@/components/UI/ThemeToggleButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Estocare",
  description: "Sistema de gestão de estoque eficiente e moderno",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-text min-h-screen`}
      >
        {/* 
          Componente global de alternância de tema.
          Mantemos o botão fixo no topo e à direita, garantindo visibilidade em todas as telas.
        */}
        <ThemeToggleButton />

        {/* Conteúdo principal da aplicação */}
        <main className="w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
