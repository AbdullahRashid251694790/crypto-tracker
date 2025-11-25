import React, { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { useCoins } from './hooks/useCoins'
import Header from './components/Header'
import CoinList from './components/CoinList'
import CoinDetail from './components/CoinDetail'

function App() {
  const { isDark, toggleTheme } = useTheme()
  const { coins, loading, error } = useCoins()
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-linear-to-br from-blue-50 to-indigo-100 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-6">
        <Header 
          isDark={isDark}
          toggleTheme={toggleTheme}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        {selectedCoin ? (
          <CoinDetail 
            coin={selectedCoin}
            onBack={() => setSelectedCoin(null)}
            isDark={isDark}
          />
        ) : (
          <CoinList 
            coins={filteredCoins}
            loading={loading}
            error={error}
            onSelectCoin={setSelectedCoin}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  )
}

export default App
