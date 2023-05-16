"use client"; 
import { useState } from 'react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = async () => {
    const response = await fetch(`http://localhost:3003/search?keyword=${searchQuery}`);
    const data = await response.json();
    console.error("data.results.items", data.items)
    setResults(data.items);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
      >
        Search
      </button>
      <p>Total Results - {results.length}</p>
      <ul className="mt-4">
        {results.map((result, index) => (
          <li key={index} className="text-gray-700 border border-gray-300 px-4 py-3">
            {result.volumeInfo.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;