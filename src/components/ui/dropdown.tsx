'use client'

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const languages = [
  { id: "js", name: "JavaScript" },
  { id: "py", name: "Python" },
  { id: "rs", name: "Rust" },
];

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(languages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (lang: typeof languages[0]) => {
    setSelected(lang); 
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-48"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-lg p-2 bg-orange-500 text-white flex justify-center  min-h-10
        min-w-[10rem]"
      >
        {selected.name}
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg overflow-hidden"
        >
          {languages.map((lang) => (
                <motion.li
                key={lang.id}
                onClick={() => handleSelect(lang)}
                className="cursor-pointer p-2 flex items-center hover:bg-gray-100 overflow-hidden"
                initial="initial"
                whileHover="hovered" // This triggers children with the same variant name
                >
                <motion.div
                    variants={{
                      initial: { x: 0 }, // Start at the initial position
                      hovered: { x: "10%" } // Move to the right
                    }}
                    transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
                    className="w-full text-left"
                >
                    {lang.name}
                </motion.div>
                </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}