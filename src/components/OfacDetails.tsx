import React from 'react';
import type { OfacScreenResponse } from '../lib/ofac';

export default function OfacDetails({ data }: { data: OfacScreenResponse }): JSX.Element {
  return (
    <div className="mt-3 text-sm text-muted">
      <div className="bg-[#0f1523] border border-[#263042] rounded-xl p-3">
        <div className="font-semibold mb-1">OFAC Screening</div>
        <div><span className="font-semibold">Resultado:</span> {data.sanctionsHit ? 'Posible match' : 'Sin coincidencias'}</div>
        {data.matches?.length ? (
          <ul className="list-disc ml-5 mt-2 space-y-1">
            {data.matches.map((m, i) => (
              <li key={`${m.reference || i}`}>{m.listName || 'Lista'} — {m.entity || 'Entidad'} {typeof m.score === 'number' ? `(${Math.round(m.score * 100)}%)` : ''}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}


