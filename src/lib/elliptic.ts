export interface EllipticAnalysisResponse {
  providerKey: 'elliptic';
  providerName: 'Elliptic';
  sanctionsHit: boolean;
  riskScore: number; // 0..100
  risk: 'high' | 'medium' | 'low';
  categories: string[];
  reasons: string[];
  notes: string;
}

export async function analyzeWithElliptic(address: string): Promise<EllipticAnalysisResponse> {
  try {
    // Log para debugging (solo en consola del navegador, no visible en pantalla)
    console.log('🔍 Elliptic: Iniciando análisis para', address);
    
    const res = await fetch('http://localhost:4000/api/elliptic/analyze', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ address })
    });
    
    
    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Elliptic: Error HTTP', res.status, text);
      throw new Error(text || 'Elliptic API error');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('❌ Elliptic: Error completo', error);
    throw error;
  }
}


