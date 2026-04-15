import React, { useState } from "react";

interface Props {
  onSearch?: (q: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="px-3 py-2 bg-[#0d1117]">
      <div className="flex items-center bg-[#161b27] rounded-lg px-3 gap-2 border border-[#1e2d45]">
        <svg className="w-4 h-4 text-[#8696a0] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search or start new chat"
          className="flex-1 bg-transparent text-[#d1d7db] placeholder-[#8696a0] text-sm py-2.5 outline-none"        />
        {query && (
          <button
            onClick={() => { setQuery(""); onSearch?.(""); }}
            className="text-[#8696a0] hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
