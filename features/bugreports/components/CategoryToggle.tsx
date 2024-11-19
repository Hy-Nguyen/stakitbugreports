import { BugCategory } from "../type";
import { Server, Layout } from "lucide-react";

interface CategoryToggleProps {
  selectedCategory: BugCategory;
  onToggle: (category: BugCategory) => void;
}

export default function CategoryToggle({ selectedCategory, onToggle }: CategoryToggleProps) {
  return (
    <div className="relative flex w-full gap-2 rounded-lg bg-gray-100 p-1.5 lg:w-auto">
      <div
        className={`absolute h-[calc(100%-0.75rem)] w-[calc(50%-0.375rem)] rounded-md bg-white shadow transition-all duration-200 ease-in-out ${
          selectedCategory === "frontend" ? "left-1.5" : "left-[calc(50%+0.375rem)]"
        }`}
      />
      <button
        onClick={() => onToggle("frontend")}
        className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors lg:w-32 ${
          selectedCategory === "frontend" ? "text-blue-700" : "text-gray-700 hover:text-blue-600"
        }`}
      >
        <Layout size={16} />
        Frontend
      </button>
      <button
        onClick={() => onToggle("backend")}
        className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors lg:w-32 ${
          selectedCategory === "backend" ? "text-blue-700" : "text-gray-700 hover:text-blue-600"
        }`}
      >
        <Server size={16} />
        Backend
      </button>
    </div>
  );
}
