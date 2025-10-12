// Ejemplo de uso del sistema de generación de imágenes para NFTs

import { generateNFTImage, generateSimpleNFTImage, type NFTImageData } from '../lib/nftImageGenerator';

// Ejemplo de datos para un NFT
const exampleNFTData: NFTImageData = {
  walletAddress: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
  riskLevel: 'low',
  riskProfile: 'CryptoSaint',
  riskScore: 15,
  verificationDate: '2024-01-15',
  polkadotAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  tokenId: 1001
};

// Función para generar y mostrar un NFT de ejemplo
export async function generateExampleNFT() {
  try {
    console.log('🎨 Generando NFT de ejemplo...');
    
    // Generar imagen completa
    const result = await generateNFTImage(exampleNFTData);
    
    console.log('✅ NFT generado exitosamente!');
    console.log('📝 Imagen URL:', result.imageUrl);
    console.log('📝 Metadatos:', result.metadata);
    
    // Crear elemento de imagen para mostrar
    const img = document.createElement('img');
    img.src = result.imageUrl;
    img.style.maxWidth = '300px';
    img.style.border = '2px solid #10b981';
    img.style.borderRadius = '8px';
    img.style.margin = '10px';
    
    // Agregar al DOM
    document.body.appendChild(img);
    
    return result;
  } catch (error) {
    console.error('❌ Error generando NFT:', error);
    
    // Fallback a imagen simple
    console.log('🔄 Usando fallback SVG...');
    const simpleImageUrl = generateSimpleNFTImage(exampleNFTData);
    
    const img = document.createElement('img');
    img.src = simpleImageUrl;
    img.style.maxWidth = '300px';
    img.style.border = '2px solid #f59e0b';
    img.style.borderRadius = '8px';
    img.style.margin = '10px';
    
    document.body.appendChild(img);
    
    return {
      imageUrl: simpleImageUrl,
      imageData: simpleImageUrl,
      metadata: {
        name: `Wallet Verification Certificate #${exampleNFTData.tokenId}`,
        description: `Certificate of wallet verification and risk assessment for ${exampleNFTData.walletAddress}`,
        image: simpleImageUrl,
        attributes: [
          { trait_type: "Wallet Address", value: exampleNFTData.walletAddress },
          { trait_type: "Risk Level", value: exampleNFTData.riskLevel },
          { trait_type: "Risk Profile", value: exampleNFTData.riskProfile },
          { trait_type: "Risk Score", value: exampleNFTData.riskScore },
          { trait_type: "Verification Date", value: exampleNFTData.verificationDate },
          { trait_type: "Polkadot Address", value: exampleNFTData.polkadotAddress },
          { trait_type: "Token ID", value: exampleNFTData.tokenId }
        ]
      }
    };
  }
}

// Función para generar múltiples NFTs de ejemplo
export async function generateMultipleExampleNFTs() {
  const examples = [
    {
      walletAddress: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
      riskLevel: 'low',
      riskProfile: 'CryptoSaint',
      riskScore: 15,
      verificationDate: '2024-01-15',
      polkadotAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      tokenId: 1001
    },
    {
      walletAddress: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
      riskLevel: 'medium',
      riskProfile: 'Crypto Whale',
      riskScore: 65,
      verificationDate: '2024-01-15',
      polkadotAddress: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
      tokenId: 1002
    },
    {
      walletAddress: '0x7f367cc41522ce07553e823bf3be79a889debe1b',
      riskLevel: 'high',
      riskProfile: 'DO NOT INTERACT',
      riskScore: 100,
      verificationDate: '2024-01-15',
      polkadotAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
      tokenId: 1003
    }
  ];

  console.log('🎨 Generando múltiples NFTs de ejemplo...');
  
  const results = [];
  for (const example of examples) {
    try {
      const result = await generateNFTImage(example);
      results.push(result);
      console.log(`✅ NFT #${example.tokenId} generado`);
    } catch (error) {
      console.warn(`⚠️ Error con NFT #${example.tokenId}, usando fallback`);
      const fallbackUrl = generateSimpleNFTImage(example);
      results.push({
        imageUrl: fallbackUrl,
        imageData: fallbackUrl,
        metadata: {
          name: `Wallet Verification Certificate #${example.tokenId}`,
          description: `Certificate of wallet verification and risk assessment for ${example.walletAddress}`,
          image: fallbackUrl,
          attributes: [
            { trait_type: "Wallet Address", value: example.walletAddress },
            { trait_type: "Risk Level", value: example.riskLevel },
            { trait_type: "Risk Profile", value: example.riskProfile },
            { trait_type: "Risk Score", value: example.riskScore },
            { trait_type: "Verification Date", value: example.verificationDate },
            { trait_type: "Polkadot Address", value: example.polkadotAddress },
            { trait_type: "Token ID", value: example.tokenId }
          ]
        }
      });
    }
  }
  
  console.log(`✅ ${results.length} NFTs generados exitosamente`);
  return results;
}

// Función para descargar metadatos como JSON
export function downloadMetadataAsJSON(metadata: any, filename: string = 'nft-metadata.json') {
  const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Función para descargar imagen
export function downloadImage(imageUrl: string, filename: string = 'nft-image.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = imageUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
