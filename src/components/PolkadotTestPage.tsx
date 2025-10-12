import React, { useState, useEffect } from 'react';
import { paseoService, type VerificationData } from '../lib/paseoService';

export default function PolkadotTestPage(): React.JSX.Element {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [accountBalance, setAccountBalance] = useState<string>('0');
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [totalVerifications, setTotalVerifications] = useState<number>(0);
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [currentAccount, setCurrentAccount] = useState<string>('');
  const [contractInfo, setContractInfo] = useState<any>(null);

  // Test wallet address for demo
  const testWalletAddress = '0xab5801a7d398351b8be11c439e05c5b3259aec9b';

  useEffect(() => {
    initializePaseo();
  }, []);

  const initializePaseo = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      await paseoService.initialize();
      setIsConnected(true);
      
      // Get network info
      const info = await paseoService.getNetworkInfo();
      setNetworkInfo(info);
      
      // Get current account
      const account = paseoService.getCurrentAccount();
      if (account) {
        setCurrentAccount(account);
        const balance = await paseoService.getBalance(account);
        setAccountBalance(balance);
      }
      
      // Get contract info
      const contractInfo = await paseoService.getContractInfo();
      setContractInfo(contractInfo);
      
      // Get total verifications
      const total = await paseoService.getTotalVerifications();
      setTotalVerifications(total);
      
    } catch (error) {
      console.error('Failed to initialize Paseo:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect to Paseo testnet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWriteVerification = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Verify wallet on-chain
      const hash = await paseoService.verifyWalletOnChain(
        testWalletAddress,
        25, // Low risk score
        'Low',
        false
      );
      
      setTxHash(hash);
      
      // Update total verifications
      const total = await paseoService.getTotalVerifications();
      setTotalVerifications(total);
      
    } catch (error) {
      console.error('Failed to write verification:', error);
      setError(error instanceof Error ? error.message : 'Failed to write verification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadVerification = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Read verification from chain
      const data = await paseoService.readVerificationFromChain(testWalletAddress);
      setVerificationData(data);
      
    } catch (error) {
      console.error('Failed to read verification:', error);
      setError(error instanceof Error ? error.message : 'Failed to read verification');
    } finally {
      setIsLoading(false);
    }
  };

  const formatBalance = (balance: string): string => {
    const num = parseFloat(balance);
    return num.toFixed(4); // ETH balance
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 Paseo Test Page
          </h1>
          <p className="text-xl text-gray-300">
            Interactúa directamente con el smart contract de verificación en Paseo testnet
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">🔗 Estado de Conexión</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-white font-semibold">Conexión</span>
              </div>
              <p className="text-gray-300 text-sm">
                {isConnected ? 'Conectado a Paseo' : 'Desconectado'}
              </p>
            </div>

            {networkInfo && (
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white font-semibold mb-2">Red</div>
                <p className="text-gray-300 text-sm">Paseo Testnet</p>
                <p className="text-gray-400 text-xs">Chain ID: {networkInfo.chainId}</p>
              </div>
            )}

            {currentAccount && (
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white font-semibold mb-2">Cuenta</div>
                <p className="text-gray-300 text-sm font-mono">
                  {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                </p>
              </div>
            )}

            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white font-semibold mb-2">Balance</div>
              <p className="text-gray-300 text-sm">
                {formatBalance(accountBalance)} ETH
              </p>
            </div>
          </div>
        </div>

        {/* Test Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Write Operations */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">✍️ Operaciones de Escritura</h2>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Verificar Wallet</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Verifica una wallet en la blockchain con datos de riesgo
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-300">
                    <strong>Wallet:</strong> {testWalletAddress}
                  </div>
                  <div className="text-sm text-gray-300">
                    <strong>Risk Score:</strong> 25 (Low Risk)
                  </div>
                  <div className="text-sm text-gray-300">
                    <strong>Sanctioned:</strong> No
                  </div>
                </div>

                <button
                  onClick={handleWriteVerification}
                  disabled={!isConnected || isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {isLoading ? '⏳ Procesando...' : '🚀 Verificar en Blockchain'}
                </button>
              </div>

              {txHash && (
                <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">✅ Transacción Exitosa</h4>
                  <p className="text-green-300 text-sm font-mono break-all">
                    Hash: {txHash}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Read Operations */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">📖 Operaciones de Lectura</h2>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Leer Verificación</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Lee los datos de verificación de una wallet desde la blockchain
                </p>

                <button
                  onClick={handleReadVerification}
                  disabled={!isConnected || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {isLoading ? '⏳ Leyendo...' : '📖 Leer de Blockchain'}
                </button>
              </div>

              {verificationData && (
                <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">📊 Datos de Verificación</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-blue-300">
                      <strong>Risk Score:</strong> {verificationData.riskScore}
                    </div>
                    <div className="text-blue-300">
                      <strong>Risk Level:</strong> {verificationData.riskLevel}
                    </div>
                    <div className="text-blue-300">
                      <strong>Sanctioned:</strong> {verificationData.isSanctioned ? 'Yes' : 'No'}
                    </div>
                    <div className="text-blue-300">
                      <strong>Verified At:</strong> {new Date(verificationData.verifiedAt).toLocaleString()}
                    </div>
                    <div className="text-blue-300">
                      <strong>Verified By:</strong> {verificationData.verifiedBy}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mt-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">📊 Estadísticas del Contrato</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-2">{totalVerifications}</div>
              <div className="text-gray-300">Total Verificaciones</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-2">1</div>
              <div className="text-gray-300">Contratos Desplegados</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-2">Westend</div>
              <div className="text-gray-300">Red de Prueba</div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mt-8">
            <h4 className="text-red-400 font-semibold mb-2">❌ Error</h4>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Contract Information */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mt-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">📋 Información del Contrato</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">🔗 Red</h3>
              <p className="text-gray-300">Paseo Testnet</p>
              <p className="text-gray-400 text-sm">https://paseo-rpc.polkadot.io</p>
              <p className="text-gray-400 text-sm">Explorer: <a href="https://paseo.subscan.io/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">paseo.subscan.io</a></p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">📄 Contrato</h3>
              <p className="text-gray-300">VerificationContract</p>
              <p className="text-gray-400 text-sm font-mono break-all">
                Dirección: {paseoService.getContractAddress()}
              </p>
              {contractInfo && (
                <div className="mt-2 text-xs text-gray-400">
                  <p>Owner: {contractInfo.owner?.slice(0, 6)}...{contractInfo.owner?.slice(-4)}</p>
                  <p>Versión: {contractInfo.version}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
