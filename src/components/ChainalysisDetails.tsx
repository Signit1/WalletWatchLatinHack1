import React from 'react';
import type { ChainalysisAnalysisResponse } from '../lib/chainalysis';

export default function ChainalysisDetails({ data }: { data: ChainalysisAnalysisResponse }): JSX.Element {
  return (
    <div className="mt-3 text-sm text-muted">
      <div className="bg-[#0f1523] border border-[#263042] rounded-xl p-3">
        <div className="font-semibold mb-1">Chainalysis</div>
        <div><span className="font-semibold">Sanciones:</span> {data.sanctionsHit ? 'Posible match' : 'No detectado'}</div>
        <div className="mt-1"><span className="font-semibold">Score:</span> {data.riskScore}/100 — {data.risk.toUpperCase()}</div>
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
      </div>
    </div>
  );
}


