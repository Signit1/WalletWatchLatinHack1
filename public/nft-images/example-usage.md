# 🎨 Cómo Usar Imágenes Personalizadas

## 📋 Pasos para Agregar Tus Imágenes

### 1. **Prepara tus imágenes**
- Tamaño recomendado: 400x400 píxeles
- Formato: PNG, JPG, WebP
- Nombres específicos según el perfil de riesgo

### 2. **Coloca las imágenes en las carpetas correctas**

#### 🔴 Alto Riesgo (public/nft-images/high-risk/)
```
crypto-chueco.png    # Para wallets de alto riesgo
dona-tranza.png      # Para wallets sancionadas  
gas-killer.png       # Para wallets con alto consumo de gas
```

#### 🟡 Medio Riesgo (public/nft-images/medium-risk/)
```
gas-guzzler.png      # Para wallets con consumo moderado de gas
wallet-zombie.png    # Para wallets inactivas
crypto-whale.png     # Para wallets con grandes balances
nft-enthusiast.png   # Para wallets enfocadas en NFTs
```

#### 🟢 Bajo Riesgo (public/nft-images/low-risk/)
```
crypto-saint.png     # Para wallets de bajo riesgo
defi-explorer.png    # Para wallets DeFi
token-collector.png  # Para wallets de colección
```

### 3. **El sistema automáticamente:**
- ✅ Detectará tus imágenes personalizadas
- ✅ Las usará en lugar de generar automáticamente
- ✅ Mostrará logs en la consola del navegador
- ✅ Fallback a generación automática si no encuentra la imagen

## 🔧 Ejemplo de Uso

1. **Copia tu imagen** `mi-crypto-saint.png` a `public/nft-images/low-risk/crypto-saint.png`
2. **Genera un NFT** para una wallet de bajo riesgo
3. **El sistema usará tu imagen** en lugar de generar una automáticamente
4. **Verás en la consola:** `✅ Imagen personalizada encontrada: /nft-images/low-risk/crypto-saint.png`

## 📝 Notas Importantes

- **Nombres exactos:** Usa los nombres sugeridos para que el sistema las detecte
- **Formatos soportados:** PNG, JPG, WebP
- **Tamaño máximo:** 2MB por imagen
- **Resolución mínima:** 200x200 píxeles
- **Fallback automático:** Si no hay imagen personalizada, se genera una automáticamente

## 🚀 Resultado

Una vez que agregues tus imágenes, los NFTs mostrarán tus diseños personalizados en lugar de las imágenes generadas automáticamente, creando una experiencia visual única y personalizada.
