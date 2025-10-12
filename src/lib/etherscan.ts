export interface EtherscanAnalysisResponse {
  providerKey: string;
  providerName: string;
  sanctionsHit: boolean;
  riskScore: number;
  risk: 'low' | 'medium' | 'high';
  ethBalance: string;
  transactionCount: number;
  isContract: boolean;
  lastTransaction: string | null;
  gasUsed: string;
  categories: string[];
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
