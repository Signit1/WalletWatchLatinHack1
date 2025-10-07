import React, { useEffect, useState } from 'react';
import { screenWithOfac, type OfacScreenResponse } from '../lib/ofac';
import OfacDetails from './OfacDetails';

export default function OfacDetailsWrapper({ address }: { address: string }): JSX.Element {
  const [data, setData] = useState<OfacScreenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await screenWithOfac(address);
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError((e as any)?.message || 'Error en screening OFAC');
      }
    })();
    return () => { cancelled = true; };
  }, [address]);

  if (error) return <div className="text-red-400 mt-3 text-sm">{error}</div>;
  if (!data) return <div className="text-muted mt-3 text-sm">Consultando OFAC…</div>;
  return <OfacDetails data={data} />;
}


