import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

export interface PolkadotAccount {
  address: string;
  balance: string;
  nonce: number;
  isVerified: boolean;
}

export interface PolkadotVerificationResult {
  success: boolean;
  account?: PolkadotAccount;
  error?: string;
}

class PolkadotService {
  private api: ApiPromise | null = null;
  private keyring: Keyring | null = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      // Esperar a que crypto esté listo
      await cryptoWaitReady();

      // Crear keyring
      this.keyring = new Keyring({ type: 'sr25519' });

      // Conectar a Polkadot (usando Westend testnet para pruebas)
      const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io');
      this.api = await ApiPromise.create({ provider: wsProvider });

      this.isInitialized = true;
      console.log('✅ Polkadot service initialized');
      return true;
    } catch (error) {
      console.error('❌ Error initializing Polkadot service:', error);
      return false;
    }
  }

  async verifyAccount(address: string): Promise<PolkadotVerificationResult> {
    try {
      if (!this.api || !this.isInitialized) {
        await this.initialize();
        if (!this.api) {
          return {
            success: false,
            error: 'Polkadot service not initialized'
          };
        }
      }

      // Verificar que la dirección sea válida
      if (!this.isValidAddress(address)) {
        return {
          success: false,
          error: 'Invalid Polkadot address format'
        };
      }

      // Obtener información de la cuenta
      const accountInfo = await this.api.query.system.account(address);
      
      if (!accountInfo) {
        return {
          success: false,
          error: 'Account not found on Polkadot network'
        };
      }

      // Obtener balance
      const balance = accountInfo.data.free.toString();
      const nonce = accountInfo.nonce.toNumber();

      // Verificar si la cuenta tiene actividad (balance > 0 o nonce > 0)
      const isVerified = balance !== '0' || nonce > 0;

      return {
        success: true,
        account: {
          address,
          balance,
          nonce,
          isVerified
        }
      };
    } catch (error: any) {
      console.error('❌ Error verifying Polkadot account:', error);
      return {
        success: false,
        error: error.message || 'Unknown error verifying account'
      };
    }
  }

  async getAccountBalance(address: string): Promise<string> {
    try {
      if (!this.api) {
        await this.initialize();
        if (!this.api) return '0';
      }

      const accountInfo = await this.api.query.system.account(address);
      return accountInfo.data.free.toString();
    } catch (error) {
      console.error('❌ Error getting balance:', error);
      return '0';
    }
  }

  async getAccountNonce(address: string): Promise<number> {
    try {
      if (!this.api) {
        await this.initialize();
        if (!this.api) return 0;
      }

      const accountInfo = await this.api.query.system.account(address);
      return accountInfo.nonce.toNumber();
    } catch (error) {
      console.error('❌ Error getting nonce:', error);
      return 0;
    }
  }

  private isValidAddress(address: string): boolean {
    try {
      // Verificar formato básico de dirección Polkadot
      if (!address || address.length < 26 || address.length > 35) {
        return false;
      }

      // Verificar que empiece con 1, 2, 3, 4, 5, o C
      const validPrefixes = ['1', '2', '3', '4', '5', 'C'];
      if (!validPrefixes.includes(address[0])) {
        return false;
      }

      // Verificar que solo contenga caracteres válidos
      const validChars = /^[1-9A-HJ-NP-Za-km-z]+$/;
      return validChars.test(address);
    } catch (error) {
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.api) {
        await this.api.disconnect();
        this.api = null;
      }
      this.isInitialized = false;
      console.log('✅ Polkadot service disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting Polkadot service:', error);
    }
  }
}

// Instancia singleton
export const polkadotService = new PolkadotService();

// Función helper para verificar cuenta
export async function verifyPolkadotAccount(address: string): Promise<PolkadotVerificationResult> {
  return await polkadotService.verifyAccount(address);
}

// Función helper para obtener balance
export async function getPolkadotBalance(address: string): Promise<string> {
  return await polkadotService.getAccountBalance(address);
}
