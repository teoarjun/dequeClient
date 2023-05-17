"use client";
import React, { useState } from 'react';
import { BooksResult } from './BooksModel';
import { Loader } from './Loader';

const SearchBar = () => {
  const [currentPage, setcurrentPage] = useState(0);
  const [maxResults, setmaxResults] = useState(5);
  const [showLoader, setshowLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<BooksResult>();
  const displayOptions = [5, 10, 20]

  React.useEffect(() => {
    handleSearch()
  }, [currentPage, maxResults])

  const handleSearch = async () => {
    if(searchQuery) {
      setshowLoader(true)
      const response = await fetch(`http://localhost:3003/search?keyword=${searchQuery}&maxResults=${maxResults}&startIndex=`+(currentPage*maxResults));
      const data = await response.json();
      setResults(data);
      setshowLoader(false)

    }
  };
  const handleDisplayFilter = (event) => {
    setcurrentPage(0)
    setmaxResults(event.target.value)
  }
  const handlePrev = () => {
    if(currentPage > 0) {
      setcurrentPage(currentPage-1)
    }
  }
  const handleNext = () => {
    setcurrentPage(currentPage+1)

  }
  const handleChange = (event) => {
    if(event.target.value > 1) {
      setcurrentPage(event.target.value-1)
    } else {
      setcurrentPage(0)
    }
  }

  return (
    <div>
      <div className='justify-center flex'>
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

      {showLoader && <Loader />}
      </div>
      {results && results.totalItems > 0 &&
        <div className='mt-2'>
          Total Results - {results && results.totalItems.toString()} &nbsp;  Show - &nbsp;
          <select className='mr-48' onChange={handleDisplayFilter}>
            {displayOptions.map((val) => (<option key={val} value={val}>{val}</option>))}
          </select>
          <div className='float-right'>

            <button className='ml-2 mr-2 text-indigo-700 underline' onClick={handlePrev}>Prev</button>
            {/* <button className='ml-2 mr-2 text-indigo-700 underline' onClick={() => setcurrentPage(0)}>1</button>
            <button className='ml-2 mr-2 text-indigo-700 underline' onClick={() => setcurrentPage(1)}>2</button> */}
            <input className='w-12 text-center' value={currentPage+1} onChange={handleChange} />
            <button className='ml-2 mr-2 text-indigo-700 underline' onClick={handleNext}>Next</button>
          </div>
        </div>}
      <div className="bg-white space-y-4 mt-4 flex-1">
        <ul className="">
          {results?.items?.map((result, index) => (
            <li key={index} className="text-gray-700 border border-gray-300 px-4 py-3">
              {result.volumeInfo.authors?.join(",")} - {result.volumeInfo.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;