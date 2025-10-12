import React, { useState, useEffect } from 'react';
import { generateNFTImage, generateSimpleNFTImage, type NFTImageData } from '../lib/nftImageGenerator';

// Función para obtener el perfil de riesgo (copiada de App.tsx)
function getRiskProfile(score: number, ofacHit: boolean, notes?: string): { name: string; emoji: string; description: string; subtitle: string } {
  if (typeof score !== 'number' || isNaN(score)) {
    console.warn('getRiskProfile: score inválido:', score);
    score = 0;
  }
  
  // Casos especiales - MÁXIMA ALERTA
  if (ofacHit) {
    return {
      name: "DO NOT INTERACT",
      emoji: "❌",
      description: "Score automático: 10/10 (Riesgo Máximo)",
      subtitle: "🚫 Alertas legales sobre consecuencias"
    };
  }

  // Builders - MÁXIMA SEGURIDAD
  if (notes?.includes('Builder detectado')) {
    return {
      name: "Block Builder",
      emoji: "🏗️",
      description: "Constructor de bloques - infraestructura crítica de Ethereum",
      subtitle: "Máxima confianza - mantiene la red funcionando"
    };
  }

  // ALTO RIESGO (70-100)
  if (score >= 95) {
    return {
      name: "Gas Killer",
      emoji: "⚡",
      description: "Asesino de gas fees - optimiza todo al máximo",
      subtitle: "O es un genio... o está haciendo algo raro"
    };
  }
  if (score >= 90) {
    return {
      name: "Doña Tranza",
      emoji: "👩‍💼",
      description: "La jefa de las finanzas descentralizadas - no te metas con ella",
      subtitle: "Poder extremo en DeFi"
    };
  }
  if (score >= 70) {
    return {
      name: "Crypto Chueco",
      emoji: "🕵️",
      description: "Algo no huele bien aquí - actividad muy sospechosa",
      subtitle: "Red flags por todos lados"
    };
  }

  // RIESGO MEDIO (40-69)
  if (score >= 60) {
    return {
      name: "NFT Enthusiast",
      emoji: "🖼️",
      description: "Coleccionista obsesivo de arte digital",
      subtitle: "Coleccionista obsesivo de arte digital"
    };
  }
  if (score >= 50) {
    return {
      name: "Crypto Whale",
      emoji: "🐋",
      description: "Ballena que mueve mercados con una transacción",
      subtitle: "Big money moves"
    };
  }
  if (score >= 45) {
    return {
      name: "Wallet Zombie",
      emoji: "🧟",
      description: "Wallet muerta que de repente se activa - muy sospechoso",
      subtitle: "Inactiva por meses y luego... ¡boom!"
    };
  }
  if (score >= 40) {
    return {
      name: "Gas Guzzler",
      emoji: "⛽",
      description: "Come gas para desayunar - no le importan las fees",
      subtitle: "Trader activo que paga lo que sea"
    };
  }

  // BAJO RIESGO (0-39) - Aleatorio entre los 4 tipos
  const lowRiskTypes = [
    {
      name: "CryptoSaint",
      emoji: "😇",
      description: "Un santo de las finanzas descentralizadas - nunca ha tocado un scam",
      subtitle: "La wallet más limpia del barrio"
    },
    {
      name: "DeFi Explorer",
      emoji: "🔍",
      description: "Aventurero de protocolos - prueba todo antes que nadie",
      subtitle: "Curioso pero cuidadoso"
    },
    {
      name: "Token Collector",
      emoji: "🪙",
      description: "Colecciona tokens como cartas pokémon - tiene de todo",
      subtitle: "Diversificado como debe ser"
    },
    {
      name: "CryptoSaint",
      emoji: "😇",
      description: "Un santo de las finanzas descentralizadas - nunca ha tocado un scam",
      subtitle: "La wallet más limpia del barrio"
    }
  ];
  
  // Usar el score para seleccionar de manera determinística
  const index = Math.floor(score) % lowRiskTypes.length;
  return lowRiskTypes[index];
}

interface NFTGalleryItem {
  id: string;
  data: NFTImageData;
  imageUrl: string;
  metadata: any;
  createdAt: string;
}

export default function NFTGallery(): React.JSX.Element {
  console.log('🖼️ NFTGallery component rendered');
  
  const [nfts, setNfts] = useState<NFTGalleryItem[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFTGalleryItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  // Cargar NFTs del localStorage al montar el componente
  useEffect(() => {
    console.log('🔄 NFTGallery: Cargando NFTs del localStorage...');
    loadNFTsFromStorage();
  }, []);

  // Log cuando cambie el estado de NFTs
  useEffect(() => {
    console.log('📊 NFTGallery: Estado de NFTs actualizado:', nfts.length, 'NFTs');
    nfts.forEach((nft, index) => {
      console.log(`  NFT ${index + 1}:`, {
        id: nft.id,
        riskProfile: nft.data.riskProfile,
        riskLevel: nft.data.riskLevel,
        hasImage: !!nft.imageUrl,
        imageUrlLength: nft.imageUrl?.length || 0
      });
    });
  }, [nfts]);

  const loadNFTsFromStorage = () => {
    try {
      const savedNFTs = localStorage.getItem('walletwatch-nfts');
      console.log('💾 NFTGallery: Cargando desde localStorage:', savedNFTs ? 'datos encontrados' : 'sin datos');
      if (savedNFTs) {
        const parsedNFTs = JSON.parse(savedNFTs);
        console.log('📦 NFTGallery: NFTs parseados:', parsedNFTs.length, 'elementos');
        setNfts(parsedNFTs);
      } else {
        console.log('📭 NFTGallery: No hay NFTs guardados en localStorage');
      }
    } catch (error) {
      console.error('❌ NFTGallery: Error loading NFTs from storage:', error);
    }
  };

  const saveNFTsToStorage = (nftList: NFTGalleryItem[]) => {
    try {
      localStorage.setItem('walletwatch-nfts', JSON.stringify(nftList));
    } catch (error) {
      console.error('Error saving NFTs to storage:', error);
    }
  };

  const generateExampleNFT = async (exampleData: NFTImageData) => {
    console.log('🎨 generateExampleNFT iniciado con:', exampleData);
    setIsGenerating(true);
    try {
      let imageUrl = '';
      let metadata = null;

      try {
        console.log('🖼️ Generando imagen NFT con Canvas...');
        const result = await generateNFTImage(exampleData);
        console.log('✅ Canvas generation successful:', result);
        imageUrl = result.imageUrl;
        metadata = result.metadata;
      } catch (error) {
        console.warn('❌ Canvas generation failed, using SVG fallback:', error);
        try {
          imageUrl = generateSimpleNFTImage(exampleData);
          console.log('✅ SVG fallback successful:', imageUrl);
          metadata = {
            name: `Wallet Verification Certificate #${exampleData.tokenId}`,
            description: `Certificate of wallet verification and risk assessment for ${exampleData.walletAddress}`,
            image: imageUrl,
            attributes: [
              { trait_type: "Wallet Address", value: exampleData.walletAddress },
              { trait_type: "Risk Level", value: exampleData.riskLevel },
              { trait_type: "Risk Profile", value: exampleData.riskProfile },
              { trait_type: "Risk Score", value: exampleData.riskScore },
              { trait_type: "Verification Date", value: exampleData.verificationDate },
              { trait_type: "Polkadot Address", value: exampleData.polkadotAddress },
              { trait_type: "Token ID", value: exampleData.tokenId }
            ]
          };
        } catch (svgError) {
          console.error('❌ SVG fallback also failed:', svgError);
          // Crear una imagen de placeholder simple
          imageUrl = 'data:image/svg+xml;base64,' + btoa(`
            <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
              <rect width="512" height="512" fill="#f3f4f6"/>
              <text x="256" y="256" text-anchor="middle" font-family="Arial" font-size="24" fill="#6b7280">
                Error generating image
              </text>
            </svg>
          `);
          metadata = {
            name: `Wallet Verification Certificate #${exampleData.tokenId}`,
            description: `Certificate of wallet verification and risk assessment for ${exampleData.walletAddress}`,
            image: imageUrl,
            attributes: [
              { trait_type: "Wallet Address", value: exampleData.walletAddress },
              { trait_type: "Risk Level", value: exampleData.riskLevel },
              { trait_type: "Risk Profile", value: exampleData.riskProfile },
              { trait_type: "Risk Score", value: exampleData.riskScore },
              { trait_type: "Verification Date", value: exampleData.verificationDate },
              { trait_type: "Polkadot Address", value: exampleData.polkadotAddress },
              { trait_type: "Token ID", value: exampleData.tokenId }
            ]
          };
        }
      }

      console.log('📝 Creando NFT object con:', { imageUrl, metadata });

      const newNFT: NFTGalleryItem = {
        id: `nft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        data: exampleData,
        imageUrl,
        metadata,
        createdAt: new Date().toISOString()
      };

      console.log('💾 Guardando NFT:', newNFT);

      const updatedNFTs = [...nfts, newNFT];
      setNfts(updatedNFTs);
      saveNFTsToStorage(updatedNFTs);

      console.log('✅ NFT generado y guardado exitosamente');
      return newNFT;
    } catch (error) {
      console.error('❌ Error generating example NFT:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateExampleNFTs = async () => {
    console.log('🎨 Iniciando generación de ejemplos de NFTs...');
    
    try {
      // Generar ejemplos con nombres correctos según el riesgo
      const lowRiskProfile = getRiskProfile(25, false); // Score 25 = bajo riesgo
      const mediumRiskProfile = getRiskProfile(55, false); // Score 55 = medio riesgo  
      const highRiskProfile = getRiskProfile(85, false); // Score 85 = alto riesgo
      
      console.log('📊 Perfiles generados:', {
        low: lowRiskProfile,
        medium: mediumRiskProfile,
        high: highRiskProfile
      });
      
      const examples = [
        {
          walletAddress: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
          riskLevel: 'low' as const,
          riskProfile: lowRiskProfile.name,
          riskScore: 25,
          verificationDate: '2024-01-15',
          polkadotAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          tokenId: 1001
        },
        {
          walletAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
          riskLevel: 'medium' as const,
          riskProfile: mediumRiskProfile.name,
          riskScore: 55,
          verificationDate: '2024-01-15',
          polkadotAddress: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
          tokenId: 1002
        },
        {
          walletAddress: '0x7f367cc41522ce07553e823bf3be79a889debe1b',
          riskLevel: 'high' as const,
          riskProfile: highRiskProfile.name,
          riskScore: 85,
          verificationDate: '2024-01-15',
          polkadotAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          tokenId: 1003
        }
      ];

      console.log('📝 Ejemplos a generar:', examples);

      for (const example of examples) {
        console.log(`🔄 Generando NFT para ${example.riskLevel} risk:`, example);
        try {
          await generateExampleNFT(example);
          console.log(`✅ NFT ${example.riskLevel} generado exitosamente`);
          // Pequeño delay para evitar problemas de concurrencia
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`❌ Error generando NFT ${example.riskLevel}:`, error);
          // Continuar con el siguiente NFT en lugar de detener todo
        }
      }
      
      console.log('✅ Generación de ejemplos completada');
    } catch (error) {
      console.error('❌ Error en generateExampleNFTs:', error);
    }
  };

  const deleteNFT = (id: string) => {
    const updatedNFTs = nfts.filter(nft => nft.id !== id);
    setNfts(updatedNFTs);
    saveNFTsToStorage(updatedNFTs);
    if (selectedNFT?.id === id) {
      setSelectedNFT(null);
    }
  };

  const clearAllNFTs = () => {
    setNfts([]);
    setSelectedNFT(null);
    localStorage.removeItem('walletwatch-nfts');
  };

  const downloadImage = (nft: NFTGalleryItem) => {
    const link = document.createElement('a');
    link.download = `wallet-verification-${nft.data.tokenId}.png`;
    link.href = nft.imageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadMetadata = (nft: NFTGalleryItem) => {
    const blob = new Blob([JSON.stringify(nft.metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `wallet-verification-${nft.data.tokenId}-metadata.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredNFTs = filter === 'all' 
    ? nfts 
    : nfts.filter(nft => nft.data.riskLevel === filter);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'border-green-500 bg-green-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-900/20';
      case 'high': return 'border-red-500 bg-red-900/20';
      default: return 'border-gray-500 bg-gray-900/20';
    }
  };

  const getRiskEmoji = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🔴';
      default: return '⚫';
    }
  };

  return (
    <div className="card-enhanced rounded-xl p-6 border-purple-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🖼️</div>
          <h3 className="text-lg font-semibold">Galería de NFTs</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generateExampleNFTs}
            disabled={isGenerating}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {isGenerating ? '🔄 Generando...' : '🎨 Generar Ejemplos'}
          </button>
          <button
            onClick={async () => {
              console.log('🧪 Probando generación de imagen LOW RISK...');
              try {
                const testData = {
                  walletAddress: '0x1234567890123456789012345678901234567890',
                  riskLevel: 'low',
                  riskProfile: 'CryptoSaint',
                  riskScore: 25,
                  verificationDate: '2024-01-15',
                  polkadotAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                  tokenId: 9999
                };
                const result = await generateNFTImage(testData);
                console.log('✅ Test LOW RISK successful:', result);
                alert('Test LOW RISK exitoso! Revisa la consola para ver los detalles.');
              } catch (error) {
                console.error('❌ Test LOW RISK failed:', error);
                alert('Test LOW RISK falló! Revisa la consola para ver el error.');
              }
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          >
            🧪 Test Low
          </button>
          <button
            onClick={async () => {
              console.log('🧪 Probando generación de imagen MEDIUM RISK...');
              try {
                const testData = {
                  walletAddress: '0x1234567890123456789012345678901234567890',
                  riskLevel: 'medium',
                  riskProfile: 'Crypto Whale',
                  riskScore: 55,
                  verificationDate: '2024-01-15',
                  polkadotAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
                  tokenId: 9998
                };
                const result = await generateNFTImage(testData);
                console.log('✅ Test MEDIUM RISK successful:', result);
                alert('Test MEDIUM RISK exitoso! Revisa la consola para ver los detalles.');
              } catch (error) {
                console.error('❌ Test MEDIUM RISK failed:', error);
                alert('Test MEDIUM RISK falló! Revisa la consola para ver el error.');
              }
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          >
            🧪 Test Medium
          </button>
          {nfts.length > 0 && (
            <button
              onClick={clearAllNFTs}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              🗑️ Limpiar Todo
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'low', 'medium', 'high'].map(riskLevel => (
            <button
              key={riskLevel}
              onClick={() => setFilter(riskLevel)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter === riskLevel
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {riskLevel === 'all' ? 'Todas' : `${getRiskEmoji(riskLevel)} ${riskLevel.toUpperCase()}`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de NFTs */}
      {filteredNFTs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🖼️</div>
          <h4 className="text-xl font-semibold text-gray-300 mb-2">No hay NFTs generados</h4>
          <p className="text-gray-400 mb-4">
            Genera algunos NFTs de ejemplo para ver las imágenes
          </p>
          <button
            onClick={generateExampleNFTs}
            disabled={isGenerating}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {isGenerating ? '🔄 Generando...' : '🎨 Generar Ejemplos'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNFTs.map((nft) => (
            <div
              key={nft.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${getRiskColor(nft.data.riskLevel)} ${
                selectedNFT?.id === nft.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedNFT(nft)}
            >
              <div className="mb-3">
                <img
                  src={nft.imageUrl}
                  alt={`NFT #${nft.data.tokenId}`}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Error loading image:', e);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">#{nft.data.tokenId}</h4>
                  <div className="flex items-center gap-1">
                    {getRiskEmoji(nft.data.riskLevel)}
                    <span className="text-xs text-gray-300">{nft.data.riskLevel}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300">{nft.data.riskProfile}</p>
                <p className="text-xs text-gray-400">
                  {nft.data.walletAddress.slice(0, 8)}...{nft.data.walletAddress.slice(-4)}
                </p>
                
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(nft);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs transition-colors"
                  >
                    💾
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadMetadata(nft);
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-colors"
                  >
                    📄
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNFT(nft.id);
                    }}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista detallada */}
      {selectedNFT && (
        <div className="mt-6 p-6 bg-gray-800 rounded-lg border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">NFT #{selectedNFT.data.tokenId}</h4>
            <button
              onClick={() => setSelectedNFT(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={selectedNFT.imageUrl}
                alt={`NFT #${selectedNFT.data.tokenId}`}
                className="w-full h-auto rounded-lg"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-gray-300 mb-2">Información del NFT</h5>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Token ID:</span> #{selectedNFT.data.tokenId}</p>
                  <p><span className="text-gray-400">Perfil:</span> {selectedNFT.data.riskProfile}</p>
                  <p><span className="text-gray-400">Nivel:</span> {selectedNFT.data.riskLevel}</p>
                  <p><span className="text-gray-400">Score:</span> {selectedNFT.data.riskScore}/100</p>
                  <p><span className="text-gray-400">Fecha:</span> {selectedNFT.data.verificationDate}</p>
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-300 mb-2">Direcciones</h5>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Wallet:</span> <span className="font-mono text-blue-400">{selectedNFT.data.walletAddress}</span></p>
                  <p><span className="text-gray-400">Polkadot:</span> <span className="font-mono text-purple-400">{selectedNFT.data.polkadotAddress}</span></p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => downloadImage(selectedNFT)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  💾 Descargar Imagen
                </button>
                <button
                  onClick={() => downloadMetadata(selectedNFT)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  📄 Descargar Metadatos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
