import React, { useEffect, useState } from 'react';
import { analyzeWithAlchemy, type AlchemyAnalysisResponse } from '../lib/alchemy';
import AlchemyDetails from './AlchemyDetails';

export default function AlchemyDetailsWrapper({ address }: { address: string }): JSX.Element {
  const [data, setData] = useState<AlchemyAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await analyzeWithAlchemy(address);
        if (!cancelled) setData(res);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Error cargando detalles de Alchemy');
      }
    })();
    return () => { cancelled = true; };
  }, [address]);

  if (error) return <div className="text-red-400 mt-3 text-sm">{error}</div>;
  if (!data) return <div className="text-muted mt-3 text-sm">Cargando detalles de Alchemy…</div>;
  return <AlchemyDetails data={data} />;
}


