import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Habilita o suporte ao tema escuro usando a classe "dark"
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Escaneia os arquivos do projeto
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)", // Cor primária para botões
        secondary: "var(--secondary)", // Cor secundária
        accent: "var(--accent)", // Destaques
        text: "var(--text)", // Cor do texto principal
        "text-secondary": "var(--text-secondary)", // Cor do texto secundário
      },
      transitionDuration: {
        theme: "300ms", // Transição suave para troca de temas
      },
    },
  },
  plugins: [],
};

export default config;
