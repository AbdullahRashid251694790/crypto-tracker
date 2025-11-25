import React from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from 'lucide-react'

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
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colorPair[0]}" />
          <stop offset="100%" stop-color="${colorPair[1]}" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="24" fill="url(#grad)"/>
      <text x="24" y="30" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">${char}</text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

const CoinDetail = ({ coin, onBack, isDark }) => {
  const isPositive = coin.price_change_percentage_24h >= 0

  const handleImageError = (e) => {
    e.target.src = generateFallbackIcon(coin.symbol)
  }

  return (
    <div className={`rounded-xl border p-6 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <ArrowLeft size={20} />
          <span>Back to list</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <img 
            src={coin.image} 
            alt={coin.name}
            className="w-12 h-12 rounded-full"
            onError={handleImageError}
          />
          <div className="text-right">
            <h1 className="text-2xl font-bold">{coin.name}</h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {coin.symbol?.toUpperCase()}/USD
            </p>
          </div>
        </div>
      </div>

      {/* Price and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Current Price"
          value={`$${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`}
          icon={DollarSign}
          isDark={isDark}
        />
        <StatCard
          title="24h Change"
          value={`${coin.price_change_percentage_24h?.toFixed(2)}%`}
          icon={isPositive ? TrendingUp : TrendingDown}
          isPositive={isPositive}
          isDark={isDark}
        />
        <StatCard
          title="Market Cap"
          value={`$${formatMarketCap(coin.market_cap)}`}
          icon={BarChart3}
          isDark={isDark}
        />
        <StatCard
          title="24h Volume"
          value={`$${formatVolume(coin.total_volume)}`}
          icon={Activity}
          isDark={isDark}
        />
      </div>

      {/* Price Chart */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Price Chart (7 days)</h2>
        <div className={`rounded-lg p-4 ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          {coin.sparkline_in_7d?.price ? (
            <Chart 
              data={coin.sparkline_in_7d.price}
              isPositive={isPositive}
              isDark={isDark}
            />
          ) : (
            <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Chart data not available
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">24h Statistics</h3>
          <div className={`space-y-2 text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <div className="flex justify-between">
              <span>High:</span>
              <span className="font-medium">${coin.high_24h?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Low:</span>
              <span className="font-medium">${coin.low_24h?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
            </div>
            <div className="flex justify-between">
              <span>Price Change (24h):</span>
              <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Market Data</h3>
          <div className={`space-y-2 text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <div className="flex justify-between">
              <span>Market Cap Rank:</span>
              <span className="font-medium">#{coin.market_cap_rank || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Volume:</span>
              <span className="font-medium">${formatVolume(coin.total_volume)}</span>
            </div>
            <div className="flex justify-between">
              <span>Market Cap:</span>
              <span className="font-medium">${formatMarketCap(coin.market_cap)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions for formatting
const formatMarketCap = (marketCap) => {
  if (!marketCap) return 'N/A'
  if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(2)}B`
  if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(2)}M`
  return marketCap.toLocaleString()
}

const formatVolume = (volume) => {
  if (!volume) return 'N/A'
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`
  return volume.toLocaleString()
}

const StatCard = ({ title, value, icon: Icon, isPositive, isDark }) => (
  <div className={`p-4 rounded-lg border ${
    isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
  }`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {title}
        </p>
        <p className={`text-xl font-bold mt-1 ${
          isPositive !== undefined 
            ? isPositive ? 'text-green-500' : 'text-red-500'
            : isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {value}
        </p>
      </div>
      <Icon 
        size={24} 
        className={
          isPositive !== undefined
            ? isPositive ? 'text-green-500' : 'text-red-500'
            : isDark ? 'text-gray-400' : 'text-gray-600'
        } 
      />
    </div>
  </div>
)

const Chart = ({ data, isPositive, isDark }) => {
  if (!data || data.length === 0) return null

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  return (
    <svg width="100%" height="200" className="overflow-visible">
      {/* Gradient area */}
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area */}
      <path
        d={`M 0 200 ${data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = 200 - ((value - min) / range) * 180
          return `L ${x} ${y}`
        }).join(' ')} L 100 200 Z`}
        fill="url(#chartGradient)"
      />

      {/* Line */}
      <path
        d={data.map((value, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = 200 - ((value - min) / range) * 180
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
        }).join(' ')}
        stroke={isPositive ? '#10B981' : '#EF4444'}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}

export default CoinDetail