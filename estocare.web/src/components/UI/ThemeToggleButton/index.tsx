"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggleButton() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 flex items-center justify-center w-12 h-12 
                 bg-indigo-600 text-white rounded-full shadow-lg 
                 transition-transform duration-300 transform hover:scale-105 
                 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      title="Alternar tema"
      aria-label="Alternar tema"
      aria-pressed={isDarkMode}
    >
      {isDarkMode ? (
        <SunIcon className="w-6 h-6" aria-hidden="true" />
      ) : (
        <MoonIcon className="w-6 h-6" aria-hidden="true" />
      )}
    </button>
  );
}
