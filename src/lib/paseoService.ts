import { ethers } from 'ethers';

export interface VerificationData {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  isSanctioned: boolean;
  verifiedAt: number;
  verifiedBy: string;
  exists: boolean;
}

export interface PaseoConfig {
  rpcUrl: string;
  contractAddress: string;
  privateKey?: string;
}

class PaseoService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;
  private config: PaseoConfig;

  // ABI del contrato VerificationContract
  private contractABI = [
    "function verifyWallet(address _walletAddress, uint8 _riskScore, uint8 _riskLevel, bool _isSanctioned) external",
    "function batchVerifyWallets(address[] calldata _walletAddresses, uint8[] calldata _riskScores, uint8[] calldata _riskLevels, bool[] calldata _isSanctionedArray) external",
    "function getVerification(address _walletAddress) external view returns (tuple(uint8 riskScore, uint8 riskLevel, bool isSanctioned, uint256 verifiedAt, address verifiedBy, bool exists))",
    "function isVerified(address _walletAddress) external view returns (bool)",
    "function getTotalVerifications() external view returns (uint256)",
    "function getContractInfo() external view returns (address, uint256, uint256)",
    "function owner() external view returns (address)",
    "event WalletVerified(address indexed walletAddress, uint8 riskScore, uint8 riskLevel, bool isSanctioned, address indexed verifiedBy, uint256 timestamp)",
    "event BatchVerificationCompleted(uint256 count, address indexed verifiedBy, uint256 timestamp)"
  ];

  constructor(config: PaseoConfig) {
    this.config = config;
  }

  /**
   * Initialize connection to Paseo testnet
   */
  async initialize(): Promise<void> {
    try {
      console.log('🔗 Connecting to Paseo testnet...');
      
      // Check if MetaMask is available
      if (typeof window !== 'undefined' && window.ethereum) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // Create contract instance
        this.contract = new ethers.Contract(
          this.config.contractAddress,
          this.contractABI,
          this.signer
        );
        
        console.log('✅ Paseo connection established');
        console.log('📊 Network info:', {
          chainId: (await this.provider.getNetwork()).chainId.toString(),
          contractAddress: this.config.contractAddress
        });
      } else {
        throw new Error('MetaMask not found. Please install MetaMask.');
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize Paseo connection:', error);
      throw error;
    }
  }

  /**
   * Get network information
   */
  async getNetworkInfo(): Promise<any> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const network = await this.provider.getNetwork();
    return {
      chainId: network.chainId.toString(),
      name: network.name,
      contractAddress: this.config.contractAddress
    };
  }

  /**
   * Get account balance
   */
  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      throw error;
    }
  }

  /**
   * Verify wallet on-chain
   */
  async verifyWalletOnChain(
    walletAddress: string,
    riskScore: number,
    riskLevel: 'Low' | 'Medium' | 'High',
    isSanctioned: boolean
  ): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract or signer not initialized');
    }

    try {
      console.log('🔍 Verifying wallet on-chain:', {
        walletAddress,
        riskScore,
        riskLevel,
        isSanctioned
      });

      // Convert risk level to enum value
      const riskLevelEnum = riskLevel === 'High' ? 2 : riskLevel === 'Medium' ? 1 : 0;

      // Call contract function
      const tx = await this.contract.verifyWallet(
        walletAddress,
        riskScore,
        riskLevelEnum,
        isSanctioned
      );

      console.log('⏳ Transaction submitted:', tx.hash);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      console.log('✅ Wallet verification completed:', {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      });

      return receipt.hash;
    } catch (error) {
      console.error('❌ Failed to verify wallet on-chain:', error);
      throw error;
    }
  }

  /**
   * Read verification data from chain
   */
  async readVerificationFromChain(walletAddress: string): Promise<VerificationData | null> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      console.log('📖 Reading verification from chain:', walletAddress);

      const result = await this.contract.getVerification(walletAddress);
      
      if (!result.exists) {
        return null;
      }

      const verificationData: VerificationData = {
        riskScore: Number(result.riskScore),
        riskLevel: result.riskLevel === 2 ? 'High' : result.riskLevel === 1 ? 'Medium' : 'Low',
        isSanctioned: result.isSanctioned,
        verifiedAt: Number(result.verifiedAt),
        verifiedBy: result.verifiedBy,
        exists: result.exists
      };

      console.log('✅ Verification data retrieved:', verificationData);
      return verificationData;
    } catch (error) {
      console.error('❌ Failed to read verification from chain:', error);
      return null;
    }
  }

  /**
   * Get total verifications count
   */
  async getTotalVerifications(): Promise<number> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const total = await this.contract.getTotalVerifications();
      return Number(total);
    } catch (error) {
      console.error('❌ Failed to get total verifications:', error);
      return 0;
    }
  }

  /**
   * Get contract information
   */
  async getContractInfo(): Promise<any> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const [owner, version, totalVerifications] = await this.contract.getContractInfo();
      return {
        owner,
        version: Number(version),
        totalVerifications: Number(totalVerifications)
      };
    } catch (error) {
      console.error('❌ Failed to get contract info:', error);
      throw error;
    }
  }

  /**
   * Check if wallet is verified
   */
  async isWalletVerified(walletAddress: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      return await this.contract.isVerified(walletAddress);
    } catch (error) {
      console.error('❌ Failed to check if wallet is verified:', error);
      return false;
    }
  }

  /**
   * Get current account address
   */
  getCurrentAccount(): string | null {
    return this.signer?.address || null;
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.contract !== null && this.signer !== null;
  }

  /**
   * Get contract address
   */
  getContractAddress(): string {
    return this.config.contractAddress;
  }
}

// Default configuration for Paseo testnet
const defaultConfig: PaseoConfig = {
  rpcUrl: 'https://paseo-rpc.polkadot.io',
  contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // VerificationContract deployed on Paseo
};

// Create singleton instance
export const paseoService = new PaseoService(defaultConfig);

export default PaseoService;
