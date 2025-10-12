import React, { useEffect, useState } from 'react';
import { analyzeWithEtherscan, type EtherscanAnalysisResponse } from '../lib/etherscan';
import EtherscanDetails from './EtherscanDetails';

export default function EtherscanDetailsWrapper({ address }: { address: string }): React.JSX.Element {
  const [data, setData] = useState<EtherscanAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await analyzeWithEtherscan(address);
        if (!cancelled) setData(res);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Error cargando detalles de Etherscan');
      }
    })();
    return () => { cancelled = true; };
  }, [address]);

  if (error) {
    return (
      <div className="mt-3 text-sm text-red-400">
        ❌ Error en Etherscan: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-3 text-sm text-gray-400">
        🔍 Cargando datos de Etherscan...
      </div>
    );
  }

  return <EtherscanDetails data={data} />;
}
