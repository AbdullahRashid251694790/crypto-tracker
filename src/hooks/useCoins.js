import { useState, useEffect } from 'react'

export function useCoins() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true)
        // Using CoinGecko API with USD instead of USDT
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=true&price_change_percentage=24h'
        )
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`)
        }
        
        let data = await response.json()
        
        // Create a proper Vanry coin object with SVG data URL for the icon
        const vanryCoin = {
          id: 'vanry',
          symbol: 'vanry',
          name: 'Vanry',
          image: generateVanryIcon(),
          current_price: 0.2543,
          price_change_percentage_24h: 2.34,
          market_cap: 125000000,
          total_volume: 2500000,
          high_24h: 0.2678,
          low_24h: 0.2412,
          market_cap_rank: 1, // Special rank for featured coin
          sparkline_in_7d: {
            price: Array.from({length: 168}, (_, i) => 0.24 + Math.sin(i/10) * 0.02)
          }
        }
        
        // Add market_cap_rank to other coins if missing and ensure we have Vanry first
        const coinsWithRank = data.map(coin => ({
          ...coin,
          market_cap_rank: coin.market_cap_rank || 999
        }))
        
        // Limit to 15 coins total (Vanry + 14 from API)
        const limitedCoins = [vanryCoin, ...coinsWithRank.slice(0, 14)]
        setCoins(limitedCoins)
        setError(null)
      } catch (err) {
        console.error('Error fetching coins:', err)
        setError(err.message)
        // Fallback mock data for development
        setCoins(generateMockData())
      } finally {
        setLoading(false)
      }
    }

    fetchCoins()
    
    // Refresh every 60 seconds instead of 30 to be respectful to the API
    const interval = setInterval(fetchCoins, 60000)
    return () => clearInterval(interval)
  }, [])

  return { coins, loading, error }
}

// Generate SVG icon for Vanry as data URL
function generateVanryIcon() {
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4F46E5" />
          <stop offset="100%" stop-color="#7C3AED" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="16" fill="url(#grad)"/>
      <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">VR</text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Generate fallback icon for other coins
function generateFallbackIcon(symbol) {
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

// Enhanced fallback mock data generator - limited to 15 coins
function generateMockData() {
  const popularCoins = [
    {
      id: 'vanry',
      symbol: 'vanry',
      name: 'Vanry',
      image: generateVanryIcon(),
      current_price: 0.2543,
      price_change_percentage_24h: 2.34,
      market_cap: 125000000,
      total_volume: 2500000,
      high_24h: 0.2678,
      low_24h: 0.2412,
      market_cap_rank: 1,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 0.24 + Math.sin(i/10) * 0.02)
      }
    },
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      current_price: 43210.50,
      price_change_percentage_24h: 1.23,
      market_cap: 845000000000,
      total_volume: 25000000000,
      high_24h: 43500.00,
      low_24h: 42800.00,
      market_cap_rank: 2,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 43000 + Math.sin(i/10) * 500)
      }
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      current_price: 2580.75,
      price_change_percentage_24h: -0.45,
      market_cap: 310000000000,
      total_volume: 15000000000,
      high_24h: 2620.00,
      low_24h: 2550.00,
      market_cap_rank: 3,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 2550 + Math.sin(i/8) * 40)
      }
    },
    {
      id: 'binancecoin',
      symbol: 'bnb',
      name: 'BNB',
      image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
      current_price: 320.25,
      price_change_percentage_24h: 0.89,
      market_cap: 49000000000,
      total_volume: 800000000,
      high_24h: 325.50,
      low_24h: 315.75,
      market_cap_rank: 4,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 315 + Math.sin(i/12) * 8)
      }
    },
    {
      id: 'ripple',
      symbol: 'xrp',
      name: 'XRP',
      image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
      current_price: 0.5789,
      price_change_percentage_24h: -1.23,
      market_cap: 31500000000,
      total_volume: 1200000000,
      high_24h: 0.5920,
      low_24h: 0.5750,
      market_cap_rank: 5,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 0.575 + Math.sin(i/15) * 0.015)
      }
    },
    {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
      current_price: 0.5123,
      price_change_percentage_24h: 0.67,
      market_cap: 18000000000,
      total_volume: 450000000,
      high_24h: 0.5250,
      low_24h: 0.5080,
      market_cap_rank: 6,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 0.51 + Math.sin(i/20) * 0.008)
      }
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
      current_price: 102.45,
      price_change_percentage_24h: 3.21,
      market_cap: 45000000000,
      total_volume: 2800000000,
      high_24h: 105.20,
      low_24h: 99.80,
      market_cap_rank: 7,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 100 + Math.sin(i/5) * 3)
      }
    },
    {
      id: 'dogecoin',
      symbol: 'doge',
      name: 'Dogecoin',
      image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
      current_price: 0.0856,
      price_change_percentage_24h: -2.34,
      market_cap: 12200000000,
      total_volume: 600000000,
      high_24h: 0.0890,
      low_24h: 0.0845,
      market_cap_rank: 8,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 0.086 + Math.sin(i/25) * 0.002)
      }
    },
    {
      id: 'polkadot',
      symbol: 'dot',
      name: 'Polkadot',
      image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
      current_price: 7.23,
      price_change_percentage_24h: 1.45,
      market_cap: 9300000000,
      total_volume: 250000000,
      high_24h: 7.45,
      low_24h: 7.10,
      market_cap_rank: 9,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 7.2 + Math.sin(i/18) * 0.15)
      }
    },
    {
      id: 'avalanche',
      symbol: 'avax',
      name: 'Avalanche',
      image: 'https://assets.coingecko.com/coins/images/12559/small/avax.png',
      current_price: 36.78,
      price_change_percentage_24h: 2.89,
      market_cap: 13800000000,
      total_volume: 450000000,
      high_24h: 37.50,
      low_24h: 35.90,
      market_cap_rank: 10,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 36 + Math.sin(i/15) * 1.2)
      }
    },
    {
      id: 'chainlink',
      symbol: 'link',
      name: 'Chainlink',
      image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
      current_price: 18.45,
      price_change_percentage_24h: 0.78,
      market_cap: 10800000000,
      total_volume: 380000000,
      high_24h: 18.80,
      low_24h: 18.20,
      market_cap_rank: 11,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 18.3 + Math.sin(i/12) * 0.3)
      }
    },
    {
      id: 'litecoin',
      symbol: 'ltc',
      name: 'Litecoin',
      image: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
      current_price: 68.90,
      price_change_percentage_24h: -0.23,
      market_cap: 5100000000,
      total_volume: 350000000,
      high_24h: 69.50,
      low_24h: 68.20,
      market_cap_rank: 12,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 68.5 + Math.sin(i/10) * 0.5)
      }
    },
    {
      id: 'uniswap',
      symbol: 'uni',
      name: 'Uniswap',
      image: 'https://assets.coingecko.com/coins/images/12504/small/uniswap.png',
      current_price: 6.34,
      price_change_percentage_24h: 1.56,
      market_cap: 4800000000,
      total_volume: 120000000,
      high_24h: 6.45,
      low_24h: 6.25,
      market_cap_rank: 13,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 6.3 + Math.sin(i/16) * 0.1)
      }
    },
    {
      id: 'matic',
      symbol: 'matic',
      name: 'Polygon',
      image: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png',
      current_price: 0.7890,
      price_change_percentage_24h: 0.45,
      market_cap: 7300000000,
      total_volume: 280000000,
      high_24h: 0.7950,
      low_24h: 0.7820,
      market_cap_rank: 14,
      sparkline_in_7d: {
        price: Array.from({length: 168}, (_, i) => 0.785 + Math.sin(i/20) * 0.006)
      }
    }
  ]
  
  return popularCoins.slice(0, 15) // Return only 15 coins
}