'use client'

import CommCodeClient from "@/app/components/commCode/commCodeClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FreeSearch({ searchParams }:
  {
    searchParams: {
      search_gb?: string;
      search?: string;
    }
  }
) {

  const [searchGb, setSearchGb] = useState(() => {
    if (searchParams?.search_gb) {
      return searchParams.search_gb;
    }
    return 'all'
  });
  const [search, setSearch] = useState(() => {
    if (searchParams?.search) {
      return searchParams.search;
    }
    return ''
  });
  const router = useRouter();

  function handleSearch() {
    router.push(`/board/free?p=1&search_gb=${searchGb}&search=${search}`)
  }

  //엔터 검색
  function handleKeyDown (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-center bg-gray-50 p-3">
      <CommCodeClient
      className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        code_id={"TD_002"}
        id={"search_gb"}
        name={"search_gb"}
        type={"select"}
        value={searchGb}
        onChange={(e) => { setSearchGb(e.target.value) }}
      />
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
        </label>
        <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
        <input 
  className="block w-full p-2.5 ps-8 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  type="text"
  name="search"
  value={search}
  onKeyDown={handleKeyDown}
  onChange={(e) => { setSearch(e.target.value) }}
/>

      </div>
      <button
  className="text-white bg-blue-500 hover:shadow-lg focus:ring-4 focus:outline-none focus:ring-blue-300 font-sans font-bold rounded-lg text-sm px-4 py-1.5 dark:bg-blue-600 hover:shadow-blue-500/40 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2"
  onClick={handleSearch}>
  검색
</button>
    </div>
  )
}