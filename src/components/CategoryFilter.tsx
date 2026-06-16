"use client";

import { CATEGORIES, type Category } from "@/lib/categories";

interface CategoryFilterProps {
  value: Category | "all";
  onChange: (value: Category | "all") => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const options: Array<Category | "all"> = ["all", ...CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              active
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {option === "all" ? "All" : option}
          </button>
        );
      })}
    </div>
  );
}
