import React from 'react'
import { TrendingUp, TrendingDown, Star, ArrowUp, ArrowDown } from 'lucide-react'

// Generate fallback icon for coins with broken image URLs
const generateFallbackIcon = (symbol) => {
  const char = symbol?.charAt(0)?.toUpperCase() || 'C'
  const colors = [
    ['#EF4444', '#DC2626'], // red
    ['#10B981', '#059669'], // green
    ['#3B82F6', '#2563EB'], // blue
    ['#8B5CF6', '#7C3AED'], // purple
    ['#F59E0B', '#D97706'], // amber
  ]
  const colorPair = colors[char.charCodeAt(0) % colors.length]
  
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colorPair[0]}" />
          <stop offset="100%" stop-color="${colorPair[1]}" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="16" fill="url(#grad)"/>
      <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${char}</text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

const CoinCard = ({ coin, onSelect, isDark, isFirst }) => {
  const isPositive = coin.price_change_percentage_24h >= 0

  const handleImageError = (e) => {
    e.target.src = generateFallbackIcon(coin.symbol)
  }

  return (
    <div 
      onClick={() => onSelect(coin)}
      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg ${
        isDark 
          ? 'bg-gray-800 border-gray-700 hover:border-blue-500' 
          : 'bg-white border-gray-200 hover:border-blue-400'
      } ${isFirst ? 'ring-2 ring-yellow-400' : ''} relative group`}
    >
      {isFirst && (
        <div className="absolute -top-2 -left-2 bg-yellow-400 text-gray-900 text-xs px-2 py-1 rounded-full font-bold flex items-center">
          <Star size={12} className="mr-1" />
          Featured
        </div>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img 
            src={coin.image} 
            alt={coin.name}
            className="w-10 h-10 rounded-full"
            onError={handleImageError}
          />
          <div>
            <h3 className="font-semibold text-lg">{coin.symbol?.toUpperCase()}</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {coin.name}
            </p>
          </div>
        </div>
        
        <div className={`flex items-center ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span className="ml-1 font-medium">
            {coin.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Price:</span>
          <span className="font-bold text-xl">
            ${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Market Cap:</span>
            <span className="font-medium">${(coin.market_cap / 1e6).toFixed(1)}M</span>
          </div>
          <div className="flex flex-col">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>24h Volume:</span>
            <span className="font-medium">${(coin.total_volume / 1e6).toFixed(1)}M</span>
          </div>
        </div>

        {/* 24h Range Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>24h Range</span>
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              ${coin.low_24h?.toFixed(4)} - ${coin.high_24h?.toFixed(4)}
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className={`h-full rounded-full ${
                isPositive ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{
                width: `${((coin.current_price - coin.low_24h) / (coin.high_24h - coin.low_24h)) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Click to view chart hint */}
      <div className={`mt-3 text-xs text-center ${
        isDark ? 'text-gray-500' : 'text-gray-400'
      }`}>
        Click to view chart & details
      </div>
    </div>
  )
}

export default CoinCard