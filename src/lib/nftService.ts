import { ethers } from 'ethers';
import { generateNFTImage, type NFTImageData } from './nftImageGenerator';

// ABI del contrato VerificationNFT
const VERIFICATION_NFT_ABI = [
  "function mintVerification(address to, string memory walletAddress, string memory riskLevel, string memory riskProfile, string memory polkadotAddress) external returns (uint256)",
  "function getVerificationData(uint256 tokenId) external view returns (tuple(string walletAddress, string riskLevel, string riskProfile, uint256 verificationDate, string polkadotAddress, bool isVerified))",
  "function isWalletVerified(string memory walletAddress) external view returns (bool)",
  "function getTokenIdByWallet(string memory walletAddress) external view returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function owner() external view returns (address)",
  "event VerificationMinted(uint256 indexed tokenId, string walletAddress, string riskLevel, string polkadotAddress)"
];

export interface VerificationData {
  walletAddress: string;
  riskLevel: string;
  riskProfile: string;
  verificationDate: number;
  polkadotAddress: string;
  isVerified: boolean;
}

export interface MintResult {
  success: boolean;
  tokenId?: number;
  transactionHash?: string;
  imageUrl?: string;
  metadata?: any;
  error?: string;
}

class NFTService {
  private contract: ethers.Contract | null = null;
  private contractAddress: string | null = null;

  // Dirección del contrato desplegado (usando un contrato de prueba en Sepolia)
  private readonly DEFAULT_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Placeholder - necesitamos desplegar

  async initialize(provider: ethers.Provider, contractAddress?: string): Promise<boolean> {
    try {
      this.contractAddress = contractAddress || this.DEFAULT_CONTRACT_ADDRESS;
      
      // Modo demostración - simular contrato
      console.log('🎭 NFT Service initialized in DEMO mode');
      console.log('📝 Contract address:', this.contractAddress);
      console.log('⚠️  This is a demonstration - no real contract deployed');
      
      return true;
    } catch (error) {
      console.error('❌ Error initializing NFT Service:', error);
      return false;
    }
  }

  async mintVerification(
    signer: ethers.JsonRpcSigner,
    walletAddress: string,
    riskLevel: string,
    riskProfile: string,
    polkadotAddress: string
  ): Promise<MintResult> {
    try {
      // Modo demostración - simular minting
      console.log('🎭 DEMO MODE: Simulating NFT minting...');
      console.log('📝 Wallet:', walletAddress);
      console.log('📝 Risk Level:', riskLevel);
      console.log('📝 Risk Profile:', riskProfile);
      console.log('📝 Polkadot Address:', polkadotAddress);

      // Simular delay de transacción
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generar token ID simulado
      const tokenId = Math.floor(Math.random() * 10000) + 1;
      
      // Generar hash de transacción simulado
      const transactionHash = '0x' + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      // Generar imagen del NFT
      const imageData: NFTImageData = {
        walletAddress,
        riskLevel,
        riskProfile,
        riskScore: Math.floor(Math.random() * 100) + 1, // Score simulado
        verificationDate: new Date().toISOString().split('T')[0],
        polkadotAddress,
        tokenId
      };

      let imageUrl = '';
      let metadata = null;

      try {
        const imageResult = await generateNFTImage(imageData);
        imageUrl = imageResult.imageUrl;
        metadata = imageResult.metadata;
        console.log('✅ DEMO: NFT image generated successfully!');
      } catch (imageError) {
        console.warn('⚠️ DEMO: Image generation failed, using fallback:', imageError);
        // Fallback: crear metadatos básicos sin imagen
        metadata = {
          name: `Wallet Verification Certificate #${tokenId}`,
          description: `Certificate of wallet verification and risk assessment for ${walletAddress}`,
          attributes: [
            { trait_type: "Wallet Address", value: walletAddress },
            { trait_type: "Risk Level", value: riskLevel },
            { trait_type: "Risk Profile", value: riskProfile },
            { trait_type: "Risk Score", value: imageData.riskScore },
            { trait_type: "Verification Date", value: imageData.verificationDate },
            { trait_type: "Polkadot Address", value: polkadotAddress },
            { trait_type: "Token ID", value: tokenId }
          ]
        };
      }

      console.log('✅ DEMO: NFT minted successfully!');
      console.log('📝 Token ID:', tokenId);
      console.log('📝 Transaction Hash:', transactionHash);
      console.log('📝 Image URL:', imageUrl ? 'Generated' : 'Fallback');

      return {
        success: true,
        tokenId,
        transactionHash,
        imageUrl,
        metadata
      };
    } catch (error: any) {
      console.error('❌ Error minting verification NFT:', error);
      return {
        success: false,
        error: error.message || 'Unknown error minting NFT'
      };
    }
  }

  async getVerificationData(tokenId: number): Promise<VerificationData | null> {
    try {
      if (!this.contract) {
        throw new Error('NFT Service not initialized');
      }

      const data = await this.contract.getVerificationData(tokenId);
      return {
        walletAddress: data.walletAddress,
        riskLevel: data.riskLevel,
        riskProfile: data.riskProfile,
        verificationDate: Number(data.verificationDate),
        polkadotAddress: data.polkadotAddress,
        isVerified: data.isVerified
      };
    } catch (error) {
      console.error('❌ Error getting verification data:', error);
      return null;
    }
  }

  async isWalletVerified(walletAddress: string): Promise<boolean> {
    try {
      // Modo demostración - simular verificación
      console.log('🎭 DEMO MODE: Checking if wallet is verified...');
      console.log('📝 Wallet:', walletAddress);
      
      // Simular que algunas wallets ya están verificadas
      const demoVerifiedWallets = [
        '0xab5801a7d398351b8be11c439e05c5b3259aec9b', // Vitalik
        '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE'  // Binance
      ];
      
      const isVerified = demoVerifiedWallets.includes(walletAddress.toLowerCase());
      console.log('📝 Is verified:', isVerified);
      
      return isVerified;
    } catch (error) {
      console.error('❌ Error checking if wallet is verified:', error);
      return false;
    }
  }

  async getTokenIdByWallet(walletAddress: string): Promise<number | null> {
    try {
      // Modo demostración - simular token ID
      console.log('🎭 DEMO MODE: Getting token ID by wallet...');
      console.log('📝 Wallet:', walletAddress);
      
      // Simular token IDs para wallets verificadas
      const demoTokenIds: { [key: string]: number } = {
        '0xab5801a7d398351b8be11c439e05c5b3259aec9b': 1001, // Vitalik
        '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE': 1002  // Binance
      };
      
      const tokenId = demoTokenIds[walletAddress.toLowerCase()] || null;
      console.log('📝 Token ID:', tokenId);
      
      return tokenId;
    } catch (error) {
      console.error('❌ Error getting token ID by wallet:', error);
      return null;
    }
  }

  async getTotalSupply(): Promise<number> {
    try {
      // Modo demostración - simular total supply
      console.log('🎭 DEMO MODE: Getting total supply...');
      const totalSupply = 1002; // Simular 1002 NFTs minteados
      console.log('📝 Total Supply:', totalSupply);
      return totalSupply;
    } catch (error) {
      console.error('❌ Error getting total supply:', error);
      return 0;
    }
  }

  async getTokenURI(tokenId: number): Promise<string | null> {
    try {
      // Modo demostración - simular token URI
      console.log('🎭 DEMO MODE: Getting token URI...');
      console.log('📝 Token ID:', tokenId);
      
      const tokenURI = `https://api.walletwatch.com/metadata/${tokenId}`;
      console.log('📝 Token URI:', tokenURI);
      
      return tokenURI;
    } catch (error) {
      console.error('❌ Error getting token URI:', error);
      return null;
    }
  }

  getContractAddress(): string | null {
    return this.contractAddress;
  }
}

// Instancia singleton
export const nftService = new NFTService();

// Función helper para mintear verificación
export async function mintVerificationNFT(
  signer: ethers.JsonRpcSigner,
  walletAddress: string,
  riskLevel: string,
  riskProfile: string,
  polkadotAddress: string
): Promise<MintResult> {
  return await nftService.mintVerification(signer, walletAddress, riskLevel, riskProfile, polkadotAddress);
}
