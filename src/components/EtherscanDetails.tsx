import React from 'react';
import { EtherscanAnalysisResponse } from '../lib/etherscan';

export default function EtherscanDetails({ data }: { data: EtherscanAnalysisResponse }): React.JSX.Element {
  console.log('🔍 EtherscanDetails: Renderizando con datos:', data);
  try {
    return (
      <div className="mt-3 text-sm space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-400">Balance ETH:</span>
            <span className="ml-2 font-mono text-blue-400">{data.ethBalance} ETH</span>
          </div>
          <div>
            <span className="text-gray-400">Transacciones:</span>
            <span className="ml-2 font-mono text-green-400">{(data.transactionCount || 0).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-gray-400">Tipo:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              data.isContract 
                ? 'bg-purple-900/20 text-purple-400 border border-purple-500/50' 
                : 'bg-blue-900/20 text-blue-400 border border-blue-500/50'
            }`}>
              {data.isContract ? 'Contrato' : 'Wallet EOA'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Gas Promedio:</span>
            <span className="ml-2 font-mono text-yellow-400">{parseInt(data.gasUsed || '0').toLocaleString()}</span>
          </div>
        </div>

        {data.lastTransaction && (
          <div>
            <span className="text-gray-400">Última TX:</span>
            <span className="ml-2 font-mono text-gray-300">
              {new Date(data.lastTransaction).toLocaleDateString()}
            </span>
          </div>
        )}

        {data.categories && data.categories.length > 0 && (
          <div>
            <span className="text-gray-400">Categorías:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {data.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.sanctionsHit && (
          <div className="p-2 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-xs">
            ⚠️ Dirección sancionada detectada
          </div>
        )}

        <div className="text-xs text-gray-500 mt-2">
          {data.notes}
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ EtherscanDetails: Error renderizando:', error);
    return (
      <div className="mt-3 text-sm text-red-400">
        Error renderizando detalles de Etherscan: {error instanceof Error ? error.message : 'Error desconocido'}
      </div>
    );
  }
}
