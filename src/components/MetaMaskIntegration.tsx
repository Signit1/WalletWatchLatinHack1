import React, { useState, useEffect } from 'react';
import { useMetaMask } from '../hooks/useMetaMask';
import { nftService } from '../lib/nftService';
import { polkadotService } from '../lib/polkadotService';

interface MetaMaskIntegrationProps {
  walletAddress: string;
  riskLevel: string;
  riskProfile: string;
  polkadotAddress?: string;
  onMintSuccess?: (tokenId: number, transactionHash: string, imageUrl?: string, metadata?: any) => void;
  onMintError?: (error: string) => void;
}

export default function MetaMaskIntegration({
  walletAddress,
  riskLevel,
  riskProfile,
  polkadotAddress: initialPolkadotAddress,
  onMintSuccess,
  onMintError
}: MetaMaskIntegrationProps): React.JSX.Element {
  const {
    isConnected,
    account,
    chainId,
    provider,
    signer,
    error: metaMaskError,
    isMetaMaskInstalled,
    connect,
    disconnect,
    setupLocalhost
  } = useMetaMask();

  const [isMinting, setIsMinting] = useState(false);
  const [isWalletVerified, setIsWalletVerified] = useState(false);
  const [existingTokenId, setExistingTokenId] = useState<number | null>(null);
  const [isVerifyingOnChain, setIsVerifyingOnChain] = useState(false);
  const [onChainTxHash, setOnChainTxHash] = useState<string>('');

  // Verificar si la wallet ya está verificada
  useEffect(() => {
    if (provider && walletAddress) {
      checkIfWalletVerified();
    }
  }, [provider, walletAddress]);

  const checkIfWalletVerified = async () => {
    try {
      await nftService.initialize(provider!);
      const verified = await nftService.isWalletVerified(walletAddress);
      setIsWalletVerified(verified);
      
      if (verified) {
        const tokenId = await nftService.getTokenIdByWallet(walletAddress);
        setExistingTokenId(tokenId);
      }
    } catch (error) {
      console.error('Error checking wallet verification:', error);
    }
  };

  const handleConnect = async () => {
    const success = await connect();
    if (success && provider) {
      await nftService.initialize(provider);
    }
  };

  const handleSetupLocalhost = async () => {
    await setupLocalhost();
  };


  const handleMintNFT = async () => {
    if (!isConnected || !signer) {
      onMintError?.('MetaMask no está conectado');
      return;
    }

    setIsMinting(true);
    try {
      const result = await nftService.mintVerification(
        signer,
        walletAddress,
        riskLevel,
        riskProfile,
        initialPolkadotAddress || 'N/A'
      );

      if (result.success) {
        onMintSuccess?.(result.tokenId!, result.transactionHash!, result.imageUrl, result.metadata);
        setIsWalletVerified(true);
        setExistingTokenId(result.tokenId!);
      } else {
        onMintError?.(result.error || 'Error minting NFT');
      }
    } catch (error: any) {
      onMintError?.(error.message || 'Error minting NFT');
    } finally {
      setIsMinting(false);
    }
  };

  const handleVerifyOnChain = async () => {
    if (!walletAddress) {
      onMintError?.('Dirección de wallet requerida');
      return;
    }

    setIsVerifyingOnChain(true);
    setMintError(null);

    try {
      // Initialize Polkadot service if not already done
      if (!polkadotService.isInitialized()) {
        await polkadotService.initialize();
      }

      // Convert risk level to Polkadot format
      const polkadotRiskLevel = riskLevel === 'high' ? 'High' : 
                               riskLevel === 'medium' ? 'Medium' : 'Low';

      // Verify wallet on Polkadot blockchain
      const txHash = await polkadotService.verifyWalletOnChain(
        walletAddress,
        getRiskScoreFromLevel(riskLevel),
        polkadotRiskLevel as 'Low' | 'Medium' | 'High',
        false // isSanctioned - would come from OFAC analysis
      );

      setOnChainTxHash(txHash);
      console.log('✅ Wallet verified on Polkadot blockchain:', txHash);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMintError(errorMessage);
      onMintError?.(errorMessage);
      console.error('❌ Error verifying on Polkadot:', error);
    } finally {
      setIsVerifyingOnChain(false);
    }
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="card-enhanced rounded-xl p-6 border-yellow-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">🦊</div>
          <h3 className="text-lg font-semibold">MetaMask Requerido</h3>
        </div>
        <p className="text-gray-300 mb-4">
          Para emitir un NFT de verificación, necesitas instalar MetaMask.
        </p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          📥 Instalar MetaMask
        </a>
      </div>
    );
  }

  if (isWalletVerified && existingTokenId) {
    return (
      <div className="card-enhanced rounded-xl p-6 border-green-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">✅</div>
          <h3 className="text-lg font-semibold">Wallet Ya Verificada</h3>
        </div>
        <p className="text-gray-300 mb-4">
          Esta wallet ya tiene un NFT de verificación.
        </p>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong>Token ID:</strong> #{existingTokenId}
          </p>
          <p className="text-sm text-gray-300">
            <strong>Wallet:</strong> {walletAddress}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-enhanced rounded-xl p-6 border-blue-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-2xl">🦊</div>
        <h3 className="text-lg font-semibold">Emitir NFT de Verificación</h3>
      </div>

      {!isConnected ? (
        <div className="space-y-4">
          <p className="text-gray-300">
            Conecta tu MetaMask para emitir un NFT que certifique la verificación de esta wallet.
          </p>
          <button
            onClick={handleConnect}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
          >
            🔗 Conectar MetaMask
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Información de conexión */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Cuenta conectada:</span>
              <span className="text-sm font-mono text-green-400">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Red:</span>
              <span className="text-sm text-blue-400">
                {chainId === '0x7A69' ? 'Localhost' : `Chain ${chainId}`}
              </span>
            </div>
          </div>

          {/* Modo demostración */}
          <div className="bg-blue-900/20 border border-blue-500/50 p-4 rounded-lg">
            <p className="text-blue-300 text-sm mb-2">
              🎭 <strong>Modo Demostración</strong>
            </p>
            <p className="text-gray-300 text-xs">
              Esta es una demostración del sistema de NFTs. Los NFTs se simulan sin necesidad de un contrato real.
            </p>
          </div>


          {/* Botón de minting */}
          <button
            onClick={handleMintNFT}
            disabled={isMinting}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
          >
            {isMinting ? '🔄 Emitiendo NFT...' : '🎨 Emitir NFT de Verificación (Demo)'}
          </button>

          {/* Botón de verificación en Polkadot */}
          <button
            onClick={handleVerifyOnChain}
            disabled={isVerifyingOnChain}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
          >
            {isVerifyingOnChain ? '🔄 Verificando en Polkadot...' : '🚀 Verificar en Polkadot Blockchain'}
          </button>

          {/* Mostrar hash de transacción de Polkadot */}
          {onChainTxHash && (
            <div className="bg-purple-900/20 border border-purple-500/50 p-4 rounded-lg">
              <h4 className="text-purple-400 font-semibold mb-2">✅ Verificado en Polkadot</h4>
              <p className="text-purple-300 text-sm font-mono break-all">
                TX Hash: {onChainTxHash}
              </p>
            </div>
          )}

          {/* Información adicional */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>• El NFT certificará que esta wallet ha sido verificada</p>
            <p>• Incluirá información de riesgo y análisis completo</p>
            <p>• Se almacenará permanentemente en la blockchain</p>
          </div>
        </div>
      )}

      {/* Errores */}
      {metaMaskError && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
          <p className="text-red-300 text-sm">❌ {metaMaskError}</p>
        </div>
      )}
    </div>
  );
}
