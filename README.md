# WalletWatch - Analizador de Riesgo AML/PLD

Una aplicación web moderna para analizar el nivel de riesgo AML (Anti-Money Laundering) y PLD (Prevención de Lavado de Dinero) de direcciones de wallet de criptomonedas.

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
- **APIs**: Alchemy, Elliptic, OFAC, Chainalysis
- **Puertos**: Frontend (3003), API (4000)

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

## 📱 Uso

1. **Abrir la aplicación** en http://localhost:3003
2. **Ingresar dirección de wallet** (ej: `0x8576acc5c05D6cE88F4e49BF65BDf0C62F91353c`)
3. **Seleccionar proveedores** a consultar
4. **Presionar "Analizar wallet"**
5. **Revisar resultados** y semáforo de riesgo

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
