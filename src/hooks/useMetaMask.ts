import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface MetaMaskState {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  error: string | null;
}

export function useMetaMask() {
  const [state, setState] = useState<MetaMaskState>({
    isConnected: false,
    account: null,
    chainId: null,
    provider: null,
    signer: null,
    error: null,
  });

  // Verificar si MetaMask está instalado
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Conectar a MetaMask
  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      setState(prev => ({ ...prev, error: 'MetaMask no está instalado' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, error: null }));
      
      // Solicitar acceso a las cuentas
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        setState(prev => ({ ...prev, error: 'No se encontraron cuentas' }));
        return false;
      }

      // Obtener información de la red
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      // Crear provider y signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setState({
        isConnected: true,
        account: accounts[0],
        chainId,
        provider,
        signer,
        error: null,
      });

      return true;
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Error al conectar con MetaMask' 
      }));
      return false;
    }
  };

  // Desconectar
  const disconnect = () => {
    setState({
      isConnected: false,
      account: null,
      chainId: null,
      provider: null,
      signer: null,
      error: null,
    });
  };

  // Cambiar de red
  const switchNetwork = async (chainId: string) => {
    if (!isMetaMaskInstalled()) {
      setState(prev => ({ ...prev, error: 'MetaMask no está instalado' }));
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      return true;
    } catch (error: any) {
      console.error('Error switching network:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Error al cambiar de red' 
      }));
      return false;
    }
  };

  // Agregar red personalizada (para localhost)
  const addNetwork = async (networkConfig: {
    chainId: string;
    chainName: string;
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
  }) => {
    if (!isMetaMaskInstalled()) {
      setState(prev => ({ ...prev, error: 'MetaMask no está instalado' }));
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig],
      });
      return true;
    } catch (error: any) {
      console.error('Error adding network:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Error al agregar red' 
      }));
      return false;
    }
  };

  // Configurar red localhost
  const setupLocalhost = async () => {
    const localhostConfig = {
      chainId: '0x7A69', // 31337 en hex
      chainName: 'Localhost 8545',
      rpcUrls: ['http://localhost:8545'],
      blockExplorerUrls: ['http://localhost:8545'],
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
    };

    return await addNetwork(localhostConfig);
  };

  // Escuchar cambios de cuenta
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setState(prev => ({ ...prev, account: accounts[0] }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      setState(prev => ({ ...prev, chainId }));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  return {
    ...state,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    connect,
    disconnect,
    switchNetwork,
    addNetwork,
    setupLocalhost,
  };
}

// Extender el tipo Window para incluir ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
