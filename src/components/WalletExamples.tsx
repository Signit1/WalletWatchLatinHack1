import React, { useState } from 'react';

interface WalletExample {
  address: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskProfile: string;
  polkadotAddress: string;
  category: string;
}

const WALLET_EXAMPLES: WalletExample[] = [
  // Wallets de bajo riesgo
  {
    address: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
    name: 'Vitalik Buterin',
    description: 'Fundador de Ethereum - Wallet personal',
    riskLevel: 'low',
    riskProfile: 'CryptoSaint',
    polkadotAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    category: 'Famoso'
  },
  {
    address: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
    name: 'Binance Hot Wallet',
    description: 'Wallet principal de Binance Exchange',
    riskLevel: 'low',
    riskProfile: 'DeFi Explorer',
    polkadotAddress: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    category: 'Exchange'
  },
  {
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    name: 'Uniswap V2 Router',
    description: 'Router oficial de Uniswap V2',
    riskLevel: 'low',
    riskProfile: 'Token Collector',
    polkadotAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    category: 'DeFi'
  },
  
  // Wallets de medio riesgo
  {
    address: '0x8589427373D6D84E98730D7795D8f6f8731FDA16',
    name: 'NFT Collector',
    description: 'Wallet especializada en NFTs y arte digital',
    riskLevel: 'medium',
    riskProfile: 'NFT Enthusiast',
    polkadotAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    category: 'NFT'
  },
  {
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    name: 'Uniswap Token',
    description: 'Wallet con actividad de trading intensa',
    riskLevel: 'medium',
    riskProfile: 'DeFi Explorer',
    polkadotAddress: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    category: 'DeFi'
  },
  {
    address: '0x690b9a9e9aa1c9db991c7721a92d351db4fac990',
    name: 'Flashbots Builder',
    description: 'Builder conocido de MEV (constructor de bloques)',
    riskLevel: 'low',
    riskProfile: 'Block Builder',
    polkadotAddress: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    category: 'Builder'
  },
  {
    address: '0x000000000000000000000000000000000000dEaD',
    name: 'Burn Address',
    description: 'Dirección de quemado de tokens',
    riskLevel: 'low',
    riskProfile: 'CryptoSaint',
    polkadotAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    category: 'Sistema'
  },
  
  // Wallets de alto riesgo
  {
    address: '0x7f367cc41522ce07553e823bf3be79a889debe1b',
    name: 'Tornado Cash',
    description: 'Wallet relacionada con Tornado Cash (OFAC)',
    riskLevel: 'high',
    riskProfile: 'DO NOT INTERACT',
    polkadotAddress: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    category: 'Sancionado'
  },
  {
    address: '0x8589427373D6D84E98730D7795D8f6f8731FDA16',
    name: 'Suspicious Activity',
    description: 'Wallet con patrones de actividad sospechosa',
    riskLevel: 'high',
    riskProfile: 'Crypto Chueco',
    polkadotAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    category: 'Sospechoso'
  }
];

interface WalletExamplesProps {
  onSelectWallet: (address: string, polkadotAddress: string) => void;
}

export default function WalletExamples({ onSelectWallet }: WalletExamplesProps): React.JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWallet, setSelectedWallet] = useState<WalletExample | null>(null);

  const categories = ['all', ...Array.from(new Set(WALLET_EXAMPLES.map(w => w.category)))];
  
  const filteredWallets = selectedCategory === 'all' 
    ? WALLET_EXAMPLES 
    : WALLET_EXAMPLES.filter(w => w.category === selectedCategory);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-400 bg-green-900/20 border-green-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/50';
      case 'high': return 'text-red-400 bg-red-900/20 border-red-500/50';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/50';
    }
  };

  const getRiskEmoji = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🔴';
      default: return '⚫';
    }
  };

  const handleSelectWallet = (wallet: WalletExample) => {
    setSelectedWallet(wallet);
    onSelectWallet(wallet.address, wallet.polkadotAddress);
  };

  return (
    <div className="card-enhanced rounded-xl p-6 border-green-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-2xl">🎯</div>
        <h3 className="text-lg font-semibold">Ejemplos de Wallets para Probar</h3>
      </div>
      
      <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
        <p className="text-green-300 text-sm">
          <strong>💡 Instrucciones:</strong> Selecciona una wallet de la lista para probar el sistema. 
          La aplicación cambiará automáticamente a la pestaña de análisis con la wallet seleccionada.
          <br /><br />
          <strong>📝 Nota:</strong> Además de estos ejemplos, puedes analizar <strong>cualquier wallet de Ethereum</strong> 
          ingresando su dirección en la pestaña de análisis.
        </p>
      </div>

      {/* Filtros por categoría */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category === 'all' ? 'Todas' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de wallets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWallets.map((wallet, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
              selectedWallet?.address === wallet.address
                ? 'border-purple-500 bg-purple-900/20'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
            onClick={() => handleSelectWallet(wallet)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white">{wallet.name}</h4>
                <p className="text-sm text-gray-400">{wallet.description}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs border ${getRiskColor(wallet.riskLevel)}`}>
                {getRiskEmoji(wallet.riskLevel)} {wallet.riskLevel.toUpperCase()}
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-400">Wallet:</span>
                <span className="font-mono text-blue-400 ml-2">
                  {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Perfil:</span>
                <span className="text-yellow-400 ml-2">{wallet.riskProfile}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-600">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectWallet(wallet);
                }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                🎨 Generar NFT para esta wallet
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
        <h4 className="font-semibold text-blue-300 mb-2">💡 Cómo usar estos ejemplos:</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• <strong>Haz clic</strong> en cualquier wallet para seleccionarla</li>
          <li>• <strong>Automáticamente</strong> cambiarás a la pestaña de análisis</li>
          <li>• <strong>Analiza</strong> la wallet con los 4 proveedores</li>
          <li>• <strong>Conecta MetaMask</strong> para emitir el NFT</li>
          <li>• <strong>Genera</strong> el NFT con imagen personalizada</li>
          <li>• <strong>Ve a la galería</strong> para ver todas las imágenes generadas</li>
        </ul>
      </div>

      {/* Wallet seleccionada */}
      {selectedWallet && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-green-400">✅</div>
            <span className="font-semibold text-green-300">Wallet Seleccionada:</span>
          </div>
          <p className="text-sm text-gray-300">
            <strong>{selectedWallet.name}</strong> - {selectedWallet.description}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {selectedWallet.address}
          </p>
        </div>
      )}
    </div>
  );
}
