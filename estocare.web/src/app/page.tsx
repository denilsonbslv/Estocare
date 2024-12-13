"use client";

import Button from "@/components/UI/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-3xl mb-8">
        <h1 className="text-4xl font-bold text-center">Estocare</h1>
        <p className="text-text-secondary text-center mt-2">
          Gerencie seu estoque de forma simples e eficiente.
        </p>
      </header>

      <main className="w-full max-w-3xl flex flex-col gap-4 items-center">
        <Button href="/categories" className="mt-4">
          Gerenciar Categorias
        </Button>
      </main>
    </div>
  );
}
