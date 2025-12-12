# Guía de Licencias en Story Protocol

## Resumen de Términos Actuales

Todas las obras registradas en Manna Art tienen esta configuración de licencia PIL (Programmable IP License):

### ✅ Permisos Habilitados

| Permiso | Valor | Significado |
|---------|-------|-------------|
| **transferable** | `true` | El NFT puede transferirse/venderse |
| **commercialUse** | `true` | Permite uso comercial de la obra |
| **derivativesAllowed** | `true` | **SÍ permite crear remix/derivados** |
| **derivativesApproval** | `false` | **NO requiere aprobación previa** |

### ⚠️ Condiciones para Derivados

| Condición | Valor | Significado |
|-----------|-------|-------------|
| **derivativesReciprocal** | `true` | Los derivados deben usar la misma licencia |
| **derivativesAttribution** | `true` | Los derivados deben dar crédito al original |
| **defaultMintingFee** | Variable | Costo para crear un derivado (lo configuras tú) |
| **commercialRevShare** | Variable | % de royalty que pagas al original (lo configuras tú) |

## 🎯 Interpretación: ¿Permite Remix?

**SÍ**, tu obra **permite remix** (`derivativesAllowed: true`), pero con condiciones:

### Para crear un remix de tu obra, alguien debe:

1. ✅ **NO necesita tu permiso** (approval: false)
2. ⚠️ **Pagar el minting fee** que configuraste (ej: 10 ETH si pusiste $10)
3. ⚠️ **Usar la misma licencia** (reciprocal: true)
4. ✅ **Dar atribución** al original
5. ⚠️ **Compartir royalties** según el % que configuraste

## 💡 Problema Actual: Fees Muy Altos

### Ejemplo de tu obra "Rock 08":
- **Precio de Licencia**: 10 USD → **10 ETH** en IP tokens
- **Royalty**: 30%

Esto significa:
- Crear un remix cuesta **10 ETH** (≈ $35,000 USD al precio actual)
- El creador del remix debe compartir **30%** de sus ganancias contigo

**Resultado**: Nadie creará remix porque es prohibitivamente caro.

## 🔧 Solución: Ajustar los Fees

### Recomendaciones según tipo de licencia:

| Tipo de Licencia | Minting Fee | Royalty | Mejor para |
|------------------|-------------|---------|-----------|
| **CC0 (Dominio Público)** | 0 ETH | 0% | Máxima adopción, comunidad |
| **Creative Commons** | 0 ETH | 0-10% | Proyectos open source, arte colaborativo |
| **Licencia Comercial Abierta** | 0.001-0.01 ETH | 5-15% | Balance entre acceso y monetización |
| **Licencia Comercial Restrictiva** | 0.1-1 ETH | 15-30% | Proteger obras de alto valor |
| **Licencia Exclusiva** | 1+ ETH | 30-50% | Obras únicas, colaboraciones premium |

### Ejemplos Prácticos:

#### 1. **Licencia Abierta para Remix** (Recomendado para arte experimental)
```
Precio de Licencia: 0 ETH
Royalty: 5%
```
- **Ventaja**: Fomenta remix y derivados
- **Desventaja**: Poca monetización directa

#### 2. **Licencia Comercial Equilibrada** (Recomendado general)
```
Precio de Licencia: 0.001 ETH (≈ $3.50 USD)
Royalty: 10%
```
- **Ventaja**: Balance entre acceso y monetización
- **Desventaja**: Requiere gestión de pagos

#### 3. **Licencia Premium**
```
Precio de Licencia: 0.1 ETH (≈ $350 USD)
Royalty: 25%
```
- **Ventaja**: Mayor monetización por uso
- **Desventaja**: Menos adopción

## 📝 Cómo Configurar tus Licencias

### En el Formulario de Registro:

1. **Precio de Licencia (USD)**:
   - Ingresa el valor en USD
   - Se convierte automáticamente a ETH
   - **Recomendación**: 0 para fomentar remix, 0.001-0.01 para monetizar

2. **Royalty Comercial (%)**:
   - Ingresa el porcentaje (0-100)
   - Este % se aplica a todos los ingresos comerciales
   - **Recomendación**: 5-15% para balance, 0% para máxima apertura

### Valores Recomendados por Caso de Uso:

| Caso de Uso | Precio Licencia | Royalty |
|-------------|----------------|---------|
| Arte experimental | 0 | 0-5% |
| Fotografía stock | 0.001 ETH | 10% |
| Ilustraciones | 0.005 ETH | 15% |
| Arte digital premium | 0.01 ETH | 20% |
| Obras únicas | 0.1+ ETH | 25-30% |

## 🔄 Comparación con Licencias Tradicionales

| Story Protocol | Equivalente Tradicional |
|----------------|------------------------|
| `derivativesAllowed: true` | CC BY-SA (permite derivados) |
| `derivativesAllowed: false` | CC BY-ND (sin derivados) |
| `commercialUse: true` | Licencia comercial |
| `commercialUse: false` | CC BY-NC (no comercial) |
| `derivativesReciprocal: true` | ShareAlike (SA) |
| `derivativesReciprocal: false` | Sin restricción de licencia |

## 🎨 Ejemplos de Configuración

### 1. **Obra de Arte Abierta** (como Creative Commons BY-SA)
```
Configuración actual: ✅ Ya está así
Precio de Licencia: 0 ETH
Royalty: 0%

Permite: Todo (uso comercial, derivados, redistribución)
Requiere: Atribución
```

### 2. **Fotografía Stock** (licencia comercial)
```
Configuración actual: ✅ Ya está así
Precio de Licencia: 0.001-0.01 ETH
Royalty: 10-15%

Permite: Uso comercial, derivados
Genera: Ingresos por licencia + royalties
```

### 3. **NFT Coleccionable** (licencia restrictiva)
```
Configuración actual: ✅ Ya está así
Precio de Licencia: 0.1-1 ETH
Royalty: 20-30%

Permite: Uso limitado, derivados costosos
Genera: Ingresos significativos por uso
```

## 🚀 Recomendación para Manna Art

Para fomentar un ecosistema vibrante de remix y derivados:

### Configuración Recomendada:
- **Precio de Licencia**: `0` o `0.001 ETH`
- **Royalty**: `5-10%`

Esto permite:
1. ✅ Fácil creación de derivados
2. ✅ Atribución automática
3. ✅ Ingresos por royalties
4. ✅ Viralidad y adopción

### Beneficios:
- Más creadores harán remix de tus obras
- Construyes una red de derivados que te generan royalties
- Tu obra se vuelve viral en la comunidad

## 🔗 Referencias

- [Story Protocol Docs - PIL](https://docs.story.foundation/concepts/licensing)
- [Creative Commons Licenses](https://creativecommons.org/licenses/)
- [PIL Flavors](https://docs.story.foundation/concepts/licensing/pil-flavors)

---

**Nota**: Los términos de licencia se configuran al momento de registrar la obra y **no se pueden cambiar después**. Elige cuidadosamente según tus objetivos.
