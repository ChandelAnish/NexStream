import React, {useState} from 'react';
import Image from 'next/image';
import { Search } from "lucide-react";

function SearchBar(){
    const [searchTerm, setSearchTerm] = useState("");
    return (
      <div className="mb-6 w-full flex justify-end items-end">
        <div className="w-full">
          <Image
            src="/assets/filter.png"
            width={48}
            height={48}
            alt="filter"
            className="float-right p-2"
          ></Image>
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by..."
            className="w-1/4 pl-10 pr-4 py-3 border border-gray-200 float-right rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>);
}

export default SearchBar;