import React from 'react';
import type { EllipticAnalysisResponse } from '../lib/elliptic';

function riskClass(risk: 'high' | 'medium' | 'low'): string {
  if (risk === 'high') return 'bg-red-500/15 text-red-400 ring-1 ring-red-500/40';
  if (risk === 'medium') return 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/40';
  return 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40';
}

export default function EllipticDetails({ data }: { data: EllipticAnalysisResponse }): JSX.Element {
  return (
    <div className="mt-3 text-sm text-muted">
      <div className="flex items-center gap-2">
        <div className={`text-xs inline-flex items-center gap-2 px-2 py-1 rounded-full ring-1 ${riskClass(data.risk)}`}>
          <span>Riesgo Elliptic: {data.risk.toUpperCase()} ({data.riskScore}/100)</span>
        </div>
        {data.sanctionsHit && <span className="text-red-400">Posible match con listas</span>}
      </div>

      <div className="bg-[#0f1523] border border-[#263042] rounded-xl p-3 mt-2">
        <div className="font-semibold mb-1">Categorías</div>
        {data.categories?.length ? (
          <ul className="list-disc ml-5 space-y-1">
            {data.categories.map((c, i) => <li key={`${c}-${i}`}>{c}</li>)}
          </ul>
        ) : (
          <div className="text-muted">Sin categorías relevantes</div>
        )}
      </div>

      <div className="bg-[#0f1523] border border-[#263042] rounded-xl p-3 mt-2">
        <div className="font-semibold mb-1">Razones</div>
        {data.reasons?.length ? (
          <ul className="list-disc ml-5 space-y-1">
            {data.reasons.map((c, i) => <li key={`${c}-${i}`}>{c}</li>)}
          </ul>
        ) : (
          <div className="text-muted">Sin razones específicas</div>
        )}
      </div>
    </div>
  );
}


