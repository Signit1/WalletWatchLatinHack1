import React, { useEffect, useState } from 'react';
import { analyzeWithEtherscan, type EtherscanAnalysisResponse } from '../lib/etherscan';
import EtherscanDetails from './EtherscanDetails';

export default function EtherscanDetailsWrapper({ address }: { address: string }): JSX.Element {
  const [data, setData] = useState<EtherscanAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await analyzeWithEtherscan(address);
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError((e as any)?.message || 'Error en Etherscan');
      }
    })();
    return () => { cancelled = true; };
  }, [address]);

  if (error) return <div className="text-red-400 mt-3 text-sm">{error}</div>;
  if (!data) return <div className="text-muted mt-3 text-sm">Cargando Etherscan…</div>;
  return <EtherscanDetails data={data} />;
}