export interface NFTImageData {
  walletAddress: string;
  riskLevel: string;
  riskProfile: string;
  riskScore: number;
  verificationDate: string;
  polkadotAddress: string;
  tokenId: number;
}

export interface GeneratedImage {
  imageUrl: string;
  imageData: string; // Base64 data
  metadata: any;
}

class NFTImageGenerator {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  // Colores según el nivel de riesgo
  private getRiskColors(riskLevel: string) {
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return {
          primary: '#ef4444', // red-500
          secondary: '#dc2626', // red-600
          background: '#fef2f2', // red-50
          text: '#991b1b' // red-800
        };
      case 'medium':
        return {
          primary: '#f59e0b', // amber-500
          secondary: '#d97706', // amber-600
          background: '#fffbeb', // amber-50
          text: '#92400e' // amber-800
        };
      case 'low':
        return {
          primary: '#10b981', // emerald-500
          secondary: '#059669', // emerald-600
          background: '#ecfdf5', // emerald-50
          text: '#065f46' // emerald-800
        };
      default:
        return {
          primary: '#6b7280', // gray-500
          secondary: '#4b5563', // gray-600
          background: '#f9fafb', // gray-50
          text: '#374151' // gray-700
        };
    }
  }

  // Emojis según el perfil de riesgo
  private getRiskEmoji(riskProfile: string): string {
    if (riskProfile.includes('CryptoSaint')) return '😇';
    if (riskProfile.includes('DeFi Explorer')) return '🔍';
    if (riskProfile.includes('Token Collector')) return '🪙';
    if (riskProfile.includes('Gas Guzzler')) return '⛽';
    if (riskProfile.includes('Wallet Zombie')) return '🧟';
    if (riskProfile.includes('Crypto Whale')) return '🐋';
    if (riskProfile.includes('NFT Enthusiast')) return '🖼️';
    if (riskProfile.includes('Crypto Chueco')) return '🕵️';
    if (riskProfile.includes('Doña Tranza')) return '👩‍💼';
    if (riskProfile.includes('Gas Killer')) return '⚡';
    if (riskProfile.includes('Block Builder')) return '🏗️';
    if (riskProfile.includes('DO NOT INTERACT')) return '🚫';
    return '🔐';
  }

  // Crear canvas
  private createCanvas(width: number = 512, height: number = 512): void {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d');
    
    if (!this.ctx) {
      throw new Error('No se pudo crear el contexto del canvas');
    }
  }

  // Dibujar fondo con gradiente y elementos específicos por riesgo
  private drawBackground(colors: any, riskProfile: string): void {
    if (!this.ctx || !this.canvas) return;

    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, colors.background);
    gradient.addColorStop(1, '#ffffff');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Agregar elementos decorativos específicos por perfil
    this.drawProfileSpecificElements(riskProfile, colors);
  }

  // Dibujar elementos específicos según el perfil de riesgo
  private drawProfileSpecificElements(riskProfile: string, colors: any): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.globalAlpha = 0.1;

    // ALTO RIESGO - Elementos agresivos
    if (riskProfile.includes('Crypto Chueco')) {
      // Dibujar líneas diagonales agresivas
      this.ctx.strokeStyle = colors.primary;
      this.ctx.lineWidth = 3;
      for (let i = 0; i < 20; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(i * 25, 0);
        this.ctx.lineTo(i * 25 + 50, this.canvas.height);
        this.ctx.stroke();
      }
    } else if (riskProfile.includes('Doña Tranza')) {
      // Dibujar patrones de poder
      this.ctx.fillStyle = colors.primary;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if ((i + j) % 2 === 0) {
            this.ctx.fillRect(i * 64, j * 64, 32, 32);
          }
        }
      }
    } else if (riskProfile.includes('Gas Killer')) {
      // Dibujar rayos de energía
      this.ctx.strokeStyle = colors.primary;
      this.ctx.lineWidth = 4;
      for (let i = 0; i < 10; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
        this.ctx.lineTo(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
        this.ctx.stroke();
      }
    }
    // MEDIO RIESGO - Elementos moderados
    else if (riskProfile.includes('Gas Guzzler')) {
      // Dibujar gotas de gas
      this.ctx.fillStyle = colors.primary;
      for (let i = 0; i < 15; i++) {
        this.ctx.beginPath();
        this.ctx.arc(Math.random() * this.canvas.width, Math.random() * this.canvas.height, 8, 0, Math.PI * 2);
        this.ctx.fill();
      }
    } else if (riskProfile.includes('Wallet Zombie')) {
      // Dibujar huellas de zombi
      this.ctx.fillStyle = colors.primary;
      for (let i = 0; i < 12; i++) {
        this.ctx.beginPath();
        this.ctx.arc(Math.random() * this.canvas.width, Math.random() * this.canvas.height, 12, 0, Math.PI * 2);
        this.ctx.fill();
      }
    } else if (riskProfile.includes('Crypto Whale')) {
      // Dibujar ondas de agua
      this.ctx.strokeStyle = colors.primary;
      this.ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 50 + i * 30, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    } else if (riskProfile.includes('NFT Enthusiast')) {
      // Dibujar marcos de cuadros
      this.ctx.strokeStyle = colors.primary;
      this.ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const x = Math.random() * (this.canvas.width - 60);
        const y = Math.random() * (this.canvas.height - 60);
        this.ctx.strokeRect(x, y, 60, 60);
      }
    }
    // BAJO RIESGO - Elementos suaves
    else if (riskProfile.includes('CryptoSaint')) {
      // Dibujar halos de luz
      this.ctx.strokeStyle = colors.primary;
      this.ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 30 + i * 15, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    } else if (riskProfile.includes('DeFi Explorer')) {
      // Dibujar brújulas
      this.ctx.strokeStyle = colors.primary;
      this.ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const x = 100 + i * 100;
        const y = 100 + i * 80;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 20);
        this.ctx.lineTo(x, y + 20);
        this.ctx.moveTo(x - 20, y);
        this.ctx.lineTo(x + 20, y);
        this.ctx.stroke();
      }
    } else if (riskProfile.includes('Token Collector')) {
      // Dibujar monedas
      this.ctx.fillStyle = colors.primary;
      for (let i = 0; i < 20; i++) {
        this.ctx.beginPath();
        this.ctx.arc(Math.random() * this.canvas.width, Math.random() * this.canvas.height, 6, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = 1.0;
  }

  // Dibujar borde decorativo
  private drawBorder(colors: any): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.strokeStyle = colors.primary;
    this.ctx.lineWidth = 8;
    this.ctx.strokeRect(4, 4, this.canvas.width - 8, this.canvas.height - 8);

    // Borde interno
    this.ctx.strokeStyle = colors.secondary;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(12, 12, this.canvas.width - 24, this.canvas.height - 24);
  }

  // Dibujar título principal
  private drawTitle(): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.fillStyle = '#1f2937';
    this.ctx.font = 'bold 32px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('WALLET VERIFICATION', this.canvas.width / 2, 60);
    
    this.ctx.fillStyle = '#6b7280';
    this.ctx.font = '18px Arial, sans-serif';
    this.ctx.fillText('Certificate of Risk Assessment', this.canvas.width / 2, 85);
  }

  // Dibujar emoji grande
  private drawMainEmoji(emoji: string): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.font = '120px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(emoji, this.canvas.width / 2, 200);
  }

  // Dibujar información de la wallet
  private drawWalletInfo(data: NFTImageData, colors: any): void {
    if (!this.ctx || !this.canvas) return;

    const yStart = 250;
    const lineHeight = 25;
    let currentY = yStart;

    // Perfil de riesgo
    this.ctx.fillStyle = colors.primary;
    this.ctx.font = 'bold 24px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(data.riskProfile, this.canvas.width / 2, currentY);
    currentY += lineHeight + 10;

    // Score
    this.ctx.fillStyle = colors.text;
    this.ctx.font = '20px Arial, sans-serif';
    this.ctx.fillText(`Risk Score: ${data.riskScore}/100`, this.canvas.width / 2, currentY);
    currentY += lineHeight;

    // Nivel de riesgo
    this.ctx.fillStyle = colors.secondary;
    this.ctx.font = 'bold 18px Arial, sans-serif';
    this.ctx.fillText(`Risk Level: ${data.riskLevel.toUpperCase()}`, this.canvas.width / 2, currentY);
    currentY += lineHeight + 15;

    // Wallet address (truncada)
    this.ctx.fillStyle = '#374151';
    this.ctx.font = '14px monospace';
    const truncatedAddress = `${data.walletAddress.slice(0, 6)}...${data.walletAddress.slice(-4)}`;
    this.ctx.fillText(truncatedAddress, this.canvas.width / 2, currentY);
    currentY += lineHeight;

    // Polkadot address (truncada)
    if (data.polkadotAddress) {
      const truncatedPolkadot = `${data.polkadotAddress.slice(0, 8)}...${data.polkadotAddress.slice(-6)}`;
      this.ctx.fillText(truncatedPolkadot, this.canvas.width / 2, currentY);
      currentY += lineHeight;
    }

    // Fecha de verificación
    this.ctx.fillStyle = '#6b7280';
    this.ctx.font = '12px Arial, sans-serif';
    this.ctx.fillText(`Verified: ${data.verificationDate}`, this.canvas.width / 2, currentY);
  }

  // Dibujar elementos decorativos adicionales según el perfil
  private drawProfileDecorations(riskProfile: string, colors: any): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.globalAlpha = 0.3;

    // ALTO RIESGO - Decoraciones agresivas
    if (riskProfile.includes('Crypto Chueco')) {
      // Dibujar símbolos de alerta en las esquinas
      this.ctx.fillStyle = colors.primary;
      this.ctx.font = 'bold 24px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('⚠️', 50, 50);
      this.ctx.fillText('⚠️', this.canvas.width - 50, 50);
      this.ctx.fillText('⚠️', 50, this.canvas.height - 50);
      this.ctx.fillText('⚠️', this.canvas.width - 50, this.canvas.height - 50);
    } else if (riskProfile.includes('Doña Tranza')) {
      // Dibujar coronas en las esquinas
      this.ctx.fillStyle = colors.primary;
      this.ctx.font = 'bold 20px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('👑', 40, 40);
      this.ctx.fillText('👑', this.canvas.width - 40, 40);
      this.ctx.fillText('👑', 40, this.canvas.height - 40);
      this.ctx.fillText('👑', this.canvas.width - 40, this.canvas.height - 40);
    } else if (riskProfile.includes('Gas Killer')) {
      // Dibujar rayos en las esquinas
      this.ctx.fillStyle = colors.primary;
      this.ctx.font = 'bold 20px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('⚡', 40, 40);
      this.ctx.fillText('⚡', this.canvas.width - 40, 40);
      this.ctx.fillText('⚡', 40, this.canvas.height - 40);
      this.ctx.fillText('⚡', this.canvas.width - 40, this.canvas.height - 40);
    }
    // MEDIO RIESGO - Decoraciones moderadas
    else if (riskProfile.includes('Gas Guzzler')) {
      // Dibujar bombas de gas
      this.ctx.fillStyle = colors.primary;
      this.ctx.font = 'bold 18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('⛽', 40, 40);
      this.ctx.fillText('⛽', this.canvas.width - 40, 40);
      this.ctx.fillText('⛽', 40, this.canvas.height - 40);
      this.ctx.fillText('⛽', this.canvas.width - 40, this.canvas.height - 40);
    } else if (riskProfile.includes('Wallet Zombie')) {
      // Dibujar cerebros
      this.ctx.fillStyle = colors.primary;
      this.ctx.font = 'bold 18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🧠', 40, 40);
      this.ctx.fillText('🧠', this.canvas.width - 40, 40);
      this.ctx.fillText('🧠', 40, this.canvas.height - 40);
      this.ctx.fillText('🧠', this.canvas.width - 40, this.canvas.height - 40);
    } else if (riskProfile.includes('Crypto Whale')) {
      // Dibujar olas
      this.ctx.fillStyle = colors.primary;
      this.ctx.font = 'bold 18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🌊', 40, 40);
      this.ctx.fillText('🌊', this.canvas.width - 40, 40);
      this.ctx.fillText('🌊', 40, this.canvas.height - 40);
      this.ctx.fillText('🌊', this.canvas.width - 40, this.canvas.height - 40);
    } else if (riskProfile.includes('NFT Enthusiast')) {
      // Dibujar paletas de colores
      this.ctx.fillStyle = colors.primary;
      this.ctx.font = 'bold 18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🎨', 40, 40);
      this.ctx.fillText('🎨', this.canvas.width - 40, 40);
      this.ctx.fillText('🎨', 40, this.canvas.height - 40);
      this.ctx.fillText('🎨', this.canvas.width - 40, this.canvas.height - 40);
    }
    // BAJO RIESGO - Decoraciones suaves
    else if (riskProfile.includes('CryptoSaint')) {
      // Dibujar estrellas
      this.ctx.fillStyle = colors.primary;
      this.ctx.font = 'bold 18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('⭐', 40, 40);
      this.ctx.fillText('⭐', this.canvas.width - 40, 40);
      this.ctx.fillText('⭐', 40, this.canvas.height - 40);
      this.ctx.fillText('⭐', this.canvas.width - 40, this.canvas.height - 40);
    } else if (riskProfile.includes('DeFi Explorer')) {
      // Dibujar mapas
      this.ctx.fillStyle = colors.primary;
      this.ctx.font = 'bold 18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🗺️', 40, 40);
      this.ctx.fillText('🗺️', this.canvas.width - 40, 40);
      this.ctx.fillText('🗺️', 40, this.canvas.height - 40);
      this.ctx.fillText('🗺️', this.canvas.width - 40, this.canvas.height - 40);
    } else if (riskProfile.includes('Token Collector')) {
      // Dibujar cofres del tesoro
      this.ctx.fillStyle = colors.primary;
      this.ctx.font = 'bold 18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('💰', 40, 40);
      this.ctx.fillText('💰', this.canvas.width - 40, 40);
      this.ctx.fillText('💰', 40, this.canvas.height - 40);
      this.ctx.fillText('💰', this.canvas.width - 40, this.canvas.height - 40);
    }

    this.ctx.globalAlpha = 1.0;
  }

  // Dibujar footer con token ID
  private drawFooter(tokenId: number): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.fillStyle = '#9ca3af';
    this.ctx.font = '16px Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Token ID: #${tokenId}`, this.canvas.width / 2, this.canvas.height - 30);
    
    this.ctx.fillStyle = '#d1d5db';
    this.ctx.font = '12px Arial, sans-serif';
    this.ctx.fillText('WalletWatch Verification System', this.canvas.width / 2, this.canvas.height - 10);
  }

  // Generar imagen completa
  async generateImage(data: NFTImageData): Promise<GeneratedImage> {
    try {
      this.createCanvas(512, 512);
      
      const colors = this.getRiskColors(data.riskLevel);
      const emoji = this.getRiskEmoji(data.riskProfile);

      // Dibujar elementos
      this.drawBackground(colors, data.riskProfile);
      this.drawBorder(colors);
      this.drawTitle();
      this.drawMainEmoji(emoji);
      this.drawWalletInfo(data, colors);
      this.drawProfileDecorations(data.riskProfile, colors);
      this.drawFooter(data.tokenId);

      // Convertir a base64
      const imageData = this.canvas.toDataURL('image/png');
      const imageUrl = imageData; // En producción, subir a IPFS o servidor

      // Crear metadatos
      const metadata = {
        name: `Wallet Verification Certificate #${data.tokenId}`,
        description: `Certificate of wallet verification and risk assessment for ${data.walletAddress}`,
        image: imageUrl,
        attributes: [
          {
            trait_type: "Wallet Address",
            value: data.walletAddress
          },
          {
            trait_type: "Risk Level",
            value: data.riskLevel
          },
          {
            trait_type: "Risk Profile",
            value: data.riskProfile
          },
          {
            trait_type: "Risk Score",
            value: data.riskScore
          },
          {
            trait_type: "Verification Date",
            value: data.verificationDate
          },
          {
            trait_type: "Polkadot Address",
            value: data.polkadotAddress
          },
          {
            trait_type: "Token ID",
            value: data.tokenId
          }
        ],
        external_url: "https://walletwatch.com",
        background_color: colors.background
      };

      return {
        imageUrl,
        imageData,
        metadata
      };
    } catch (error) {
      console.error('Error generating NFT image:', error);
      throw error;
    }
  }

  // Generar imagen simple (fallback)
  generateSimpleImage(data: NFTImageData): string {
    const colors = this.getRiskColors(data.riskLevel);
    const emoji = this.getRiskEmoji(data.riskProfile);
    
    // Crear SVG simple como fallback
    const svg = `
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors.background};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" fill="url(#bg)" stroke="${colors.primary}" stroke-width="8"/>
        <rect x="12" y="12" width="488" height="488" fill="none" stroke="${colors.secondary}" stroke-width="2"/>
        <text x="256" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#1f2937">WALLET VERIFICATION</text>
        <text x="256" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#6b7280">Certificate of Risk Assessment</text>
        <text x="256" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="120">${emoji}</text>
        <text x="256" y="250" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${colors.primary}">${data.riskProfile}</text>
        <text x="256" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="${colors.text}">Risk Score: ${data.riskScore}/100</text>
        <text x="256" y="310" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${colors.secondary}">Risk Level: ${data.riskLevel.toUpperCase()}</text>
        <text x="256" y="350" text-anchor="middle" font-family="monospace" font-size="14" fill="#374151">${data.walletAddress.slice(0, 6)}...${data.walletAddress.slice(-4)}</text>
        <text x="256" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Verified: ${data.verificationDate}</text>
        <text x="256" y="482" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af">Token ID: #${data.tokenId}</text>
        <text x="256" y="502" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#d1d5db">WalletWatch Verification System</text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
}

// Instancia singleton
export const nftImageGenerator = new NFTImageGenerator();

// Función helper para generar imagen
export async function generateNFTImage(data: NFTImageData): Promise<GeneratedImage> {
  return await nftImageGenerator.generateImage(data);
}

// Función helper para generar imagen simple
export function generateSimpleNFTImage(data: NFTImageData): string {
  return nftImageGenerator.generateSimpleImage(data);
}
