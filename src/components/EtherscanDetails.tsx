import React from 'react';
import type { EtherscanAnalysisResponse } from '../lib/etherscan';

export default function EtherscanDetails({ data }: { data: EtherscanAnalysisResponse }): JSX.Element {
  return (
    <div className="mt-3 text-sm text-muted">
      <div className="bg-[#0f1523] border border-[#263042] rounded-xl p-3">
        <div className="font-semibold mb-2">📊 Datos Reales de Etherscan</div>
        
        {/* Balance de ETH - Datos más importantes */}
        {data.balance !== undefined && (
          <div className="mb-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">💰</span>
              <span className="font-semibold text-blue-300">Balance ETH:</span>
              <span className="text-white font-mono">{data.balance.toFixed(4)} ETH</span>
            </div>
          </div>
        )}
        
        {/* Total de transacciones */}
        {data.totalTransactions !== undefined && (
          <div className="mb-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2">
              <span className="text-green-400">📈</span>
              <span className="font-semibold text-green-300">Total Transacciones:</span>
              <span className="text-white font-mono">{data.totalTransactions}</span>
            </div>
          </div>
        )}
        
        {/* Desglose de transacciones - Solo si hay datos */}
        {data.normalTransactions !== undefined && data.internalTransactions !== undefined && data.tokenTransactions !== undefined && (
          <div className="mb-2 p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-400">🔍</span>
              <span className="font-semibold text-purple-300">Desglose de Actividad:</span>
            </div>
            <div className="text-xs space-y-1 ml-6">
              <div>• <span className="text-blue-300">{data.normalTransactions}</span> transacciones normales</div>
              <div>• <span className="text-orange-300">{data.internalTransactions}</span> transacciones internas</div>
              <div>• <span className="text-pink-300">{data.tokenTransactions}</span> transacciones de tokens</div>
            </div>
          </div>
        )}
        
        {/* Factores de riesgo - Solo si existen */}
        {data.riskFactors?.length > 0 && (
          <div className="mb-2 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-yellow-400">⚠️</span>
              <span className="font-semibold text-yellow-300">Factores de Riesgo:</span>
            </div>
            <div className="text-xs space-y-1 ml-6">
              {data.riskFactors.map((f, i) => (
                <div key={i} className="text-yellow-200">• {f}</div>
              ))}
            </div>
          </div>
        )}
        
        {/* Categoría de actividad */}
        {data.categories?.length > 0 && (
          <div className="mb-2 p-2 bg-gray-500/10 rounded-lg border border-gray-500/20">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">🏷️</span>
              <span className="font-semibold text-gray-300">Categoría:</span>
              <span className="text-white">{data.categories.join(', ')}</span>
            </div>
          </div>
        )}
        
        {/* Nota informativa */}
        <div className="text-xs text-gray-400 italic mt-2 p-2 bg-gray-800/30 rounded">
          💡 Datos obtenidos directamente de la blockchain de Ethereum
        </div>
      </div>
    </div>
  );
}