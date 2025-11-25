import React from 'react'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'

const Header = ({ isDark, toggleTheme, searchTerm, setSearchTerm }) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Crypto Tracker
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Real-time cryptocurrency prices and charts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isDark={isDark}
          />
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  )
}

export default Header