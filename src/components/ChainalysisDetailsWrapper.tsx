import React, { useEffect, useState } from 'react';
import { analyzeWithChainalysis, type ChainalysisAnalysisResponse } from '../lib/chainalysis';
import ChainalysisDetails from './ChainalysisDetails';

export default function ChainalysisDetailsWrapper({ address }: { address: string }): JSX.Element {
  const [data, setData] = useState<ChainalysisAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await analyzeWithChainalysis(address);
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError((e as any)?.message || 'Error en Chainalysis');
      }
    })();
    return () => { cancelled = true; };
  }, [address]);

  if (error) return <div className="text-red-400 mt-3 text-sm">{error}</div>;
  if (!data) return <div className="text-muted mt-3 text-sm">Cargando Chainalysis…</div>;
  return <ChainalysisDetails data={data} />;
}


