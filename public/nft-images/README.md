# 🎨 Imágenes Personalizadas para NFTs

Esta carpeta contiene las imágenes personalizadas para los NFTs de WalletWatch.

## 📁 Estructura de Carpetas

```
public/nft-images/
├── high-risk/          # 🔴 NFTs de Alto Riesgo
├── medium-risk/        # 🟡 NFTs de Medio Riesgo
├── low-risk/           # 🟢 NFTs de Bajo Riesgo
└── README.md          # Este archivo
```

## 🎯 Nombres de Archivos Recomendados

### 🔴 Alto Riesgo (high-risk/)
- `crypto-chueco.png` - Para wallets de alto riesgo
- `dona-tranza.png` - Para wallets sancionadas
- `gas-killer.png` - Para wallets con alto consumo de gas

### 🟡 Medio Riesgo (medium-risk/)
- `gas-guzzler.png` - Para wallets con consumo moderado de gas
- `wallet-zombie.png` - Para wallets inactivas
- `crypto-whale.png` - Para wallets con grandes balances
- `nft-enthusiast.png` - Para wallets enfocadas en NFTs

### 🟢 Bajo Riesgo (low-risk/)
- `crypto-saint.png` - Para wallets de bajo riesgo
- `defi-explorer.png` - Para wallets DeFi
- `token-collector.png` - Para wallets de colección

## 📋 Especificaciones Técnicas

- **Formato**: PNG, JPG, WebP
- **Tamaño recomendado**: 400x400 píxeles
- **Tamaño máximo**: 2MB por imagen
- **Resolución**: Mínimo 200x200 píxeles

## 🚀 Cómo Usar

1. **Coloca tus imágenes** en las carpetas correspondientes
2. **Usa los nombres sugeridos** o similares
3. **El sistema automáticamente** detectará y usará tus imágenes
4. **Si no hay imagen personalizada**, se generará una automáticamente

## 🔧 Personalización

El sistema buscará imágenes en este orden:
1. Imagen personalizada en la carpeta correspondiente
2. Imagen generada automáticamente si no existe personalizada

## 📝 Notas

- Las imágenes se sirven desde `/nft-images/` en la aplicación
- Vite automáticamente incluye archivos de `public/` en el build
- No es necesario importar las imágenes en el código
