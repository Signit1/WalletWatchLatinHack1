import React, { useMemo, useState } from 'react';
import { analyzeWithAlchemy } from './lib/alchemy';
import { analyzeWithElliptic } from './lib/elliptic';
import { screenWithOfac } from './lib/ofac';
import EllipticDetailsWrapper from './components/EllipticDetailsWrapper';
import OfacDetailsWrapper from './components/OfacDetailsWrapper';
import AlchemyDetailsWrapper from './components/AlchemyDetailsWrapper';

type ProviderKey = 'alchemy' | 'elliptic' | 'ofac' | 'blockchain' | 'fireblocks' | 'bridge' | 'chainalysis';

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
  { key: 'blockchain', name: 'Blockchain.com' },
  { key: 'fireblocks', name: 'Fireblocks' },
  { key: 'bridge', name: 'Bridge' },
  { key: 'chainalysis', name: 'Chainalysis' }
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

export default function App(): JSX.Element {
  const [address, setAddress] = useState('');
  const [enabled, setEnabled] = useState<ProviderKey[]>(PROVIDERS.map(p => p.key));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ProviderResult[] | null>(null);

  const overall = useMemo(() => results ? aggregateOverall(results) : null, [results]);

  async function onAnalyze(ev: React.FormEvent) {
    ev.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    setResults(null);
    await new Promise(r => setTimeout(r, 250));

    const active = PROVIDERS.filter(p => enabled.includes(p.key));
    const promises = active.map(async (p) => {
      if (p.key === 'alchemy') {
        try {
          const real = await analyzeWithAlchemy(address);
          return {
            providerKey: real.providerKey,
            providerName: real.providerName,
            score: real.score,
            ofacHit: real.ofacHit,
            risk: real.risk,
            notes: real.notes
          } as ProviderResult;
        } catch {
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
          const real = await analyzeWithElliptic(address);
          return {
            providerKey: real.providerKey,
            providerName: real.providerName,
            score: real.riskScore,
            ofacHit: real.sanctionsHit,
            risk: real.risk,
            notes: real.notes
          } as ProviderResult;
        } catch {
          const base = pseudoRandomIntFromString(`${address}:${p.key}`, 100);
          const ofacHit = base % 29 === 0;
          const score = ofacHit ? 90 : base;
          const risk = classifyRisk(score, ofacHit);
          return { providerKey: p.key, providerName: p.name, score, ofacHit, risk, notes: 'Fallback simulado (error API Elliptic).' } as ProviderResult;
        }
      }
      if (p.key === 'ofac') {
        try {
          const real = await screenWithOfac(address);
          return {
            providerKey: real.providerKey,
            providerName: real.providerName,
            score: real.sanctionsHit ? 100 : 0,
            ofacHit: real.sanctionsHit,
            risk: real.sanctionsHit ? 'high' : 'low',
            notes: real.notes
          } as ProviderResult;
        } catch {
          return { providerKey: 'ofac', providerName: 'OFAC', score: 0, ofacHit: false, risk: 'low', notes: 'Fallback simulado (error API OFAC).' } as ProviderResult;
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
      const resolved = await Promise.all(promises);
      setResults(resolved);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleProvider(key: ProviderKey) {
    setEnabled(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="px-4 pt-8 pb-2 text-center">
        <h1 className="text-2xl font-semibold">Analizador de Riesgo AML/PLD</h1>
        <p className="text-muted mt-1">Ingrese una wallet para evaluar su nivel de riesgo</p>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        <section className="bg-card border border-[#263042] rounded-xl p-4">
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

        <section className={`bg-card border border-[#263042] rounded-xl p-4 mt-4 ${!results && !loading ? 'hidden' : ''}`} aria-live="polite">
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
            {!loading && results?.map(r => (
              <div key={r.providerKey} className="bg-[#0f1523] border border-[#263042] rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{r.providerName}</div>
                  <div className={`text-xs inline-flex items-center gap-2 px-2 py-1 rounded-full ring-1 ${riskClass(r.risk)}`}>
                    <span>{riskLabel(r.risk)}</span>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  {r.providerKey !== 'alchemy' && (
                    <>
                      <div><span className="font-semibold">Puntaje:</span> {r.score}/100</div>
                      <div><span className="font-semibold">Listas OFAC/FBI:</span> {r.ofacHit ? 'Posible match' : 'No detectado'}</div>
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
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-muted mt-4">
            <div className="inline-flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block mr-2"></span> Alto (OFAC/FBI u otras)</div>
            <div className="inline-flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block mr-2"></span> Medio (señales de riesgo)</div>
            <div className="inline-flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mr-2"></span> Bajo (sin hallazgos relevantes)</div>
          </div>
        </section>
      </main>

      <footer className="text-center text-muted py-6">
        <small>Demo. Integre credenciales reales para datos en vivo.</small>
      </footer>
    </div>
  );
}


