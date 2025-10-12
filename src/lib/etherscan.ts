export interface EtherscanAnalysisResponse {
  providerKey: 'etherscan';
  providerName: 'Etherscan';
  sanctionsHit: boolean;
  riskScore: number;
  risk: 'high' | 'medium' | 'low';
  categories: string[];
  exposure: { type: string; percent: number }[];
  balance?: number;
  totalTransactions?: number;
  normalTransactions?: number;
  internalTransactions?: number;
  tokenTransactions?: number;
  riskFactors?: string[];
  notes: string;
}

export async function analyzeWithEtherscan(address: string): Promise<EtherscanAnalysisResponse> {
  try {
    console.log('🔍 Etherscan: Iniciando análisis para', address);
    
    const res = await fetch('http://localhost:4000/api/etherscan/analyze', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ address })
    });
    
    console.log('🔍 Etherscan: Respuesta recibida', res.status, res.statusText);
    
    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Etherscan: Error HTTP', res.status, text);
      throw new Error(text || 'Etherscan API error');
    }
    
    const data = await res.json();
    console.log('✅ Etherscan: Datos recibidos', data);
    return data;
  } catch (error) {
    console.error('❌ Etherscan: Error completo', error);
    throw error;
  }
}