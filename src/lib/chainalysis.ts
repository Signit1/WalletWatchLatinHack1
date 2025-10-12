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
  try {
    // Log para debugging (solo en consola del navegador, no visible en pantalla)
    console.log('🔍 Chainalysis: Iniciando análisis para', address);
    
    const res = await fetch('http://localhost:4000/api/chainalysis/analyze', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ address })
    });
    
    
    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Chainalysis: Error HTTP', res.status, text);
      throw new Error(text || 'Chainalysis API error');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('❌ Chainalysis: Error completo', error);
    throw error;
  }
}


