"use client";
import React, { ChangeEvent, ChangeEventHandler, useState } from 'react';
import { BooksResult, ItemsEntity } from './BooksModel';
import { Loader } from './Loader';
import { getPublishedDate } from '@/util';
import { debounce } from 'lodash';


const SearchBar = () => {
  const [openIndex, setopenIndex] = useState<number | null>(null);
  const [currentPage, setcurrentPage] = useState<number>(0);
  const [maxResults, setmaxResults] = useState<number>(40);
  const [mostPopularAuthor, setmostPopularAuthor] = useState<string>("");
  const [oldestPublishedDate, setoldestPublishedDate] = useState<string>();
  const [latestPublishedDate, setlatestPublishedDate] = useState<string>();
  const [serverResponseTime, setserverResponseTime] = useState<string>("");
  const [showLoader, setshowLoader] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<BooksResult>();
  const displayOptions: number[] = [40, 20, 10, 5]

  React.useEffect(() => {
    const getMostPopularAuthor = (allAuthors: string[]) => {
      //1. getMostPopularAuthor
      const author = allAuthors.sort((a, b) =>
        allAuthors.filter(v => v === a).length
        - allAuthors.filter(v => v === b).length
      ).pop();
      setmostPopularAuthor(author || "")
    }
    const calculateStats = (data: BooksResult) => {
      if (data.totalItems > 0 && data.items) {
        const allAuthors: string[] = []
        const allPublishedDates: string[] = []
        data.items.forEach((item: ItemsEntity) => {
          if (Array.isArray(item.volumeInfo.authors)) {
            allAuthors.push(...item.volumeInfo.authors)
            allPublishedDates.push(item.volumeInfo.publishedDate)
          }
        })
        //1. getMostPopularAuthor
        getMostPopularAuthor(allAuthors)
        //2. Oldest Published Date
        setoldestPublishedDate(getPublishedDate(allPublishedDates))
        setlatestPublishedDate(getPublishedDate(allPublishedDates, false))
      }
    }
    const handleSearch = async () => {
      if (searchQuery) {
        const startTime = new Date();
        setshowLoader(true)
        const response = await fetch(`http://localhost:3003/search?keyword=${searchQuery}&maxResults=${maxResults}&startIndex=` + (currentPage * maxResults));
        const data = await response.json();
        //calculating stats-
        //1. Total Results - 1888   Most Popular Author - 1888   Oldest Published Date - 1888   Latest Published Date - 1888   Server Response Time 
        calculateStats(data)
        setResults(data);
        setshowLoader(false)
        const endTime = new Date();
        const elapsedTimeInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
        setserverResponseTime(elapsedTimeInSeconds.toFixed(2).toString())
      }
    };
    handleSearch()
  }, [currentPage, maxResults, searchQuery])


  const handleDisplayFilter = (event: ChangeEvent<HTMLSelectElement>) => {
    setcurrentPage(0)
    setmaxResults(parseInt(event.target.value))
  }
  const handlePrev = () => {
    if (currentPage > 0) {
      setcurrentPage(currentPage - 1)
    }
  }
  const handleNext = () => {
    setcurrentPage(currentPage + 1)

  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (parseInt(event.target.value) > 1) {
      setcurrentPage(parseInt(event.target.value) - 1)
    } else {
      setcurrentPage(0)
    }
  }

  const debouncedSearch = debounce((e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, 500);

  const handleItemClick = (clickedIndex: number) => {
    if (clickedIndex === openIndex) {
      setopenIndex(null)
    } else {
      setopenIndex(clickedIndex)
    }
  }

  return (
    <div>
      <div className='justify-center flex'>
        <input
          type="text"
          placeholder="Search"
          onChange={debouncedSearch}
          className="border border-gray-300 rounded px-4 py-2"
        />

        {showLoader && <Loader />}
      </div>
      {results && results.totalItems > 0 &&
        <div>
          <div className='mt-2'>
            Show - &nbsp;
            <select className='mr-48' onChange={handleDisplayFilter}>
              {displayOptions.map((val) => (<option key={val} value={val}>{val}</option>))}
            </select>
            <div className='float-right'>

              <button className='ml-2 mr-2 text-indigo-700 underline' onClick={handlePrev}>Prev</button>
              <input className='w-12 text-center' value={currentPage + 1} onChange={handleChange} />
              <button className='ml-2 mr-2 text-indigo-700 underline' onClick={handleNext}>Next</button>
            </div>
          </div>
          <div className='mt-4 text-center text-sm bg-pink-200 text-gray-700 pt-2 pb-2'>
            <span>Total Results - <b>{results && results.totalItems.toString()}</b> &nbsp;  </span>
            <span>Most Popular Author - <b>{mostPopularAuthor}</b> &nbsp;  </span>
            <span>Oldest Published Date - <b>{oldestPublishedDate}</b> &nbsp;  </span>
            <span>Latest Published Date - <b>{latestPublishedDate}</b> &nbsp;  </span>
            <span>Server Response Time - <b>{serverResponseTime + "s"}</b> &nbsp;  </span>
          </div>
        </div>
      }
      <div className="bg-white space-y-4 mt-4 flex-1">
        <ul className="">
          {results?.items?.map((result, index) => (
            <li key={index} className="text-gray-700 border border-gray-300 px-4 py-3 cursor-pointer" onClick={() => handleItemClick(index)}>
              <p>{result.volumeInfo.authors?.join(",")} - {result.volumeInfo.title}
                <span className='text-xs float-right mt-2'>{result.volumeInfo.publishedDate}</span>
              </p>
              {openIndex === index && <p className='text-gray-600 text-xs'>{result.volumeInfo.description || "No description available!"}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;