import Arweave from 'arweave';

// Inicializar cliente Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

export interface UploadResult {
  id: string;
  url: string;
}

/**
 * Sube un archivo a Arweave
 */
export async function uploadFile(
  file: Buffer,
  contentType: string,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  try {
    // MODO DESARROLLO: Simular subida a Arweave
    if (process.env.DEV_MODE_SKIP_SUBSCRIPTION === 'true') {
      console.log('🔧 Development mode: Simulating Arweave upload');
      const mockId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return {
        id: mockId,
        url: `https://arweave.net/${mockId}`,
      };
    }

    // Verificar que tenemos una wallet key
    if (!process.env.ARWEAVE_WALLET_KEY) {
      throw new Error('ARWEAVE_WALLET_KEY no está configurada en las variables de entorno');
    }

    // Parsear la wallet key
    const walletKey = JSON.parse(process.env.ARWEAVE_WALLET_KEY);

    // Verificar balance antes de subir
    const address = await arweave.wallets.jwkToAddress(walletKey);
    const balance = await arweave.wallets.getBalance(address);
    const arBalance = arweave.ar.winstonToAr(balance);
    console.log(`💰 Arweave wallet balance: ${arBalance} AR`);

    // Calcular costo
    const price = await arweave.transactions.getPrice(file.length);
    const arPrice = arweave.ar.winstonToAr(price);
    console.log(`💵 Upload cost: ${arPrice} AR`);

    if (parseFloat(arBalance) < parseFloat(arPrice)) {
      throw new Error(`Insufficient balance. Need ${arPrice} AR but only have ${arBalance} AR. Please add funds to your Arweave wallet: ${address}`);
    }

    // Crear la transacción
    const transaction = await arweave.createTransaction(
      {
        data: file,
      },
      walletKey
    );

    // Agregar tags (etiquetas)
    transaction.addTag('Content-Type', contentType);

    // Agregar metadata adicional como tags
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        transaction.addTag(key, value);
      });
    }

    // Firmar la transacción
    await arweave.transactions.sign(transaction, walletKey);

    // Enviar la transacción
    const response = await arweave.transactions.post(transaction);

    if (response.status === 200) {
      return {
        id: transaction.id,
        url: `https://arweave.net/${transaction.id}`,
      };
    } else {
      throw new Error(`Error al subir a Arweave: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error subiendo archivo a Arweave:', error);
    throw error;
  }
}

/**
 * Sube metadata JSON a Arweave
 */
export async function uploadMetadata(metadata: any): Promise<UploadResult> {
  const jsonString = JSON.stringify(metadata, null, 2);
  const buffer = Buffer.from(jsonString, 'utf-8');

  return uploadFile(buffer, 'application/json', {
    'App-Name': 'Manna Art',
    'App-Version': '1.0',
  });
}

/**
 * Obtiene el estado de una transacción
 */
export async function getTransactionStatus(txId: string) {
  try {
    const status = await arweave.transactions.getStatus(txId);
    return status;
  } catch (error) {
    console.error('Error obteniendo estado de transacción:', error);
    throw error;
  }
}

/**
 * Obtiene datos de Arweave
 */
export async function getData(txId: string): Promise<any> {
  try {
    const response = await fetch(`https://arweave.net/${txId}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error obteniendo datos de Arweave:', error);
    throw error;
  }
}

/**
 * Calcula el costo de subir datos a Arweave
 */
export async function getUploadCost(bytes: number): Promise<string> {
  try {
    const price = await arweave.transactions.getPrice(bytes);
    // Convertir de winston a AR
    const arPrice = arweave.ar.winstonToAr(price);
    return arPrice;
  } catch (error) {
    console.error('Error calculando costo:', error);
    throw error;
  }
}

export default arweave;
