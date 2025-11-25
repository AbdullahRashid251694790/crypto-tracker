import React from 'react'
import CoinCard from './CoinCard'
import { RefreshCw } from 'lucide-react'

const CoinList = ({ coins, loading, error, onSelectCoin, isDark }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
        <span className="ml-3 text-lg">Loading cryptocurrencies...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-20 rounded-lg ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-red-500 text-lg mb-2">Error loading data</div>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {error}. Showing demo data.
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {coins.map((coin, index) => (
        <CoinCard
          key={coin.id}
          coin={coin}
          onSelect={onSelectCoin}
          isDark={isDark}
          isFirst={index === 0} // Highlight Vanry
        />
      ))}
    </div>
  )
}

export default CoinList