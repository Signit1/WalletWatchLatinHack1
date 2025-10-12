# 🔑 Configuración de API Keys - Wallet Watch

## 📋 Resumen

Este documento explica cómo configurar las API keys necesarias para que Wallet Watch funcione con datos reales en lugar de datos simulados.

## 🚀 Configuración Rápida

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env`** y reemplaza `your_*_api_key_here` con tus API keys reales

3. **Reinicia el servidor:**
   ```bash
   npm run dev:unified
   ```

## 🔗 API Keys Requeridas

### 1. **Alchemy API** (Recomendada)
- **URL**: https://dashboard.alchemy.com/
- **Uso**: Datos reales de blockchain (balances, transferencias)
- **Gratis**: Sí, con límites generosos
- **Configuración**: `ALCHEMY_API_KEY=tu_api_key_aqui`

### 2. **Etherscan API** (Recomendada)
- **URL**: https://etherscan.io/apis
- **Uso**: Información detallada de transacciones
- **Gratis**: Sí, con límites
- **Configuración**: `ETHERSCAN_API_KEY=tu_api_key_aqui`

### 3. **Elliptic API** (Opcional)
- **URL**: https://www.elliptic.co/
- **Uso**: Análisis de riesgo avanzado
- **Gratis**: No (servicio premium)
- **Configuración**: `ELLIPTIC_API_KEY=tu_api_key_aqui`

### 4. **Chainalysis API** (Opcional)
- **URL**: https://www.chainalysis.com/
- **Uso**: Análisis de exposición y categorización
- **Gratis**: No (servicio premium)
- **Configuración**: `CHAINALYSIS_API_KEY=tu_api_key_aqui`

### 5. **OFAC API** (Opcional)
- **URL**: https://ofac-api.com/
- **Uso**: Screening contra listas sancionadas
- **Gratis**: No (servicio premium)
- **Configuración**: `OFAC_API_KEY=tu_api_key_aqui`

## 🆓 Configuración Mínima (Gratis)

Para empezar con datos reales, solo necesitas:

```env
# API Keys gratuitas
ALCHEMY_API_KEY=tu_alchemy_key_aqui
ETHERSCAN_API_KEY=tu_etherscan_key_aqui

# El resto puede quedarse como está
ELLIPTIC_API_KEY=your_elliptic_api_key_here
CHAINALYSIS_API_KEY=your_chainalysis_api_key_here
OFAC_API_KEY=your_ofac_api_key_here
```

## 🔧 Cómo Obtener API Keys

### Alchemy (Gratis)
1. Ve a https://dashboard.alchemy.com/
2. Crea una cuenta gratuita
3. Crea una nueva app
4. Copia la API key
5. Agrega `ALCHEMY_API_KEY=tu_key` al archivo `.env`

### Etherscan (Gratis)
1. Ve a https://etherscan.io/apis
2. Crea una cuenta gratuita
3. Genera una API key
4. Copia la API key
5. Agrega `ETHERSCAN_API_KEY=tu_key` al archivo `.env`

## 📊 Verificación de Configuración

Para verificar que tus API keys funcionan:

1. **Inicia el servidor:**
   ```bash
   npm run dev:unified
   ```

2. **Abre la aplicación:** http://localhost:3002

3. **Analiza una wallet** y verifica en los logs del servidor que aparezcan mensajes como:
   ```
   ✅ Alchemy exitoso: low (34.5)
   ✅ Etherscan exitoso: low (28.2)
   ```

4. **Si ves "Datos simulados"** en las notas, significa que la API key no está configurada o no funciona.

## 🚨 Solución de Problemas

### Error: "Datos simulados"
- **Causa**: API key no configurada o incorrecta
- **Solución**: Verifica que la API key esté correctamente en el archivo `.env`

### Error: "API rate limit exceeded"
- **Causa**: Has excedido el límite de requests de la API
- **Solución**: Espera o actualiza a un plan premium

### Error: "Invalid API key"
- **Causa**: API key incorrecta o expirada
- **Solución**: Verifica la API key en el dashboard del proveedor

## 🔒 Seguridad

- **NUNCA** subas el archivo `.env` al repositorio
- **NUNCA** compartas tus API keys
- **ROTA** tus API keys regularmente
- **USA** variables de entorno en producción

## 📈 Rendimiento

### Con API Keys Reales:
- ✅ Datos actualizados en tiempo real
- ✅ Análisis más preciso
- ✅ Mejor experiencia de usuario
- ⚠️ Límites de rate limiting

### Sin API Keys (Datos Simulados):
- ✅ Sin límites de requests
- ✅ Funciona offline
- ❌ Datos no reales
- ❌ Análisis menos preciso

## 🎯 Recomendaciones

1. **Para desarrollo**: Usa al menos Alchemy + Etherscan (gratis)
2. **Para producción**: Configura todas las API keys disponibles
3. **Para demos**: Los datos simulados están bien
4. **Para testing**: Usa API keys de prueba si están disponibles

## 📞 Soporte

Si tienes problemas con la configuración:

1. Verifica que el archivo `.env` esté en la raíz del proyecto
2. Reinicia el servidor después de cambiar las API keys
3. Revisa los logs del servidor para errores específicos
4. Verifica que las API keys sean válidas en los dashboards de los proveedores

---

**¡Listo!** Con esta configuración, Wallet Watch funcionará con datos reales de blockchain. 🚀
