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

  return (
    <div className="bg-slate-200 p-3">
      <CommCodeClient
        code_id={"TD_002"}
        id={"search_gb"}
        name={"search_gb"}
        type={"select"}
        value={searchGb}
        onChange={(e) => { setSearchGb(e.target.value) }}
      />
      <input type="text" name="search" value={search} onChange={(e) => { setSearch(e.target.value) }} />
      <button onClick={handleSearch}>검색</button>
    </div>
  )
}