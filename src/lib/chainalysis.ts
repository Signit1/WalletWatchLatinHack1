export interface ChainalysisAnalysisResponse {
  providerKey: 'chainalysis';
  providerName: 'Chainalysis';
  sanctionsHit: boolean;
  riskScore: number;
  risk: 'high' | 'medium' | 'low';
  categories: string[];
  exposure: { type: string; percent: number }[];
  notes: string;
}

export async function analyzeWithChainalysis(address: string): Promise<ChainalysisAnalysisResponse> {
  const res = await fetch('http://localhost:4000/api/chainalysis/analyze', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Chainalysis API error');
  }
  return res.json();
}


