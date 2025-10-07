export interface OfacMatch {
  listName?: string;
  entity?: string;
  score?: number;
  reference?: string;
}

export interface OfacScreenResponse {
  providerKey: 'ofac';
  providerName: 'OFAC Screening';
  sanctionsHit: boolean;
  matches: OfacMatch[];
  notes: string;
}

export async function screenWithOfac(address: string): Promise<OfacScreenResponse> {
  const res = await fetch('http://localhost:4000/api/ofac/screen', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ address })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'OFAC API error');
  }
  return res.json();
}


