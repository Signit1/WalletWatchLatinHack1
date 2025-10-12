import React, { useMemo, useState } from 'react';
import { analyzeWithAlchemy } from './lib/alchemy';
import { analyzeWithElliptic } from './lib/elliptic';
import { screenWithOfac } from './lib/ofac';
import { analyzeWithChainalysis } from './lib/chainalysis';
import { analyzeWithEtherscan } from './lib/etherscan';
import MetaMaskIntegration from './components/MetaMaskIntegration';
import NFTImagePreview from './components/NFTImagePreview';
import WalletExamples from './components/WalletExamples';
import NFTGallery from './components/NFTGallery';
import EllipticDetailsWrapper from './components/EllipticDetailsWrapper';
import OfacDetailsWrapper from './components/OfacDetailsWrapper';
import AlchemyDetailsWrapper from './components/AlchemyDetailsWrapper';
import EtherscanDetailsWrapper from './components/EtherscanDetailsWrapper';
import PolkadotTestPage from './components/PolkadotTestPage';

type ProviderKey = 'alchemy' | 'elliptic' | 'ofac' | 'chainalysis' | 'etherscan';

interface ProviderDef { key: ProviderKey; name: string }
interface ProviderResult {
  providerKey: ProviderKey;
  providerName: string;
  score: number; // 0..100
  ofacHit: boolean;
  risk: 'high' | 'medium' | 'low';
  notes: string;
}

const PROVIDERS: ProviderDef[] = [
  { key: 'alchemy', name: 'Alchemy' },
  { key: 'elliptic', name: 'Elliptic' },
  { key: 'ofac', name: 'OFAC' },
  { key: 'chainalysis', name: 'Chainalysis' },
  { key: 'etherscan', name: 'Etherscan' }
];

function pseudoRandomIntFromString(input: string, maxExclusive: number): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(hash) % maxExclusive;
}

function classifyRisk(score: number, ofacHit: boolean): ProviderResult['risk'] {
  if (ofacHit) return 'high';
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getRiskProfile(score: number, ofacHit: boolean, notes?: string): { name: string; emoji: string; description: string; subtitle: string } {
  // Validación de parámetros
  if (typeof score !== 'number' || isNaN(score)) {
    console.warn('getRiskProfile: score inválido:', score);
    score = 0;
  }
  
  // Casos especiales - MÁXIMA ALERTA
  if (ofacHit) {
    return {
      name: "DO NOT INTERACT",
      emoji: "❌",
      description: "Score automático: 10/10 (Riesgo Máximo)",
      subtitle: "🚫 Alertas legales sobre consecuencias"
    };
  }

  // Builders - MÁXIMA SEGURIDAD
  if (notes?.includes('Builder detectado')) {
    return {
      name: "Block Builder",
      emoji: "🏗️",
      description: "Constructor de bloques - infraestructura crítica de Ethereum",
      subtitle: "Máxima confianza - mantiene la red funcionando"
    };
  }

  // ALTO RIESGO (70-100)
  if (score >= 95) {
    return {
      name: "Gas Killer",
      emoji: "⚡",
      description: "Asesino de gas fees - optimiza todo al máximo",
      subtitle: "O es un genio... o está haciendo algo raro"
    };
  }
  if (score >= 90) {
    return {
      name: "Doña Tranza",
      emoji: "👩‍💼",
      description: "La jefa de las finanzas descentralizadas - no te metas con ella",
      subtitle: "Poder extremo en DeFi"
    };
  }
  if (score >= 70) {
    return {
      name: "Crypto Chueco",
      emoji: "🕵️",
      description: "Algo no huele bien aquí - actividad muy sospechosa",
      subtitle: "Red flags por todos lados"
    };
  }

  // RIESGO MEDIO (40-69)
  if (score >= 60) {
    return {
      name: "NFT Enthusiast",
      emoji: "🖼️",
      description: "Vive por los JPEGs - su wallet es un museo digital",
      subtitle: "Coleccionista obsesivo de arte digital"
    };
  }
  if (score >= 50) {
    return {
      name: "Crypto Whale",
      emoji: "🐋",
      description: "Ballena que mueve mercados con una transacción",
      subtitle: "Big money moves"
    };
  }
  if (score >= 45) {
    return {
      name: "Wallet Zombie",
      emoji: "🧟",
      description: "Wallet muerta que de repente se activa - muy sospechoso",
      subtitle: "Inactiva por meses y luego... ¡boom!"
    };
  }
  if (score >= 40) {
    return {
      name: "Gas Guzzler",
      emoji: "⛽",
      description: "Come gas para desayunar - no le importan las fees",
      subtitle: "Trader activo que paga lo que sea"
    };
  }

  // BAJO RIESGO (0-39) - Aleatorio entre los 4 tipos
  const lowRiskTypes = [
    {
      name: "CryptoSaint",
      emoji: "😇",
      description: "Un santo de las finanzas descentralizadas - nunca ha tocado un scam",
      subtitle: "La wallet más limpia del barrio"
    },
    {
      name: "DeFi Explorer",
      emoji: "🔍",
      description: "Aventurero de protocolos - prueba todo antes que nadie",
      subtitle: "Curioso pero cuidadoso"
    },
    {
      name: "Token Collector",
      emoji: "🪙",
      description: "Colecciona tokens como cartas pokémon - tiene de todo",
      subtitle: "Diversificado como debe ser"
    },
    {
      name: "CryptoSaint",
      emoji: "😇",
      description: "Un santo de las finanzas descentralizadas - nunca ha tocado un scam",
      subtitle: "La wallet más limpia del barrio"
    }
  ];
  
  // Usar el score para seleccionar de manera determinística
  const index = Math.floor(score) % lowRiskTypes.length;
  return lowRiskTypes[index];
}

function riskLabel(risk: ProviderResult['risk']): string {
  return risk === 'high' ? 'Alto' : risk === 'medium' ? 'Medio' : 'Bajo';
}

function riskClass(risk: ProviderResult['risk']): string {
  if (risk === 'high') return 'bg-red-500/15 text-red-400 ring-1 ring-red-500/40';
  if (risk === 'medium') return 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/40';
  return 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40';
}

function aggregateOverall(results: ProviderResult[]): ProviderResult['risk'] {
  if (results.some(r => r.risk === 'high')) return 'high';
  if (results.some(r => r.risk === 'medium')) return 'medium';
  return 'low';
}

export default function App(): React.JSX.Element {
  const [address, setAddress] = useState('');
  const [enabled, setEnabled] = useState<ProviderKey[]>(PROVIDERS.map(p => p.key)); // Todos los proveedores habilitados
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProviderResult[] | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [criticalError, setCriticalError] = useState<string | null>(null);
  const [nftMinted, setNftMinted] = useState<{ 
    tokenId: number; 
    transactionHash: string; 
    imageUrl?: string; 
    metadata?: any;
  } | null>(null);
  const [polkadotAddress, setPolkadotAddress] = useState('');
  const [activeTab, setActiveTab] = useState<'analysis' | 'gallery' | 'examples' | 'test'>('analysis');

  const overall = useMemo(() => results ? aggregateOverall(results) : null, [results]);

  function addDebugLog(message: string) {
    try {
      const timestamp = new Date().toLocaleTimeString();
      setDebugLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    } catch (error) {
      console.error('Error agregando log:', error);
    }
  }

  const handleMintSuccess = (tokenId: number, transactionHash: string, imageUrl?: string, metadata?: any) => {
    setNftMinted({ tokenId, transactionHash, imageUrl, metadata });
    addDebugLog(`✅ NFT minted successfully! Token ID: ${tokenId}, TX: ${transactionHash}`);
    if (imageUrl) {
      addDebugLog(`🖼️ NFT image generated: ${imageUrl.slice(0, 50)}...`);
    }
  };

  const handleMintError = (error: string) => {
    addDebugLog(`❌ NFT minting error: ${error}`);
  };

  const handleSelectWallet = (walletAddress: string, polkadotAddr: string) => {
    setAddress(walletAddress);
    setPolkadotAddress(polkadotAddr);
    setActiveTab('analysis'); // Cambiar automáticamente a la pestaña de análisis
    addDebugLog(`🎯 Wallet seleccionada: ${walletAddress.slice(0, 8)}...`);
    addDebugLog(`🔗 Polkadot: ${polkadotAddr.slice(0, 8)}...`);
  };

  // Log cuando se actualizan los resultados
  React.useEffect(() => {
    if (results && results.length > 0) {
      addDebugLog(`🎨 Renderizando ${results.length} resultados...`);
      results.forEach(r => {
        addDebugLog(`✅ ${r.providerName} listo para renderizar`);
      });
    }
  }, [results]);

  async function onAnalyze(ev: React.FormEvent<HTMLFormElement>) {
    try {
      ev.preventDefault();
      if (!address.trim()) return;
      
      addDebugLog(`🚀 Iniciando análisis para: ${address}`);
      setLoading(true);
      setResults(null);
      setDebugLogs([]); // Limpiar logs anteriores
      await new Promise(r => setTimeout(r, 250));
    } catch (error) {
      addDebugLog(`❌ ERROR CRÍTICO en onAnalyze: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error crítico en onAnalyze:', error);
      setLoading(false);
      return;
    }

    const active = PROVIDERS.filter(p => enabled.includes(p.key));
    const promises = active.map(async (p) => {
      if (p.key === 'alchemy') {
        try {
          addDebugLog(`🔍 Procesando Alchemy...`);
          const real = await analyzeWithAlchemy(address);
          addDebugLog(`✅ Alchemy exitoso: ${real.risk} (${real.score})`);
          return {
            providerKey: real.providerKey,
            providerName: real.providerName,
            score: real.score,
            ofacHit: real.ofacHit,
            risk: real.risk,
            notes: real.notes
          } as ProviderResult;
        } catch (error) {
          addDebugLog(`❌ Error en Alchemy: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          console.error('Error en Alchemy:', error);
          // fallback a simulado si falla el backend
          const base = pseudoRandomIntFromString(`${address}:${p.key}`, 100);
          const ofacHit = base % 23 === 0;
          const score = ofacHit ? 95 : base;
          const risk = classifyRisk(score, ofacHit);
          return { providerKey: p.key, providerName: p.name, score, ofacHit, risk, notes: 'Fallback simulado (error API).' } as ProviderResult;
        }
      }
      if (p.key === 'elliptic') {
        try {
          addDebugLog(`🔍 Procesando Elliptic...`);
          const real = await analyzeWithElliptic(address);
          addDebugLog(`✅ Elliptic exitoso: ${real.risk} (${real.riskScore})`);
          return {
            providerKey: real.providerKey,
            providerName: real.providerName,
            score: real.riskScore,
            ofacHit: real.sanctionsHit,
            risk: real.risk,
            notes: real.notes
          } as ProviderResult;
        } catch (error) {
          addDebugLog(`❌ Error en Elliptic: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          console.error('Error en Elliptic:', error);
          const base = pseudoRandomIntFromString(`${address}:${p.key}`, 100);
          const ofacHit = base % 29 === 0;
          const score = ofacHit ? 90 : base;
          const risk = classifyRisk(score, ofacHit);
          return { providerKey: p.key, providerName: p.name, score, ofacHit, risk, notes: 'Fallback simulado (error API Elliptic).' } as ProviderResult;
        }
      }
      if (p.key === 'ofac') {
        try {
          addDebugLog(`🔍 Procesando OFAC...`);
          const real = await screenWithOfac(address);
          addDebugLog(`✅ OFAC exitoso: ${real.sanctionsHit ? 'SANCIONADO' : 'LIMPIO'}`);
          return {
            providerKey: real.providerKey,
            providerName: real.providerName,
            score: real.sanctionsHit ? 100 : 0,
            ofacHit: real.sanctionsHit,
            risk: real.sanctionsHit ? 'high' : 'low',
            notes: real.notes
          } as ProviderResult;
        } catch (error) {
          addDebugLog(`❌ Error en OFAC: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          console.error('Error en OFAC:', error);
          return { providerKey: 'ofac', providerName: 'OFAC', score: 0, ofacHit: false, risk: 'low', notes: 'Fallback simulado (error API OFAC).' } as ProviderResult;
        }
      }
      if (p.key === 'chainalysis') {
        try {
          addDebugLog(`🔍 Procesando Chainalysis...`);
          const real = await analyzeWithChainalysis(address);
          addDebugLog(`✅ Chainalysis exitoso: ${real.risk} (${real.riskScore})`);
          return {
            providerKey: real.providerKey,
            providerName: real.providerName,
            score: real.riskScore,
            ofacHit: real.sanctionsHit,
            risk: real.risk,
            notes: real.notes
          } as ProviderResult;
        } catch (error) {
          addDebugLog(`❌ Error en Chainalysis: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          console.error('Error en Chainalysis:', error);
          const base = pseudoRandomIntFromString(`${address}:${p.key}`, 100);
          const ofacHit = base % 17 === 0;
          const score = ofacHit ? 96 : base;
          const risk = classifyRisk(score, ofacHit);
          return { providerKey: p.key, providerName: p.name, score, ofacHit, risk, notes: 'Fallback simulado (error API Chainalysis).' } as ProviderResult;
        }
      }
      if (p.key === 'etherscan') {
        try {
          addDebugLog(`🔍 Procesando Etherscan...`);
          const real = await analyzeWithEtherscan(address);
          addDebugLog(`✅ Etherscan exitoso: ${real.risk} (${real.riskScore})`);
          return {
            providerKey: real.providerKey,
            providerName: real.providerName,
            score: real.riskScore,
            ofacHit: real.sanctionsHit,
            risk: real.risk,
            notes: real.notes
          } as ProviderResult;
        } catch (error) {
          addDebugLog(`❌ Error en Etherscan: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          console.error('Error en Etherscan:', error);
          return { providerKey: 'etherscan', providerName: 'Etherscan', score: 0, ofacHit: false, risk: 'low', notes: 'Fallback simulado (error API Etherscan).' } as ProviderResult;
        }
      }
      // Otros proveedores: simulado
      const base = pseudoRandomIntFromString(`${address}:${p.key}`, 100);
      const ofacHit = base % 23 === 0;
      const score = ofacHit ? 95 : base;
      const risk = classifyRisk(score, ofacHit);
      return { providerKey: p.key, providerName: p.name, score, ofacHit, risk, notes: 'Simulación demo.' } as ProviderResult;
    });

    try {
      addDebugLog(`⏳ Esperando ${promises.length} proveedores...`);
      const resolved = await Promise.allSettled(promises);
      const successfulResults = resolved
        .filter((result): result is PromiseFulfilledResult<ProviderResult> => result.status === 'fulfilled')
        .map(result => result.value);
      
      addDebugLog(`✅ Análisis completado: ${successfulResults.length}/${resolved.length} proveedores exitosos`);
      console.log('Resultados exitosos:', successfulResults.length);
      setResults(successfulResults);
    } catch (e) {
      addDebugLog(`❌ Error general en análisis: ${e instanceof Error ? e.message : 'Error desconocido'}`);
      console.error('Error en análisis:', e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleProvider(key: ProviderKey) {
    setEnabled(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }

  // Si hay un error crítico, mostrar solo el error
  if (criticalError) {
    return (
      <div className="min-h-screen bg-red-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">❌ Error Crítico</h1>
        <div className="bg-red-800 p-4 rounded">
          <p className="font-mono text-sm">{criticalError}</p>
        </div>
        <button 
          onClick={() => {
            setCriticalError(null);
            setDebugLogs([]);
            setResults(null);
          }}
          className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Reiniciar Aplicación
        </button>
      </div>
    );
  }

  try {
    return (
      <div className="min-h-screen text-text relative">
      {/* Partículas flotantes */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      <header className="px-4 pt-8 pb-2 text-center relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Analizador de Riesgo AML/PLD
          </h1>
          <p className="text-muted text-lg">Ingrese una wallet para evaluar su nivel de riesgo</p>
        </div>
        
        {/* Sistema de pestañas */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 rounded-lg p-1 flex gap-1">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                activeTab === 'analysis'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              🔍 Análisis
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                activeTab === 'examples'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              🎯 Ejemplos
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                activeTab === 'gallery'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              🖼️ Galería
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                activeTab === 'test'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              🚀 Test
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 relative z-10">
        {activeTab === 'test' ? (
          <PolkadotTestPage />
        ) : activeTab === 'gallery' ? (
          <NFTGallery />
        ) : activeTab === 'examples' ? (
          <WalletExamples onSelectWallet={handleSelectWallet} />
        ) : (
          <>
        <section className="card-enhanced rounded-xl p-6 hover-glow">
          <form onSubmit={onAnalyze} className="space-y-3" autoComplete="off">
            <label htmlFor="wallet" className="block text-muted">Wallet address</label>
            <div className="flex gap-2">
              <input
                id="wallet"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="0x... o dirección compatible"
                minLength={6}
                required
                className="flex-1 bg-[#0f1523] border border-[#263042] rounded-lg px-3 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white rounded-lg px-4 py-3 disabled:opacity-60"
              >{loading ? 'Analizando...' : 'Analizar wallet'}</button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-muted mt-2">
              <span>Fuentes de análisis</span>
              {PROVIDERS.map(p => (
                <label key={p.key} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={enabled.includes(p.key)}
                    onChange={() => toggleProvider(p.key)}
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </form>
        </section>


        <section className={`card-enhanced rounded-xl p-6 mt-6 hover-glow ${!results && !loading ? 'hidden' : ''}`} aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Resultados de análisis</h2>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ring-1 ${overall ? riskClass(overall) : 'bg-[#111827] text-muted ring-1 ring-[#263042]'}`}>
              <span>{overall ? riskLabel(overall) : 'Pendiente'}</span>
            </div>
          </div>

          {/* Sección de NFT de Verificación */}
          {results && results.length > 0 && (
            <div className="mt-6">
              <MetaMaskIntegration
                walletAddress={address}
                riskLevel={overall?.risk || 'unknown'}
                riskProfile={overall ? getRiskProfile(overall.score, overall.ofacHit, overall.notes).name : 'Unknown'}
                polkadotAddress={polkadotAddress}
                onMintSuccess={handleMintSuccess}
                onMintError={handleMintError}
              />
              
              {/* Mostrar NFT mintado */}
              {nftMinted && (
                <div className="mt-4 space-y-4">
                  <div className="card-enhanced rounded-xl p-6 border-green-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">🎉</div>
                      <h3 className="text-lg font-semibold">NFT Emitido Exitosamente</h3>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                      <p className="text-sm text-gray-300">
                        <strong>Token ID:</strong> #{nftMinted.tokenId}
                      </p>
                      <p className="text-sm text-gray-300">
                        <strong>Transaction Hash:</strong> 
                        <span className="font-mono text-blue-400 ml-2">
                          {nftMinted.transactionHash.slice(0, 10)}...{nftMinted.transactionHash.slice(-8)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-300">
                        <strong>Wallet Verificada:</strong> {address}
                      </p>
                      {nftMinted.imageUrl && (
                        <p className="text-sm text-green-400">
                          <strong>Imagen:</strong> Generada exitosamente
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mostrar imagen del NFT */}
                  {nftMinted.imageUrl && nftMinted.metadata && (
                    <NFTImagePreview
                      data={{
                        walletAddress: address,
                        riskLevel: overall?.risk || 'unknown',
                        riskProfile: overall ? getRiskProfile(overall.score, overall.ofacHit, overall.notes).name : 'Unknown',
                        riskScore: overall?.score || 0,
                        verificationDate: new Date().toISOString().split('T')[0],
                        polkadotAddress: polkadotAddress,
                        tokenId: nftMinted.tokenId
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            {loading && (
              <div className="text-muted">Procesando...</div>
            )}
            {!loading && results?.map(r => {
              try {
                // Usar el riesgo general (overall) para los nombres funny, no el score individual
                const score = overall?.score || r.score || r.riskScore || 0;
                const ofacHit = overall?.ofacHit || r.ofacHit || r.sanctionsHit || false;
                const riskProfile = getRiskProfile(score, ofacHit, r.notes);
                
                // Validar que riskProfile no sea undefined
                if (!riskProfile || !riskProfile.emoji) {
                  console.error('riskProfile inválido para', r.providerName, ':', riskProfile);
                  return (
                    <div key={r.providerKey} className="card-enhanced rounded-xl p-4 border-red-500">
                      <div className="text-red-400">
                        Error: Perfil de riesgo inválido para {r.providerName}
                      </div>
                    </div>
                  );
                }
                
                return (
                <div key={r.providerKey} className="card-enhanced rounded-xl p-4 hover-glow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold">{r.providerName}</div>
                    <div className={`text-xs inline-flex items-center gap-2 px-2 py-1 rounded-full ring-1 ${riskClass(r.risk || 'low')}`}>
                      <span>{riskLabel(r.risk || 'low')}</span>
                    </div>
                  </div>
                  
                  {/* Perfil de riesgo chistoso */}
                  <div className="mb-3 p-3 bg-black/20 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{riskProfile.emoji}</span>
                      <span className="font-bold text-sm">{riskProfile.name}</span>
                    </div>
                    <div className="text-xs text-muted mb-1">{riskProfile.description}</div>
                    <div className="text-xs text-blue-300 italic">{riskProfile.subtitle}</div>
                  </div>

                  <div className="space-y-1 text-sm">
                    {r.providerKey !== 'alchemy' && (
                      <>
                        <div><span className="font-semibold">Puntaje:</span> {(r.score || r.riskScore || 0)}/100</div>
                        <div><span className="font-semibold">Listas OFAC/FBI:</span> {(r.ofacHit || r.sanctionsHit) ? 'Posible match' : 'No detectado'}</div>
                      </>
                    )}
                    <div className="text-muted mt-1">{r.providerKey === 'alchemy' ? 'Datos reales (balances, tipo de cuenta y últimas transferencias).' : r.notes}</div>
                  </div>
                {r.providerKey === 'alchemy' && (
                  <AlchemyDetailsWrapper address={address} />
                )}
                {r.providerKey === 'elliptic' && (
                  <EllipticDetailsWrapper address={address} />
                )}
                {r.providerKey === 'ofac' && (
                  <OfacDetailsWrapper address={address} />
                )}
                {r.providerKey === 'etherscan' && (
                  <EtherscanDetailsWrapper address={address} />
                )}
                </div>
                );
              } catch (error) {
                console.error(`Error renderizando ${r.providerName}:`, error);
                return (
                  <div key={r.providerKey} className="card-enhanced rounded-xl p-4 border-red-500">
                    <div className="text-red-400">
                      Error renderizando {r.providerName}: {error instanceof Error ? error.message : 'Error desconocido'}
                    </div>
                  </div>
                );
              }
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-muted mt-4">
            <div className="inline-flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block mr-2"></span> 🔴 Alto (Crypto Chueco, Doña Tranza, Gas Killer)</div>
            <div className="inline-flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block mr-2"></span> 🟡 Medio (Gas Guzzler, Wallet Zombie, Crypto Whale, NFT Enthusiast)</div>
            <div className="inline-flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mr-2"></span> 🟢 Bajo (CryptoSaint, DeFi Explorer, Token Collector)</div>
            <div className="inline-flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block mr-2"></span> 🏗️ Builder (Block Builder - Máxima Seguridad)</div>
          </div>
        </section>
          </>
        )}
      </main>

      {/* Sección de Debug Logs - OCULTA PARA EL USUARIO */}
      {false && debugLogs.length > 0 && (
        <section className="py-8 relative z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="card-enhanced rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🔍 Logs de Debug
                <button 
                  onClick={() => setDebugLogs([])}
                  className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500/30"
                >
                  Limpiar
                </button>
              </h2>
              <div className="bg-black/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <div className="font-mono text-sm space-y-1">
                  {debugLogs.map((log, i) => (
                    <div key={i} className={log.includes('❌') ? 'text-red-400' : log.includes('✅') ? 'text-green-400' : 'text-blue-400'}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="text-center text-muted py-8 relative z-10">
        <div className="card-enhanced rounded-xl p-4 max-w-md mx-auto">
          <small className="text-sm">Demo. Integre credenciales reales para datos en vivo.</small>
        </div>
      </footer>
    </div>
    );
  } catch (error) {
    // Error crítico en el renderizado
    const errorMessage = `Error crítico en renderizado: ${error instanceof Error ? error.message : 'Error desconocido'}`;
    console.error('Error crítico en App:', error);
    
    return (
      <div className="min-h-screen bg-red-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">❌ Error Crítico en Renderizado</h1>
        <div className="bg-red-800 p-4 rounded">
          <p className="font-mono text-sm">{errorMessage}</p>
          <details className="mt-2">
            <summary className="cursor-pointer">Stack Trace</summary>
            <pre className="text-xs mt-2 overflow-auto">
              {error instanceof Error ? error.stack : 'No stack trace available'}
            </pre>
          </details>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Recargar Página
        </button>
      </div>
    );
  }
}


