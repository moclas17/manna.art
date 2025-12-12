import { PILFlavor, StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { http, Address, zeroAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Story Protocol - MAINNET (Homer)
// Chain IDs: Aeneid testnet = 1315, Story mainnet = 1514

let storyClient: StoryClient | null = null;
let serverWalletAddress: Address | null = null;

export function getStoryClient(): StoryClient {
  if (!storyClient) {
    if (!process.env.STORY_WALLET_PRIVATE_KEY) {
      throw new Error('STORY_WALLET_PRIVATE_KEY no está configurada');
    }

    // Asegurarse de que la private key tenga el prefijo 0x
    const privateKey = process.env.STORY_WALLET_PRIVATE_KEY.startsWith('0x')
      ? process.env.STORY_WALLET_PRIVATE_KEY
      : `0x${process.env.STORY_WALLET_PRIVATE_KEY}`;

    // Convertir la private key a una cuenta
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    serverWalletAddress = account.address;

    const config: StoryConfig = {
      account: account,
      transport: http(process.env.STORY_RPC_URL || 'https://mainnet.storyrpc.io'),
      chainId: 1514, // Story Mainnet (Homer) - también se puede usar 'mainnet'
    };

    storyClient = StoryClient.newClient(config);
  }
  return storyClient;
}

export function getServerWalletAddress(): Address | null {
  // Asegurarse de que el cliente esté inicializado
  if (!serverWalletAddress) {
    getStoryClient();
  }
  return serverWalletAddress;
}

// Dirección del contrato SPG NFT en Story Mainnet (Homer)
// Fuente: https://docs.story.foundation/developers/deployed-smart-contracts
// Si tienes tu propio SPG, configúralo en la variable de entorno SPG_NFT_CONTRACT
export const SPG_NFT_CONTRACT = (process.env.SPG_NFT_CONTRACT || '0x6Cfa03Bc64B1a76206d0Ea10baDed31D520449F5') as Address;

// Dirección del token IP en Story Mainnet
// Usado como currency para las licencias en Story Protocol
export const IP_TOKEN_ADDRESS = '0x1514000000000000000000000000000000000000' as Address;

export interface IPMetadata {
  title: string;
  description: string;
  ipType: string;
  creators: string[];
  createdAt: string;
  externalUrl?: string;
}

export interface RegisterIPParams {
  nftContract: string;
  tokenId: string;
  metadata: IPMetadata;
  userWalletAddress: string;
}

export interface RegisterIPResult {
  ipId: string;
  txHash: string;
  licenseTermsId?: string;
}

/**
 * Registra un NFT como IP en Story Protocol
 */
export async function registerIP(params: RegisterIPParams): Promise<RegisterIPResult> {
  const client = getStoryClient();

  try {
    // Registrar el IP Asset
    const response = await client.ipAsset.register({
      nftContract: params.nftContract as `0x${string}`,
      tokenId: BigInt(params.tokenId),
      ipMetadata: {
        ipMetadataURI: '', // Se llenará con IPFS URI
        ipMetadataHash: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
        nftMetadataURI: '',
        nftMetadataHash: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
      },
    });

    return {
      ipId: response.ipId || '',
      txHash: response.txHash || '',
    };
  } catch (error) {
    console.error('Error registrando IP en Story Protocol:', error);
    throw error;
  }
}

/**
 * Adjunta términos de licencia a un IP
 */
export async function attachLicenseTerms(
  ipId: string,
  licenseTermsId: string
): Promise<string> {
  const client = getStoryClient();

  try {
    const response = await client.license.attachLicenseTerms({
      ipId: ipId as `0x${string}`,
      licenseTermsId: BigInt(licenseTermsId),
    });

    return response.txHash || '';
  } catch (error) {
    console.error('Error adjuntando términos de licencia:', error);
    throw error;
  }
}

/**
 * Obtiene información de un IP registrado
 * NOTA: API temporalmente deshabilitada - el método get() no existe en la versión actual del SDK
 */
/* export async function getIPDetails(ipId: string) {
  const client = getStoryClient();

  try {
    const ipAsset = await client.ipAsset.get(ipId as `0x${string}`);
    return ipAsset;
  } catch (error) {
    console.error('Error obteniendo detalles del IP:', error);
    throw error;
  }
} */

/**
 * Crea términos de licencia personalizados con precio
 * NOTA: API temporalmente deshabilitada - cambios en la firma del método registerCommercialUsePIL
 */
/* export async function createLicenseTerms(params: {
  transferable: boolean;
  commercialUse: boolean;
  commercialRevShare: number;
  mintingFee?: bigint;
  currency?: Address;
}) {
  const client = getStoryClient();

  try {
    const response = await client.license.registerCommercialUsePIL({
      defaultMintingFee: params.mintingFee || BigInt(0),
      currency: params.currency || ('0x0000000000000000000000000000000000000000' as Address),
      commercialRevShare: params.commercialRevShare,
    });

    return response;
  } catch (error) {
    console.error('Error creando términos de licencia:', error);
    throw error;
  }
} */

/**
 * Crea un nuevo SPG NFT Collection
 * Esto te permite tener tu propio contrato SPG con control total sobre los permisos
 * 
 * @param params - Parámetros para crear la colección
 * @returns La dirección del contrato SPG creado y el hash de la transacción
 */
export async function createSPGCollection(params: {
  name: string;
  symbol: string;
  isPublicMinting?: boolean; // Si es false, solo wallets autorizadas pueden mintear
  mintOpen?: boolean; // Si está abierto para mintear al crear
  mintFeeRecipient?: Address; // Dirección que recibe las fees de minteo
  contractURI?: string; // URI del contrato (ERC-7572)
  baseURI?: string; // Base URI para los tokens
  owner?: Address; // Owner del contrato (por defecto la wallet del servidor)
}): Promise<{
  spgNftContract: Address;
  txHash: string;
}> {
  const client = getStoryClient();
  const walletAddress = getServerWalletAddress();

  try {
    console.log('🏗️ Creando nuevo SPG NFT Collection...');
    console.log(`📝 Nombre: ${params.name}`);
    console.log(`🔖 Símbolo: ${params.symbol}`);
    console.log(`👤 Owner: ${params.owner || walletAddress}`);

    const response = await client.nftClient.createNFTCollection({
      name: params.name,
      symbol: params.symbol,
      isPublicMinting: params.isPublicMinting ?? false, // Por defecto solo wallets autorizadas
      mintOpen: params.mintOpen ?? true, // Por defecto abierto para mintear
      mintFeeRecipient: params.mintFeeRecipient || zeroAddress, // Por defecto sin fees
      contractURI: params.contractURI || '',
      baseURI: params.baseURI,
      owner: params.owner || walletAddress || undefined,
    });

    console.log('✅ SPG NFT Collection creado exitosamente!');
    console.log(`📍 Contrato SPG: ${response.spgNftContract}`);
    console.log(`📋 Transaction hash: ${response.txHash}`);

    return {
      spgNftContract: response.spgNftContract as Address,
      txHash: response.txHash || '',
    };
  } catch (error) {
    console.error('❌ Error creando SPG NFT Collection:', error);
    throw error;
  }
}

/**
 * Autoriza una wallet para mintear en tu SPG NFT Collection
 * Solo el owner del contrato SPG puede autorizar wallets
 * 
 * @param spgNftContract - Dirección del contrato SPG
 * @param minterAddress - Dirección de la wallet a autorizar
 * @param authorized - true para autorizar, false para revocar
 */
export async function setMintAuthorized(
  spgNftContract: Address,
  minterAddress: Address,
  authorized: boolean = true
): Promise<string> {
  const client = getStoryClient();

  try {
    console.log(`${authorized ? '✅' : '❌'} ${authorized ? 'Autorizando' : 'Revocando'} wallet para mintear...`);
    console.log(`📍 Contrato SPG: ${spgNftContract}`);
    console.log(`👤 Wallet: ${minterAddress}`);
    console.log(`🔐 Autorizado: ${authorized}`);

    // El SDK no tiene un método directo para setMintAuthorized
    // Necesitamos usar el cliente de SPG directamente
    const spgNftClient = client.ipAsset.spgNftClient;
    
    // Necesitamos usar el cliente de escritura, no el de solo lectura
    // Esto requiere acceso al wallet client del SDK
    // Por ahora, proporcionamos la información de cómo hacerlo manualmente
    
    console.log(`
⚠️ NOTA: El SDK no expone directamente setMintAuthorized.
Para autorizar la wallet, puedes:

1. Usar el contrato SPG directamente con viem:
   const { writeContract } = await import('viem');
   await writeContract({
     address: '${spgNftContract}',
     abi: [...], // ABI del contrato SPG
     functionName: 'setMintAuthorized',
     args: ['${minterAddress}', ${authorized}]
   });

2. O usar Storyscan para interactuar con el contrato:
   https://mainnet.storyscan.xyz/address/${spgNftContract}

3. O crear un script separado que use el ABI del contrato SPG
    `);

    // Por ahora retornamos un mensaje informativo
    // En el futuro se puede implementar usando el ABI directamente
    throw new Error('setMintAuthorized debe ejecutarse manualmente o mediante un script con el ABI del contrato SPG');
  } catch (error) {
    console.error('❌ Error autorizando wallet:', error);
    throw error;
  }
}

/**
 * Verifica si una wallet está autorizada para mintear en un SPG
 * 
 * @param spgNftContract - Dirección del contrato SPG
 * @param minterAddress - Dirección de la wallet a verificar
 * @returns true si está autorizada, false si no
 */
export async function isMintAuthorized(
  spgNftContract: Address,
  minterAddress: Address
): Promise<boolean> {
  const client = getStoryClient();

  try {
    // El SDK expone spgNftClient que es de solo lectura
    // Necesitamos leer el estado del contrato directamente
    // Por ahora retornamos un mensaje informativo
    console.log(`🔍 Verificando autorización para mintear...`);
    console.log(`📍 Contrato SPG: ${spgNftContract}`);
    console.log(`👤 Wallet: ${minterAddress}`);
    
    // TODO: Implementar lectura del contrato usando el ABI
    // Por ahora, el usuario puede verificar manualmente en Storyscan
    console.log(`
⚠️ Para verificar la autorización, puedes:
1. Usar Storyscan: https://mainnet.storyscan.xyz/address/${spgNftContract}
2. Leer el contrato directamente usando el método mintAuthorized(address)
    `);

    return false; // Por defecto retornamos false hasta implementar la lectura
  } catch (error) {
    console.error('❌ Error verificando autorización:', error);
    throw error;
  }
}

/**
 * Mintea un NFT y lo registra como IP en Story Protocol en una sola transacción
 * Usando SPG (Story Protocol Gateway)
 *
 * IMPORTANTE: La wallet del servidor (STORY_WALLET_PRIVATE_KEY) debe tener permisos
 * en el contrato Workflow para poder mintear. Si obtienes el error
 * "Workflow__CallerNotAuthorizedToMint", necesitas autorizar la wallet del servidor
 * en el contrato Workflow de Story Protocol.
 *
 * @param licenseFeeUSDC - Precio en IP tokens para mintear la licencia
 * @param commercialRevShare - Porcentaje de royalty (0-100)
 */
export async function mintAndRegisterIP(params: {
  metadataURI: string;
  recipient: Address;
  licenseFeeUSDC?: bigint;
  commercialRevShare?: number;
}): Promise<{
  ipId: string;
  tokenId: string;
  txHash: string;
  licenseTermsIds?: string[];
}> {
  const client = getStoryClient();

  try {
    const isCustomSPG = process.env.SPG_NFT_CONTRACT !== undefined;
    console.log('🚀 Minteando NFT y registrando IP en Story Protocol...');
    console.log(`📍 Contrato SPG: ${SPG_NFT_CONTRACT} ${isCustomSPG ? '(Personalizado)' : '(Público)'}`);
    console.log(`📬 Recipient (destinatario del NFT): ${params.recipient}`);
    console.log(`💵 Precio de licencia: ${params.licenseFeeUSDC} IP tokens`);
    console.log(`📊 Royalty comercial: ${params.commercialRevShare}%`);
    if (!isCustomSPG) {
      console.log(`⚠️ NOTA: Usando SPG público. Considera crear tu propio SPG para control total.`);
    }

    // Usar PIL Flavor #3: Commercial Remix
    const flavor3CommercialRemix = PILFlavor.commercialRemix({
      defaultMintingFee: params.licenseFeeUSDC || BigInt(0),
      commercialRevShare: params.commercialRevShare || 0,
      currency: IP_TOKEN_ADDRESS,
    });

    console.log('📜 Usando PIL Flavor #3: Commercial Remix');
    console.log('   ✅ Permite uso comercial');
    console.log('   ✅ Permite crear derivados/remix');
    console.log(`   💵 Minting Fee: ${params.licenseFeeUSDC || 0} IP tokens`);
    console.log(`   📊 Revenue Share: ${params.commercialRevShare || 0}%`);

    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: SPG_NFT_CONTRACT,
      recipient: params.recipient,
      ipMetadata: {
        ipMetadataURI: params.metadataURI,
        ipMetadataHash: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
        nftMetadataURI: params.metadataURI, // Usar la misma metadata para el NFT
        nftMetadataHash: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
      },
      licenseTermsData: [
        {
          terms: flavor3CommercialRemix,
          licensingConfig: {
            isSet: true,
            mintingFee: params.licenseFeeUSDC || BigInt(0),
            licensingHook: '0x0000000000000000000000000000000000000000' as `0x${string}`,
            hookData: '0x' as `0x${string}`,
            commercialRevShare: params.commercialRevShare || 0,
            disabled: false,
            expectMinimumGroupRewardShare: 0,
            expectGroupRewardPool: '0x0000000000000000000000000000000000000000' as `0x${string}`,
          },
        }
      ],
    });

    console.log('✅ IP registrado en Story Protocol:', response);

    return {
      ipId: response.ipId || '',
      tokenId: response.tokenId?.toString() || '',
      txHash: response.txHash || '',
      licenseTermsIds: response.licenseTermsIds?.map(id => id.toString()),
    };
  } catch (error: any) {
    console.error('❌ Error minteando y registrando IP:', error);
    
    // Proporcionar información más útil sobre el error de autorización
    if (error?.message?.includes('Workflow__CallerNotAuthorizedToMint') || 
        error?.shortMessage?.includes('Workflow__CallerNotAuthorizedToMint')) {
      const walletAddress = getServerWalletAddress();
      const isCustomSPG = process.env.SPG_NFT_CONTRACT !== undefined;
      
      const errorMessage = `
❌ ERROR DE AUTORIZACIÓN EN STORY PROTOCOL

La wallet del servidor (${walletAddress || 'N/A'}) no tiene permisos para mintear NFTs en el contrato SPG.

Contrato SPG actual: ${SPG_NFT_CONTRACT}
${isCustomSPG ? '✅ Usando SPG personalizado' : '⚠️ Usando SPG público'}

SOLUCIONES:

OPCIÓN 1 - Crear tu propio SPG (RECOMENDADO):
  Esto te da control total sobre los permisos de minteo.
  
  1. Ejecuta el script: npx tsx scripts/create-spg.ts
     O usa la API: POST /api/spg/create
  
  2. Agrega la variable de entorno:
     SPG_NFT_CONTRACT=<dirección_del_contrato>
  
  3. Como owner de tu SPG, puedes autorizar wallets fácilmente

OPCIÓN 2 - Autorizar en el SPG actual:
  ${isCustomSPG ? 
    `Como owner de tu SPG (${SPG_NFT_CONTRACT}), puedes autorizar la wallet usando:
  setMintAuthorized(${walletAddress || 'WALLET_ADDRESS'}, true)
  
  Puedes hacerlo desde Storyscan o usando un script con el ABI del contrato.` :
    `El SPG público requiere que el owner del contrato te autorice.
  Contacta al owner del contrato SPG o crea tu propio SPG.`}

Documentación: https://docs.story.foundation/concepts/spg/overview
      `;
      console.error(errorMessage);
      throw new Error(`Wallet no autorizada para mintear. ${isCustomSPG ? 'Autoriza la wallet en tu SPG personalizado' : 'Considera crear tu propio SPG para tener control total'}.`);
    }
    
    throw error;
  }
}
