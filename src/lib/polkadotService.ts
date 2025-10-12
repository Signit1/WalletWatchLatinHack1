import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import type { KeyringPair } from '@polkadot/keyring/types';

export interface VerificationData {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  isSanctioned: boolean;
  verifiedAt: number;
  verifiedBy: string;
}

export interface PolkadotConfig {
  wsEndpoint: string;
  contractAddress?: string;
  mnemonic?: string;
}

class PolkadotService {
  private api: ApiPromise | null = null;
  private keyring: Keyring | null = null;
  private account: KeyringPair | null = null;
  private config: PolkadotConfig;

  constructor(config: PolkadotConfig) {
    this.config = config;
  }

  /**
   * Initialize connection to Polkadot network
   */
  async initialize(): Promise<void> {
    try {
      console.log('🔗 Connecting to Polkadot network...');
      
      // Initialize crypto
      await cryptoWaitReady();
      
      // Create API instance
      const provider = new WsProvider(this.config.wsEndpoint);
      this.api = await ApiPromise.create({ provider });
      
      // Create keyring
      this.keyring = new Keyring({ type: 'sr25519' });
      
      // Add account if mnemonic provided
      if (this.config.mnemonic) {
        this.account = this.keyring.addFromMnemonic(this.config.mnemonic);
        console.log('✅ Account loaded:', this.account.address);
      }
      
      console.log('✅ Polkadot connection established');
      console.log('📊 Network info:', {
        chain: this.api.runtimeChain.toString(),
        version: this.api.runtimeVersion.specVersion.toString(),
        nodeVersion: this.api.runtimeVersion.implVersion.toString()
      });
      
    } catch (error) {
      console.error('❌ Failed to initialize Polkadot connection:', error);
      throw error;
    }
  }

  /**
   * Get network information
   */
  async getNetworkInfo(): Promise<any> {
    if (!this.api) {
      throw new Error('API not initialized');
    }

    return {
      chain: this.api.runtimeChain.toString(),
      version: this.api.runtimeVersion.specVersion.toString(),
      nodeVersion: this.api.runtimeVersion.implVersion.toString(),
      properties: this.api.registry.chainProperties,
    };
  }

  /**
   * Get account balance
   */
  async getBalance(address: string): Promise<string> {
    if (!this.api) {
      throw new Error('API not initialized');
    }

    try {
      const { data: balance } = await this.api.query.system.account(address);
      return balance.free.toString();
    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      throw error;
    }
  }

  /**
   * Verify wallet on-chain (simulated for demo)
   */
  async verifyWalletOnChain(
    walletAddress: string,
    riskScore: number,
    riskLevel: 'Low' | 'Medium' | 'High',
    isSanctioned: boolean
  ): Promise<string> {
    if (!this.api || !this.account) {
      throw new Error('API or account not initialized');
    }

    try {
      console.log('🔍 Verifying wallet on-chain:', {
        walletAddress,
        riskScore,
        riskLevel,
        isSanctioned
      });

      // For demo purposes, we'll simulate the contract call
      // In a real implementation, you would call your deployed contract
      const verificationData: VerificationData = {
        riskScore,
        riskLevel,
        isSanctioned,
        verifiedAt: Date.now(),
        verifiedBy: this.account.address
      };

      // Simulate transaction hash
      const txHash = this.generateMockTxHash();
      
      console.log('✅ Wallet verification submitted:', {
        txHash,
        verificationData
      });

      return txHash;
    } catch (error) {
      console.error('❌ Failed to verify wallet on-chain:', error);
      throw error;
    }
  }

  /**
   * Read verification data from chain (simulated for demo)
   */
  async readVerificationFromChain(walletAddress: string): Promise<VerificationData | null> {
    if (!this.api) {
      throw new Error('API not initialized');
    }

    try {
      console.log('📖 Reading verification from chain:', walletAddress);

      // For demo purposes, we'll simulate reading from contract
      // In a real implementation, you would query your deployed contract
      const mockVerification: VerificationData = {
        riskScore: 25,
        riskLevel: 'Low',
        isSanctioned: false,
        verifiedAt: Date.now() - 86400000, // 1 day ago
        verifiedBy: this.account?.address || '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
      };

      console.log('✅ Verification data retrieved:', mockVerification);
      return mockVerification;
    } catch (error) {
      console.error('❌ Failed to read verification from chain:', error);
      return null;
    }
  }

  /**
   * Get total verifications count (simulated for demo)
   */
  async getTotalVerifications(): Promise<number> {
    if (!this.api) {
      throw new Error('API not initialized');
    }

    try {
      // For demo purposes, return a mock count
      return 42;
    } catch (error) {
      console.error('❌ Failed to get total verifications:', error);
      return 0;
    }
  }

  /**
   * Disconnect from Polkadot network
   */
  async disconnect(): Promise<void> {
    if (this.api) {
      await this.api.disconnect();
      this.api = null;
      console.log('🔌 Disconnected from Polkadot network');
    }
  }

  /**
   * Generate mock transaction hash for demo
   */
  private generateMockTxHash(): string {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < 64; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  /**
   * Get current account address
   */
  getCurrentAccount(): string | null {
    return this.account?.address || null;
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.api !== null;
  }
}

// Default configuration for Paseo testnet
const defaultConfig: PolkadotConfig = {
  wsEndpoint: 'wss://paseo-rpc.polkadot.io',
  // For demo purposes - in production, use environment variables
  mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
};

// Create singleton instance
export const polkadotService = new PolkadotService(defaultConfig);

export default PolkadotService;
