import React from 'react';
import type { EtherscanAnalysisResponse } from '../lib/etherscan';

export default function EtherscanDetails({ data }: { data: EtherscanAnalysisResponse }): JSX.Element {
  return (
    <div className="mt-3 text-sm text-muted">
      <div className="bg-[#0f1523] border border-[#263042] rounded-xl p-3">
        <div className="font-semibold mb-1">Etherscan</div>
        <div><span className="font-semibold">Sanciones:</span> {data.sanctionsHit ? 'Posible match' : 'No detectado'}</div>
        <div className="mt-1"><span className="font-semibold">Score:</span> {data.riskScore}/100 — {data.risk.toUpperCase()}</div>
        
        {data.balance !== undefined && (
          <div className="mt-1"><span className="font-semibold">Balance ETH:</span> {data.balance.toFixed(4)} ETH</div>
        )}
        
        {data.totalTransactions !== undefined && (
          <div className="mt-1"><span className="font-semibold">Total TXs:</span> {data.totalTransactions}</div>
        )}
        
        {data.normalTransactions !== undefined && data.internalTransactions !== undefined && data.tokenTransactions !== undefined && (
          <div className="mt-1">
            <span className="font-semibold">Desglose:</span> {data.normalTransactions} normales, {data.internalTransactions} internas, {data.tokenTransactions} tokens
          </div>
        )}
        
        {data.categories?.length ? (
          <div className="mt-2">
            <div className="font-semibold">Categorías</div>
            <ul className="list-disc ml-5 space-y-1">
              {data.categories.map((c, i) => <li key={`${c}-${i}`}>{c}</li>)}
            </ul>
          </div>
        ) : null}
        
        {data.exposure?.length ? (
          <div className="mt-2">
            <div className="font-semibold">Exposure</div>
            <ul className="list-disc ml-5 space-y-1">
              {data.exposure.map((e, i) => <li key={`${e.type}-${i}`}>{e.type}: {e.percent}%</li>)}
            </ul>
          </div>
        ) : null}
        
        {data.riskFactors?.length ? (
          <div className="mt-2">
            <div className="font-semibold">Factores de Riesgo</div>
            <ul className="list-disc ml-5 space-y-1">
              {data.riskFactors.map((f, i) => <li key={`${f}-${i}`} className="text-yellow-400">{f}</li>)}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}