# 🔑 Configurar API Keys - Guía Rápida

## 🚀 Opción 1: Script Automático (Recomendado)

```bash
./setup-api-keys.sh
```

El script te pedirá tus API keys y las configurará automáticamente.

## ✏️ Opción 2: Edición Manual

1. **Edita el archivo `.env`:**
   ```bash
   nano .env
   ```

2. **Reemplaza estas líneas:**
   ```env
   ALCHEMY_API_KEY=tu_alchemy_key_aqui
   ETHERSCAN_API_KEY=tu_etherscan_key_aqui
   ```

3. **Guarda el archivo** (Ctrl+X, Y, Enter en nano)

## 🔗 Obtener API Keys

### Alchemy (Gratis)
1. Ve a https://dashboard.alchemy.com/
2. Crea cuenta gratuita
3. Crea nueva app
4. Copia la API key

### Etherscan (Gratis)
1. Ve a https://etherscan.io/apis
2. Crea cuenta gratuita
3. Genera API key
4. Copia la API key

## ✅ Verificar Configuración

1. **Reinicia el servidor:**
   ```bash
   npm run dev:unified
   ```

2. **Verifica que funcione:**
   ```bash
   curl -s http://localhost:4000/api/alchemy/analyze -X POST -H "Content-Type: application/json" -d '{"address":"0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"}' | jq -r '.notes'
   ```

3. **Si ves "datos reales" en lugar de "datos simulados", ¡está funcionando!**

## 🎯 Resultado Esperado

**Antes (datos simulados):**
```json
{
  "notes": "Datos simulados (configura ALCHEMY_API_KEY para datos reales)."
}
```

**Después (datos reales):**
```json
{
  "notes": "Datos reales de Alchemy (balance y últimas transferencias)."
}
```

## 🆘 Solución de Problemas

- **"Datos simulados"**: API key no configurada o incorrecta
- **"Invalid API key"**: API key incorrecta o expirada
- **"Rate limit exceeded"**: Has excedido el límite de requests

---

**¡Listo!** Con tus API keys configuradas, Wallet Watch usará datos reales de blockchain. 🚀
