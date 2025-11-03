import React from "react";
import { FaFilter, FaChevronUp, FaChevronDown } from "react-icons/fa";

interface FilterBarProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filterOptions: {
    colors: string[];
    tags: string[];
    priorities: string[];
  };
  activeFilters: {
    colors: string[];
    tags: string[];
    priorities: string[];
  };
  setActiveFilters: React.Dispatch<
    React.SetStateAction<{
      colors: string[];
      tags: string[];
      priorities: string[];
    }>
  >;
}

const COLOR_FILTER_OPTIONS = {
  Ocean: "#bdd8d4",
  Cacao: "#9f9071",
  Tumeric: "#f4d78e",
  Chai: "#dfc99e",
  Clay: "#ddb794",
  Mint: "#b8e1bf",
  Matcha: "#e2edab",
  Coconut: "#e6dccb",
} as const;

const PRIORITY_FILTER_OPTIONS = ["None", "Low", "Medium", "High"] as const;

const FilterBar: React.FC<FilterBarProps> = ({
  showFilters,
  setShowFilters,
  filterOptions,
  activeFilters,
  setActiveFilters,
}) => {
  return (
    <div className="mb-4">
      {/* Make the top bar fit content width */}
      <div className="inline-block bg-brand-cream bg-opacity-20 rounded-lg p-2">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-brand-green-dark hover:text-brand-green-dark/80 transition-colors"
          >
            <FaFilter />
            <span>Filter Actions</span>
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {/* Show active filters count */}
          {(activeFilters.colors.length > 0 ||
            activeFilters.tags.length > 0 ||
            activeFilters.priorities.length > 0) && (
            <div className="flex items-center gap-4 border-l border-brand-cream/20 pl-4 ">
              <span className="text-brand-green-dark/80">
                Active Filters:{" "}
                {activeFilters.colors.length +
                  activeFilters.tags.length +
                  activeFilters.priorities.length}
              </span>
              <button
                onClick={() =>
                  setActiveFilters({
                    colors: [],
                    tags: [],
                    priorities: [],
                  })
                }
                className="text-brand-green-dark/80 hover:text-brand-green-dark text-sm underline"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full-width dropdown content */}
      {showFilters && (
        <div className="mt-2 bg-brand-cream bg-opacity-20 rounded-lg p-4 overflow-x-hidden">
          <div className="flex flex-col space-y-6 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6">
            {/* Colors - Two columns on all screen sizes */}
            <div className="w-full lg:col-span-2 lg:relative">
              <h3 className="text-brand-green-dark font-semibold mb-2">
                Colours
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {Object.entries(COLOR_FILTER_OPTIONS).map(([name, color]) => (
                  <div
                    key={color}
                    onClick={() => {
                      setActiveFilters((prev) => ({
                        ...prev,
                        colors: prev.colors.includes(color)
                          ? prev.colors.filter((c) => c !== color)
                          : [...prev.colors, color],
                      }));
                    }}
                    className="flex items-center gap-2 text-brand-green-dark/80 hover:text-brand-green-dark cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={activeFilters.colors.includes(color)}
                        onChange={() => {}}
                        className="rounded border-brand-green-dark/50"
                      />
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: color }}
                      />
                      <span>{name}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Vertical divider after colors section - visible only on lg screens */}
              <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-px bg-brand-cream/20"></div>
            </div>

            {/* Priorities */}
            <div className="w-full lg:col-span-1 lg:relative lg:pl-4">
              <h3 className="text-brand-green-dark font-semibold mb-2">
                Priorities
              </h3>
              <div className="space-y-1">
                {PRIORITY_FILTER_OPTIONS.map((priority) => (
                  <div
                    key={priority}
                    onClick={() => {
                      setActiveFilters((prev) => ({
                        ...prev,
                        priorities: prev.priorities.includes(priority)
                          ? prev.priorities.filter((p) => p !== priority)
                          : [...prev.priorities, priority],
                      }));
                    }}
                    className="flex items-center gap-2 text-brand-cream/80 hover:text-brand-cream cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.priorities.includes(priority)}
                      onChange={() => {}}
                      className="rounded border-brand-cream/50"
                    />
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        priority === "High"
                          ? "bg-red-100 text-red-800"
                          : priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : priority === "Low"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {priority}
                    </span>
                  </div>
                ))}
              </div>
              {/* Vertical divider after priorities section - visible only on lg screens */}
              <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-px bg-brand-cream/20"></div>
            </div>

            {/* Tags */}
            <div className="w-full lg:col-span-1 lg:pl-4">
              <h3 className="text-brand-green-dark font-semibold mb-2">Tags</h3>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {filterOptions.tags.length > 0 ? (
                  filterOptions.tags.map((tag) => (
                    <div
                      key={tag}
                      onClick={() => {
                        setActiveFilters((prev) => ({
                          ...prev,
                          tags: prev.tags.includes(tag)
                            ? prev.tags.filter((t) => t !== tag)
                            : [...prev.tags, tag],
                        }));
                      }}
                      className="flex items-center gap-2 text-brand-green-dark/80 hover:text-brand-green-dark cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={activeFilters.tags.includes(tag)}
                        onChange={() => {}}
                        className="rounded border-brand-green-dark/50"
                      />
                      <span>{tag}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-brand-green-dark/60 text-sm italic">
                    No tags available
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
