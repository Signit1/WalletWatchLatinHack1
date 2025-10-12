#!/bin/bash

# ===========================================
# SCRIPT DE CONFIGURACIÓN DE API KEYS
# ===========================================

echo "🔑 Configurando API Keys para Wallet Watch"
echo "=========================================="

# Verificar si el archivo .env existe
if [ ! -f .env ]; then
    echo "❌ Archivo .env no encontrado. Creando desde .env.example..."
    cp .env.example .env
fi

echo ""
echo "📝 Por favor, proporciona tus API keys:"
echo ""

# Solicitar API key de Alchemy
echo "🔗 Alchemy API Key:"
echo "   Obtén tu key en: https://dashboard.alchemy.com/"
read -p "   Ingresa tu Alchemy API key: " ALCHEMY_KEY

# Solicitar API key de Etherscan
echo ""
echo "🔍 Etherscan API Key:"
echo "   Obtén tu key en: https://etherscan.io/apis"
read -p "   Ingresa tu Etherscan API key: " ETHERSCAN_KEY

# Actualizar el archivo .env
echo ""
echo "💾 Actualizando archivo .env..."

# Usar sed para reemplazar las API keys
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/ALCHEMY_API_KEY=your_alchemy_api_key_here/ALCHEMY_API_KEY=$ALCHEMY_KEY/" .env
    sed -i '' "s/ETHERSCAN_API_KEY=your_etherscan_api_key_here/ETHERSCAN_API_KEY=$ETHERSCAN_KEY/" .env
else
    # Linux
    sed -i "s/ALCHEMY_API_KEY=your_alchemy_api_key_here/ALCHEMY_API_KEY=$ALCHEMY_KEY/" .env
    sed -i "s/ETHERSCAN_API_KEY=your_etherscan_api_key_here/ETHERSCAN_API_KEY=$ETHERSCAN_KEY/" .env
fi

echo "✅ API keys configuradas en .env"
echo ""

# Verificar configuración
echo "🔍 Verificando configuración..."
if grep -q "ALCHEMY_API_KEY=$ALCHEMY_KEY" .env && grep -q "ETHERSCAN_API_KEY=$ETHERSCAN_KEY" .env; then
    echo "✅ Configuración exitosa!"
    echo ""
    echo "🚀 Para aplicar los cambios:"
    echo "   1. Reinicia el servidor: npm run dev:unified"
    echo "   2. Abre: http://localhost:3002"
    echo "   3. Analiza una wallet para verificar que funcione"
    echo ""
    echo "🔍 Para verificar que las APIs funcionan:"
    echo "   curl -s http://localhost:4000/api/alchemy/analyze -X POST -H \"Content-Type: application/json\" -d '{\"address\":\"0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6\"}' | jq -r '.notes'"
else
    echo "❌ Error en la configuración. Verifica el archivo .env manualmente."
fi

echo ""
echo "📚 Para más información, consulta: API_KEYS_SETUP.md"
