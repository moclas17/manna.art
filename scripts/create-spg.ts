/**
 * Script para crear un SPG NFT Collection personalizado
 * 
 * Uso:
 *   npx tsx scripts/create-spg.ts
 * 
 * O con variables de entorno:
 *   SPG_NAME="Manna Art Collection" SPG_SYMBOL="MANNA" npx tsx scripts/create-spg.ts
 */

import { createSPGCollection, getServerWalletAddress } from '../lib/story-client';
import { zeroAddress } from 'viem';

async function main() {
  try {
    const walletAddress = getServerWalletAddress();
    console.log('👤 Wallet del servidor:', walletAddress);
    console.log('');

    const spgName = process.env.SPG_NAME || 'Manna Art Collection';
    const spgSymbol = process.env.SPG_SYMBOL || 'MANNA';
    const isPublicMinting = process.env.SPG_PUBLIC_MINTING === 'true';
    const mintFeeRecipient = process.env.SPG_MINT_FEE_RECIPIENT || zeroAddress;

    console.log('📋 Configuración del SPG:');
    console.log(`   Nombre: ${spgName}`);
    console.log(`   Símbolo: ${spgSymbol}`);
    console.log(`   Minting público: ${isPublicMinting}`);
    console.log(`   Fee recipient: ${mintFeeRecipient}`);
    console.log('');

    const result = await createSPGCollection({
      name: spgName,
      symbol: spgSymbol,
      isPublicMinting: isPublicMinting,
      mintOpen: true,
      mintFeeRecipient: mintFeeRecipient as `0x${string}`,
      contractURI: '',
      owner: walletAddress || undefined,
    });

    console.log('');
    console.log('✅ SPG NFT Collection creado exitosamente!');
    console.log('');
    console.log('📝 Agrega esta variable de entorno a tu archivo .env.local:');
    console.log(`SPG_NFT_CONTRACT=${result.spgNftContract}`);
    console.log('');
    console.log('🔗 Ver en Storyscan:');
    console.log(`https://mainnet.storyscan.xyz/address/${result.spgNftContract}`);
    console.log('');
    console.log('⚠️ IMPORTANTE:');
    console.log('1. Guarda la dirección del contrato SPG en tu archivo .env.local');
    console.log('2. Si isPublicMinting es false, necesitarás autorizar wallets para mintear');
    console.log('3. Como owner del contrato, puedes autorizar wallets usando setMintAuthorized');
    console.log('');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error creando SPG:', error);
    process.exit(1);
  }
}

main();


