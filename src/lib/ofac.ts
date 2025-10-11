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
  try {
    console.log('🔍 OFAC: Iniciando análisis para', address);
    
    const res = await fetch('http://localhost:4000/api/ofac/screen', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ address })
    });
    
    console.log('🔍 OFAC: Respuesta recibida', res.status, res.statusText);
    
    if (!res.ok) {
      const text = await res.text();
      console.error('❌ OFAC: Error HTTP', res.status, text);
      throw new Error(text || 'OFAC API error');
    }
    
    const data = await res.json();
    console.log('✅ OFAC: Datos recibidos', data);
    return data;
  } catch (error) {
    console.error('❌ OFAC: Error completo', error);
    throw error;
  }
}


