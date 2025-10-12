import React, { useState, useEffect } from 'react';
import { generateNFTImage, generateSimpleNFTImage, type NFTImageData } from '../lib/nftImageGenerator';

interface NFTImagePreviewProps {
  data: NFTImageData;
  onImageGenerated?: (imageUrl: string, metadata: any) => void;
}

export default function NFTImagePreview({ data, onImageGenerated }: NFTImagePreviewProps): React.JSX.Element {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [metadata, setMetadata] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    generateImage();
  }, [data]);

  const generateImage = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Intentar generar imagen completa primero
      try {
        const result = await generateNFTImage(data);
        setImageUrl(result.imageUrl);
        setMetadata(result.metadata);
        onImageGenerated?.(result.imageUrl, result.metadata);
      } catch (canvasError) {
        console.warn('Canvas generation failed, using SVG fallback:', canvasError);
        // Fallback a SVG simple
        const simpleImageUrl = generateSimpleNFTImage(data);
        setImageUrl(simpleImageUrl);
        
        // Crear metadatos básicos
        const basicMetadata = {
          name: `Wallet Verification Certificate #${data.tokenId}`,
          description: `Certificate of wallet verification and risk assessment for ${data.walletAddress}`,
          image: simpleImageUrl,
          attributes: [
            { trait_type: "Wallet Address", value: data.walletAddress },
            { trait_type: "Risk Level", value: data.riskLevel },
            { trait_type: "Risk Profile", value: data.riskProfile },
            { trait_type: "Risk Score", value: data.riskScore },
            { trait_type: "Verification Date", value: data.verificationDate },
            { trait_type: "Polkadot Address", value: data.polkadotAddress },
            { trait_type: "Token ID", value: data.tokenId }
          ]
        };
        
        setMetadata(basicMetadata);
        onImageGenerated?.(simpleImageUrl, basicMetadata);
      }
    } catch (error: any) {
      console.error('Error generating NFT image:', error);
      setError(error.message || 'Error generando imagen del NFT');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.download = `wallet-verification-${data.tokenId}.png`;
    link.href = imageUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadMetadata = () => {
    if (!metadata) return;
    
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `wallet-verification-${data.tokenId}-metadata.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isGenerating) {
    return (
      <div className="card-enhanced rounded-xl p-6 border-blue-500">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="animate-spin text-2xl">🎨</div>
          <h3 className="text-lg font-semibold">Generando Imagen del NFT</h3>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="animate-pulse bg-gray-700 h-64 rounded-lg"></div>
        </div>
        <p className="text-center text-gray-400 text-sm mt-4">
          Creando certificado visual único...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-enhanced rounded-xl p-6 border-red-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">❌</div>
          <h3 className="text-lg font-semibold">Error Generando Imagen</h3>
        </div>
        <p className="text-red-300 mb-4">{error}</p>
        <button
          onClick={generateImage}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="card-enhanced rounded-xl p-6 border-green-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🖼️</div>
          <h3 className="text-lg font-semibold">Imagen del NFT</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFullImage(!showFullImage)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors text-sm"
          >
            {showFullImage ? '📱 Pequeña' : '🔍 Grande'}
          </button>
          <button
            onClick={downloadImage}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors text-sm"
          >
            💾 Descargar
          </button>
        </div>
      </div>

      {/* Vista previa de la imagen */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4">
        <div className={`mx-auto ${showFullImage ? 'max-w-full' : 'max-w-xs'}`}>
          <img
            src={imageUrl}
            alt={`NFT Certificate #${data.tokenId}`}
            className={`w-full h-auto rounded-lg shadow-lg ${showFullImage ? 'max-h-96' : 'max-h-64'}`}
            onError={(e) => {
              console.error('Error loading image:', e);
              setError('Error cargando la imagen');
            }}
          />
        </div>
      </div>

      {/* Información del NFT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 p-3 rounded-lg">
          <h4 className="font-semibold text-sm text-gray-300 mb-2">Detalles del Certificado</h4>
          <div className="space-y-1 text-xs">
            <p><span className="text-gray-400">Token ID:</span> #{data.tokenId}</p>
            <p><span className="text-gray-400">Perfil:</span> {data.riskProfile}</p>
            <p><span className="text-gray-400">Score:</span> {data.riskScore}/100</p>
            <p><span className="text-gray-400">Nivel:</span> {data.riskLevel}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 p-3 rounded-lg">
          <h4 className="font-semibold text-sm text-gray-300 mb-2">Información Técnica</h4>
          <div className="space-y-1 text-xs">
            <p><span className="text-gray-400">Wallet:</span> {data.walletAddress.slice(0, 8)}...</p>
            <p><span className="text-gray-400">Polkadot:</span> {data.polkadotAddress.slice(0, 8)}...</p>
            <p><span className="text-gray-400">Fecha:</span> {data.verificationDate}</p>
            <p><span className="text-gray-400">Formato:</span> PNG/SVG</p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={downloadImage}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
        >
          💾 Descargar Imagen
        </button>
        <button
          onClick={downloadMetadata}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
        >
          📄 Descargar Metadatos
        </button>
        <button
          onClick={generateImage}
          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
        >
          🔄 Regenerar
        </button>
      </div>

      {/* Información adicional */}
      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/50 rounded-lg">
        <p className="text-blue-300 text-xs">
          <strong>💡 Tip:</strong> Esta imagen es única para cada verificación y contiene toda la información 
          del análisis de riesgo. Puedes usarla como certificado visual de la verificación.
        </p>
      </div>
    </div>
  );
}
