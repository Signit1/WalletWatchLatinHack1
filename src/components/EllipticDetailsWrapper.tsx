import React, { useEffect, useState } from 'react';
import { analyzeWithElliptic, type EllipticAnalysisResponse } from '../lib/elliptic';
import EllipticDetails from './EllipticDetails';

export default function EllipticDetailsWrapper({ address }: { address: string }): JSX.Element {
  const [data, setData] = useState<EllipticAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await analyzeWithElliptic(address);
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError((e as any)?.message || 'Error cargando detalles de Elliptic');
      }
    })();
    return () => { cancelled = true; };
  }, [address]);

  if (error) return <div className="text-red-400 mt-3 text-sm">{error}</div>;
  if (!data) return <div className="text-muted mt-3 text-sm">Cargando detalles de Elliptic…</div>;
  return <EllipticDetails data={data} />;
}
