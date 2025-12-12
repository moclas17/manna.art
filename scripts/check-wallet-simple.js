/**
 * Script simple para verificar la wallet del servidor
 * Uso: node scripts/check-wallet-simple.js
 */

require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log('🔍 Verificando configuración de la wallet del servidor...\n');

  const privateKey = process.env.STORY_WALLET_PRIVATE_KEY;

  if (!privateKey) {
    console.error('❌ STORY_WALLET_PRIVATE_KEY no está configurada en .env.local');
    process.exit(1);
  }

  console.log('✅ STORY_WALLET_PRIVATE_KEY está configurada\n');

  // Derivar la dirección pública desde la private key
  const { privateKeyToAccount } = await import('viem/accounts');
  const account = privateKeyToAccount(`0x${privateKey.replace('0x', '')}`);
  const walletAddress = account.address;

  console.log('📍 Dirección de la wallet del servidor:');
  console.log(`   ${walletAddress}\n`);

  // Obtener balance usando viem
  const { createPublicClient, http, formatEther } = await import('viem');

  const client = createPublicClient({
    transport: http(process.env.STORY_RPC_URL || 'https://mainnet.storyrpc.io'),
  });

  try {
    const balance = await client.getBalance({ address: walletAddress });
    const balanceInEth = formatEther(balance);

    console.log('💰 Balance en Story Mainnet:');
    console.log(`   ${balanceInEth} IP tokens`);
    console.log(`   ${balance.toString()} wei\n`);

    const minBalance = 0.001;
    if (parseFloat(balanceInEth) < minBalance) {
      console.warn('⚠️ ADVERTENCIA: Balance bajo');
      console.warn(`   Se recomienda al menos ${minBalance} IP tokens para crear un SPG\n`);
      console.warn(`   Para obtener IP tokens:`);
      console.warn(`   1. Envía fondos a: ${walletAddress}`);
      console.warn(`   2. Verifica en: https://mainnet.storyscan.xyz/address/${walletAddress}\n`);
    } else {
      console.log('✅ Balance suficiente para crear un SPG\n');
    }
  } catch (error) {
    console.error('❌ Error obteniendo balance:', error.message);
    console.error('   Verifica que el RPC URL sea correcto\n');
  }

  console.log('🔗 Enlaces útiles:');
  console.log(`   Storyscan: https://mainnet.storyscan.xyz/address/${walletAddress}`);
  console.log(`   Story RPC: ${process.env.STORY_RPC_URL || 'https://mainnet.storyrpc.io'}\n`);

  console.log('📋 Configuración actual:');
  console.log(`   SPG_NFT_CONTRACT: ${process.env.SPG_NFT_CONTRACT || '❌ No configurado (usando SPG público)'}\n`);

  if (!process.env.SPG_NFT_CONTRACT) {
    console.log('💡 Siguiente paso:');
    console.log('   1. Asegúrate de tener fondos en la wallet del servidor');
    console.log('   2. Ejecuta: npx tsx scripts/create-spg.ts');
    console.log('   3. Agrega SPG_NFT_CONTRACT a .env.local\n');
  }
}

main().catch(console.error);
