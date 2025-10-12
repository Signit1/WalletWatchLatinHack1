# WalletWatch - Analizador de Riesgo AML/PLD con Polkadot

Una aplicación web moderna para analizar el nivel de riesgo AML (Anti-Money Laundering) y PLD (Prevención de Lavado de Dinero) de direcciones de wallet de criptomonedas con verificación on-chain en Polkadot.

## 🚀 **Prototipo para Latin Hack**

Este proyecto cumple con los requisitos del prototipo para Latin Hack:
- ✅ **Tecnología Blockchain de Polkadot**: Smart contracts en Solidity (EVM) para verificación on-chain
- ✅ **Funcionalidad Principal**: Verificación de wallets en testnet de Paseo
- ✅ **Página /test Obligatoria**: Interfaz para interactuar directamente con smart contracts
- ✅ **Botones Write/Read**: Operaciones de escritura y lectura en blockchain
- ✅ **Repositorio Público**: Código disponible con documentación completa

## 🔗 **Información de Red y Contratos**

### **Red de Prueba**
- **Red**: Paseo Testnet (Polkadot)
- **RPC URL**: `https://paseo-rpc.polkadot.io`
- **Explorer**: https://paseo.subscan.io/
- **Chain ID**: 941 (Paseo)

### **Smart Contract**
- **Contrato**: VerificationContract
- **Dirección**: `0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6`
- **Lenguaje**: Solidity (EVM compatible)
- **ABI**: Disponible en `/contracts/VerificationContract.json`
- **Funciones**:
  - `verifyWallet()` - Verificar wallet con datos de riesgo
  - `getVerification()` - Leer datos de verificación
  - `batchVerifyWallets()` - Verificación en lote
  - `isVerified()` - Verificar si wallet está verificada
  - `getTotalVerifications()` - Obtener total de verificaciones

## 🚀 Características

### ✅ Proveedores Integrados
- **Alchemy** - Datos reales de blockchain (balances, transferencias, tipo de cuenta)
- **Elliptic** - Análisis de riesgo y categorización (simulado)
- **OFAC** - Screening contra listas sancionadas (con ejemplos reales)
- **Chainalysis** - Análisis de exposición y categorías (simulado)
- **Blockchain.com** - Análisis adicional (simulado)
- **Fireblocks** - Análisis institucional (simulado)
- **Bridge** - Análisis de puentes (simulado)

### 🎯 Funcionalidades
- **Sistema de Semáforo**: Rojo (Alto), Amarillo (Medio), Verde (Bajo)
- **Análisis en Tiempo Real**: Consulta múltiples proveedores simultáneamente
- **Datos Detallados**: Balances, transferencias, categorías de riesgo
- **Detección OFAC**: Incluye direcciones sancionadas conocidas (Tornado Cash)
- **UI Moderna**: React + Tailwind CSS con diseño responsive

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express
- **Blockchain**: Polkadot (Paseo testnet) + Solidity smart contracts
- **APIs**: Alchemy, Elliptic, OFAC, Chainalysis, Etherscan
- **Web3**: MetaMask integration + Ethers.js
- **NFTs**: Dynamic image generation + ERC-721 simulation
- **Puertos**: Frontend (3002), API (4000)

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/Signit1/WalletWatchLatinHack1.git
cd WalletWatchLatinHack1

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
export ALCHEMY_API_KEY="tu_api_key_de_alchemy"
export ELLIPTIC_API_KEY="tu_api_key_de_elliptic"
export OFAC_API_URL="https://ofac-api.com/v1/screen"
export OFAC_API_KEY="tu_api_key_de_ofac"
export CHAINALYSIS_API_URL="https://api.chainalysis.com/v1/screen"
export CHAINALYSIS_API_KEY="tu_api_key_de_chainalysis"
```

## 🚀 Ejecución

```bash
# Terminal 1: Servidor API
npm run api

# Terminal 2: Frontend
npm run dev
```

**URLs:**
- Frontend: http://localhost:3003
- API: http://localhost:4000

## 🧪 **Cómo Probar el Prototipo**

### **1. Página de Test Obligatoria**
1. **Abrir la aplicación** en http://localhost:3002
2. **Hacer clic en la pestaña "🚀 Test"**
3. **Conectar MetaMask** a Paseo testnet (Chain ID: 941)
4. **Verificar conexión** a Paseo testnet
5. **Hacer clic en "🚀 Verificar en Blockchain"** (Write operation)
6. **Hacer clic en "📖 Leer de Blockchain"** (Read operation)
7. **Ver resultados** de verificación on-chain

### **2. Análisis AML Completo**
1. **Hacer clic en la pestaña "🔍 Análisis"**
2. **Ingresar dirección de wallet** (ej: `0x8576acc5c05D6cE88F4e49BF65BDf0C62F91353c`)
3. **Seleccionar proveedores** a consultar
4. **Presionar "Analizar wallet"**
5. **Hacer clic en "🚀 Verificar en Polkadot Blockchain"** para verificación on-chain
6. **Revisar resultados** y semáforo de riesgo

### **3. Generación de NFTs**
1. **Hacer clic en la pestaña "🖼️ Galería"**
2. **Hacer clic en "🎨 Generar Ejemplos"** para crear NFTs de prueba
3. **Ver NFTs** con imágenes dinámicas según nivel de riesgo

### Ejemplos de Direcciones para Probar

**Direcciones Sancionadas (OFAC):**
- `0x8576acc5c05D6cE88F4e49BF65BDf0C62F91353c` - Tornado Cash
- `0x7f367cc41522ce07553e823bf3be79a889debe1b` - Tornado Cash Router
- `0x68749665ff8d2d112fa859aa293f07a622782f38` - Tornado Cash Relayer

**Direcciones Regulares:**
- `0x000000000000000000000000000000000000dEaD` - Burn address
- Cualquier dirección de wallet válida

## 🔧 Configuración de APIs

### Alchemy (Datos Reales)
```bash
export ALCHEMY_API_KEY="tu_api_key"
```
- Obtiene balances ETH y ERC-20
- Consulta transferencias recientes
- Detecta si es contrato o EOA

### OFAC (Listas Sancionadas)
```bash
export OFAC_API_URL="https://ofac-api.com/v1/screen"
export OFAC_API_KEY="tu_api_key"
```
- Incluye direcciones conocidas de Tornado Cash
- Soporte para `sanctioned.local.json` para más direcciones

### Elliptic & Chainalysis
```bash
export ELLIPTIC_API_KEY="tu_api_key"
export CHAINALYSIS_API_URL="https://api.chainalysis.com/v1/screen"
export CHAINALYSIS_API_KEY="tu_api_key"
```

## 📊 Estructura del Proyecto

```
src/
├── App.tsx                    # Componente principal
├── main.tsx                   # Punto de entrada
├── styles.css                 # Estilos globales
├── lib/                       # Clientes de API
│   ├── alchemy.ts
│   ├── elliptic.ts
│   ├── ofac.ts
│   └── chainalysis.ts
└── components/                # Componentes React
    ├── AlchemyDetails.tsx
    ├── AlchemyDetailsWrapper.tsx
    ├── EllipticDetails.tsx
    ├── EllipticDetailsWrapper.tsx
    ├── OfacDetails.tsx
    ├── OfacDetailsWrapper.tsx
    ├── ChainalysisDetails.tsx
    └── ChainalysisDetailsWrapper.tsx
```

## 🎨 Sistema de Semáforo

- 🔴 **Rojo (Alto)**: Match en listas OFAC/FBI o riesgo ≥70
- 🟡 **Amarillo (Medio)**: Riesgo entre 40-69
- 🟢 **Verde (Bajo)**: Riesgo <40, sin hallazgos relevantes

## 🔒 Seguridad

- Las API keys se manejan en el servidor (no expuestas al cliente)
- Endpoints protegidos con validación de entrada
- Fallback a simulación si fallan las APIs reales

## 📈 Roadmap

- [ ] Integración con más proveedores AML
- [ ] Dashboard de estadísticas
- [ ] Exportación de reportes
- [ ] API rate limiting
- [ ] Autenticación de usuarios
- [ ] Historial de análisis

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

- GitHub: [@Signit1](https://github.com/Signit1)
- Proyecto: [WalletWatchLatinHack1](https://github.com/Signit1/WalletWatchLatinHack1)

---

**⚠️ Disclaimer**: Esta aplicación es para fines educativos y de demostración. Para uso en producción, implementar validaciones adicionales y cumplir con regulaciones locales.
