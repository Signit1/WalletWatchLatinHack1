import React from 'react';
import type { AlchemyAnalysisResponse } from '../lib/alchemy';

function formatWeiToEth(weiHex: string): string {
  try {
    const wei = BigInt(weiHex);
    const etherTimes1e18 = wei;
    const whole = etherTimes1e18 / 10n ** 18n;
    const frac = (etherTimes1e18 % 10n ** 18n).toString().padStart(18, '0').slice(0, 6);
    return `${whole}.${frac} ETH`;
  } catch {
    return '0 ETH';
  }
}

export default function AlchemyDetails({ data }: { data: AlchemyAnalysisResponse }): React.JSX.Element {
  console.log('🔍 AlchemyDetails: Renderizando con datos:', data);
  
  try {
    return (
    <div className="mt-3 text-sm text-muted">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#0f1523] border border-[#263042] rounded-xl p-3">
          <div className="font-semibold mb-1">Balances</div>
          <div><span className="font-semibold">ETH:</span> {formatWeiToEth(data.ethBalanceWei)}</div>
          {data.erc20Balances?.length ? (
            <div className="mt-1">
              <div className="font-semibold">ERC-20 (top 5)</div>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                {data.erc20Balances.slice(0, 5).map((t, i) => {
                  console.log('🔍 Renderizando token:', t);
                  return (
                    <li key={`${t.contractAddress}-${i}`}>
                      {t.contractAddress?.slice(0, 6)}…{t.contractAddress?.slice(-4)} — {t.tokenBalance || '0'}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="mt-1 text-muted">Sin ERC-20 relevantes</div>
          )}
        </div>

        <div className="bg-[#0f1523] border border-[#263042] rounded-xl p-3">
          <div className="font-semibold mb-1">Tipo de cuenta</div>
          <div>{data.isContract ? 'Contrato (builder/contract)' : 'EOA (cuenta externa)'}</div>
          <div className="mt-2"><span className="font-semibold">Transferencias recientes:</span> {data.transferCount}</div>
        </div>
      </div>

      {data.transfersPreview?.length ? (
        <div className="bg-[#0f1523] border border-[#263042] rounded-xl p-3 mt-3">
          <div className="font-semibold mb-1">Últimas transferencias</div>
          <ul className="space-y-1">
            {data.transfersPreview.slice(0, 5).map((t, i) => {
              console.log('🔍 Renderizando transferencia:', t);
              return (
                <li key={`${t.hash}-${i}`} className="break-all">
                  <span className="font-semibold">{t.category || 'transferencia'}:</span> {t.from?.slice(0,6)}… → {t.to?.slice(0,6)}… {t.value ? `(${t.value} ${t.asset || ''})` : ''}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
    );
  } catch (error) {
    console.error('❌ AlchemyDetails: Error renderizando:', error);
    return (
      <div className="mt-3 text-sm text-red-400">
        Error renderizando detalles de Alchemy: {error instanceof Error ? error.message : 'Error desconocido'}
      </div>
    );
  }
}


