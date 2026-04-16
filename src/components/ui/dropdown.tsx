'use client'

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type DropdownChoice<T extends string = string> = {
  value: T;
  label: string;
};

interface DropdownMenuProps<T extends string = string> {
  choices: DropdownChoice<T>[];
  value?: T; // controlled
  defaultValue?: T; // uncontrolled
  onChange?: (value: T) => void;
  placeholder?: string;
}

export default function DropdownMenu<T extends string = string>({
  choices,
  value,
  defaultValue,
  onChange,
  placeholder = "Select…",
}: DropdownMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedValue = value ?? internalValue;
  const selectedChoice = choices.find((c) => c.value === selectedValue);

  const handleSelect = (choice: DropdownChoice<T>) => {
    setInternalValue(choice.value);
    onChange?.(choice.value);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative w-auto"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={[
          "flex w-full min-h-10 min-w-[10rem] items-center justify-center p-2 transition-all duration-300 ease-in-out transform",
          "border border-background dark:border-border border-[0.5px] dark:bg-card/80 backdrop-blur-lg dark:text-text",
          isOpen ? "rounded-t-lg rounded-b-none" : "rounded-lg",
        ].join(" ")}
      >
        {selectedChoice?.label ?? placeholder}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, scaleY: 0.98, y: -2 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.98, y: -2 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 top-full z-10 w-full origin-top overflow-hidden rounded-b-lg border border-t-0 border-[0.5px] dark:border-border dark:bg-foreground/10 backdrop-blur-lg shadow-lg"
          >
            {choices.map((choice) => (
              <motion.li
                key={choice.value}
                onClick={() => handleSelect(choice)}
                className="flex cursor-pointer items-center p-2 transition-all duration-300 ease-in-out"
                initial="initial"
                whileHover="hovered" // This triggers children with the same variant name
              >
                <motion.div
                  variants={{
                    initial: { x: 0 }, // Start at the initial position
                    hovered: { x: "10%" }, // Move to the right
                  }}
                  transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
                  className="dropdown-item w-full text-left"
                >
                  {choice.label}
                </motion.div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}