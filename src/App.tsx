import React, { useMemo, useState } from 'react';
import { analyzeWithAlchemy } from './lib/alchemy';
import { analyzeWithElliptic } from './lib/elliptic';
import { screenWithOfac } from './lib/ofac';
import { analyzeWithChainalysis } from './lib/chainalysis';
import { analyzeWithEtherscan } from './lib/etherscan';
import EllipticDetailsWrapper from './components/EllipticDetailsWrapper';
import OfacDetailsWrapper from './components/OfacDetailsWrapper';
import AlchemyDetailsWrapper from './components/AlchemyDetailsWrapper';
import EtherscanDetailsWrapper from './components/EtherscanDetailsWrapper';
import { useMetaMask } from './hooks/useMetaMask';

type ProviderKey = 'alchemy' | 'elliptic' | 'ofac' | 'chainalysis' | 'etherscan';
type TabKey = 'analyze' | 'examples';

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

const EXAMPLE_WALLETS = [
  // ALTO RIESGO
  {
    address: '0x169AD27A470D064DEDE56a2D3ff727986b15D52B',
    name: 'Crypto Chueco',
    risk: 'ALTO',
    description: 'OFAC sancionada - Tornado Cash',
    emoji: '❌',
    color: 'text-red-400'
  },
  {
    address: '0x0836222F2B2B24A3F36f98668Ed8F0B38D1a872f',
    name: 'Doña Tranza',
    risk: 'ALTO',
    description: 'OFAC sancionada - Tornado Cash',
    emoji: '❌',
    color: 'text-red-400'
  },
  {
    address: '0x8576acc5c05d6ce88f4e49bf65bdf0c62f91353c',
    name: 'Gas Killer',
    risk: 'ALTO',
    description: 'OFAC sancionada - Actividad ilícita',
    emoji: '💀',
    color: 'text-red-400'
  },

  // MEDIO RIESGO
  {
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    name: 'Crypto Whale',
    risk: 'MEDIO',
    description: 'Múltiples transacciones, tokens ERC-20',
    emoji: '🐋',
    color: 'text-yellow-400'
  },
  {
    address: '0x8B3765eDA5207fB21690874B722ae276B96260e0',
    name: 'Gas Guzzler',
    risk: 'MEDIO',
    description: 'Transacciones internas, patrones sospechosos',
    emoji: '⛽',
    color: 'text-yellow-400'
  },
  {
    address: '0x7f367cc41522ce07553e823bf3be79a889debe1b',
    name: 'Wallet Zombie',
    risk: 'MEDIO',
    description: 'Actividad automatizada, patrones repetitivos',
    emoji: '🧟',
    color: 'text-yellow-400'
  },
  {
    address: '0x68749665ff8d2d112fa859aa293f07a622782f38',
    name: 'NFT Enthusiast',
    risk: 'MEDIO',
    description: 'Alta actividad en NFTs, transacciones frecuentes',
    emoji: '🖼️',
    color: 'text-yellow-400'
  },

  // BAJO RIESGO
  {
    address: '0xb5842F34d90b52cF6b970a781Dc74C5EDa37a07a',
    name: 'CryptoSaint',
    risk: 'BAJO',
    description: '1 transacción, balance bajo',
    emoji: '😇',
    color: 'text-green-400'
  },
  {
    address: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
    name: 'DeFi Explorer',
    risk: 'BAJO',
    description: 'Vitalik Buterin - Wallet famosa reconocida',
    emoji: '😇',
    color: 'text-green-400'
  },
  {
    address: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
    name: 'Token Collector',
    risk: 'BAJO',
    description: 'Binance Hot Wallet - Exchange reconocido',
    emoji: '😇',
    color: 'text-green-400'
  },

  // BUILDER (MÁXIMA SEGURIDAD)
  {
    address: '0x690b9a9e9aa1c9db991c7721a92d351db4fac990',
    name: 'Block Builder',
    risk: 'BAJO',
    description: 'Flashbots Builder - flashbots.eth (Máxima Seguridad)',
    emoji: '🏗️',
    color: 'text-blue-400'
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    name: 'Block Builder',
    risk: 'BAJO',
    description: 'Genesis Address - Ethereum Foundation (Máxima Seguridad)',
    emoji: '🏗️',
    color: 'text-blue-400'
  }
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

export default function App() {
  const [address, setAddress] = useState('');
  const [enabled, setEnabled] = useState(PROVIDERS.map(p => p.key)); // Todos los proveedores habilitados
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]);
  const [criticalError, setCriticalError] = useState(null);
  const [activeTab, setActiveTab] = useState('analyze' as TabKey);

  // MetaMask integration
  const {
    isConnected,
    account,
    chainId,
    provider,
    signer,
    error: metaMaskError,
    isMetaMaskInstalled,
    connect,
    disconnect
  } = useMetaMask();

  const overall = useMemo(() => results ? aggregateOverall(results) : null, [results]);

  function addDebugLog(message: string) {
    try {
      const timestamp = new Date().toLocaleTimeString();
      setDebugLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    } catch (error) {
      console.error('Error agregando log:', error);
    }
  }

  function selectExampleWallet(walletAddress: string) {
    setAddress(walletAddress);
    setResults(null); // Limpiar resultados anteriores
    setDebugLogs([]); // Limpiar logs de debug
    setCriticalError(null); // Limpiar errores críticos
    setActiveTab('analyze');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Limpiar resultados cuando se cambie a la pestaña de análisis
  React.useEffect(() => {
    if (activeTab === 'analyze') {
      // Solo limpiar si no hay dirección o si la dirección está vacía
      if (!address || address.trim() === '') {
        setResults(null);
        setDebugLogs([]);
        setCriticalError(null);
      }
    }
  }, [activeTab, address]);

  // Log cuando se actualizan los resultados
  React.useEffect(() => {
    if (results && results.length > 0) {
      addDebugLog(`🎨 Renderizando ${results.length} resultados...`);
      results.forEach(r => {
        addDebugLog(`✅ ${r.providerName} listo para renderizar`);
      });
    }
  }, [results]);

  async function onAnalyze(ev: any) {
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
          const base = pseudoRandomIntFromString(`${address}:${p.key}`, 100);
          const ofacHit = base % 19 === 0;
          const score = ofacHit ? 97 : base;
          const risk = classifyRisk(score, ofacHit);
          return { providerKey: p.key, providerName: p.name, score, ofacHit, risk, notes: 'Fallback simulado (error API Etherscan).' } as ProviderResult;
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
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Analizador de Riesgo AML/PLD
              </h1>
              <p className="text-muted mt-2 text-lg">Ingrese una wallet para evaluar su nivel de riesgo</p>
            </div>
            <div className="flex-1 flex justify-end">
              {/* Wallet Connection Button */}
              <div className="flex flex-col items-end gap-2">
                {!isMetaMaskInstalled ? (
                  <div className="text-right">
                    <p className="text-sm text-yellow-400 mb-2">MetaMask no detectado</p>
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      📥 Instalar MetaMask
                    </a>
                  </div>
                ) : !isConnected ? (
                  <button
                    onClick={connect}
                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    🦊 Conectar Wallet
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3 text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 text-sm font-medium">Conectado</span>
                      </div>
                      <p className="text-green-300 text-xs font-mono">
                        {account?.slice(0, 6)}...{account?.slice(-4)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {chainId === '0x7A69' ? 'Localhost' : `Chain ${chainId}`}
                      </p>
                    </div>
                    <button
                      onClick={disconnect}
                      className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                    >
                      Desconectar
                    </button>
                  </div>
                )}
                {metaMaskError && (
                  <p className="text-red-400 text-xs text-right max-w-48">
                    {metaMaskError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-4 relative z-10">
          {/* Pestañas */}
          <div className="flex space-x-1 mb-6 bg-gray-800/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('analyze')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'analyze'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
              🔍 Análisis
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'examples'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
              📋 Ejemplos
            </button>
          </div>
          {/* Contenido de pestañas */}
          {activeTab === 'examples' ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Ejemplos de Wallets para Probar</h2>
                <p className="text-muted mb-4">
                  💡 Instrucciones: Selecciona una wallet de la lista para probar el sistema.
                  La aplicación cambiará automáticamente a la pestaña de análisis con la wallet seleccionada.
                </p>
                <p className="text-sm text-gray-400">
                  📝 Nota: Además de estos ejemplos, puedes analizar cualquier wallet de Ethereum
                  ingresando su dirección en la pestaña de análisis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {EXAMPLE_WALLETS.map((wallet, index) => (
                  <div
                    key={wallet.address}
                    onClick={() => selectExampleWallet(wallet.address)}
                    className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 cursor-pointer hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{wallet.emoji}</span>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {wallet.name}
                          </h3>
                          <p className={`text-sm font-medium ${wallet.color}`}>
                            {wallet.risk} RIESGO
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-3">
                      {wallet.description}
                    </p>

                    <div className="bg-gray-900/50 rounded-lg p-2 font-mono text-xs text-gray-300 break-all">
                      {wallet.address}
                    </div>

                    <div className="mt-3 text-center">
                      <span className="text-blue-400 text-sm font-medium group-hover:text-blue-300">
                        👆 Haz clic para analizar
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  {loading && (
                    <div className="text-muted">Procesando...</div>
                  )}
                  {!loading && results?.map(r => {
                    try {
                      const score = r.score || r.riskScore || 0;
                      const ofacHit = r.ofacHit || r.sanctionsHit || false;

                      // Debug: Log para Etherscan específicamente
                      if (r.providerKey === 'etherscan') {
                        console.log('🔍 Etherscan Debug:', {
                          providerKey: r.providerKey,
                          score: r.score,
                          riskScore: r.riskScore,
                          finalScore: score,
                          risk: r.risk,
                          ofacHit: ofacHit,
                          notes: r.notes
                        });
                      }

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
                            {r.providerKey !== 'alchemy' && r.providerKey !== 'etherscan' && (
                              <>
                                <div><span className="font-semibold">Puntaje:</span> {(r.score || r.riskScore || 0)}/100</div>
                                <div><span className="font-semibold">Listas OFAC/FBI:</span> {(r.ofacHit || r.sanctionsHit) ? 'Posible match' : 'No detectado'}</div>
                              </>
                            )}
                            <div className="text-muted mt-1">
                              {r.providerKey === 'alchemy' ? 'Datos reales (balances, tipo de cuenta y últimas transferencias).' :
                                r.providerKey === 'etherscan' ? 'Datos reales de Etherscan.io (balance, transacciones y análisis de patrones).' :
                                  r.notes}
                            </div>
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

        {/* Sección de Debug Logs */}
        {debugLogs.length > 0 && (
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


