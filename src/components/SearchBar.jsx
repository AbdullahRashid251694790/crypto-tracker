import React from 'react'
import { Search } from 'lucide-react'

const SearchBar = ({ searchTerm, setSearchTerm, isDark }) => {
  return (
    <div className="relative">
      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`} size={20} />
      <input
        type="text"
        placeholder="Search cryptocurrencies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`pl-10 pr-4 py-2 rounded-lg border transition-all duration-300 w-64 ${
          isDark 
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
      />
    </div>
  )
}

export default SearchBar