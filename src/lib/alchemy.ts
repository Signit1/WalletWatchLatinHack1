export interface AlchemyAnalysisResponse {
  providerKey: 'alchemy';
  providerName: 'Alchemy';
  ethBalanceWei: string;
  erc20Balances: { contractAddress: string; tokenBalance: string }[];
  isContract: boolean;
  transferCount: number;
  transfersPreview: { hash: string | null; category?: string; from?: string; to?: string; value?: string | null; asset?: string | null }[];
  score: number;
  ofacHit: boolean;
  risk: 'high' | 'medium' | 'low';
  notes: string;
}

export async function analyzeWithAlchemy(address: string): Promise<AlchemyAnalysisResponse> {
  const res = await fetch('http://localhost:4000/api/alchemy/analyze', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Alchemy API error');
  }
  return res.json();
}


