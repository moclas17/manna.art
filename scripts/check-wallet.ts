/**
 * Script para verificar el balance y la configuración de la wallet del servidor
 *
 * Uso:
 * npx tsx scripts/check-wallet.ts
 */

import { getServerWalletAddress, getStoryClient } from '../lib/story-client';
import { formatEther } from 'viem';

async function main() {
  try {
    console.log('🔍 Verificando configuración de la wallet del servidor...\n');

    // Obtener la dirección de la wallet
    const walletAddress = getServerWalletAddress();

    if (!walletAddress) {
      console.error('❌ No se pudo obtener la dirección de la wallet');
      console.error('Verifica que STORY_WALLET_PRIVATE_KEY esté configurada en .env.local');
      process.exit(1);
    }

    console.log('✅ Wallet del servidor configurada');
    console.log(`📍 Dirección: ${walletAddress}\n`);

    // Obtener el cliente de Story Protocol
    const client = getStoryClient();

    // Obtener el balance
    try {
      const publicClient = (client as any).rpcClient;
      const balance = await publicClient.getBalance({ address: walletAddress });
      const balanceInEth = formatEther(balance);

      console.log('💰 Balance:');
      console.log(`   ${balanceInEth} IP tokens`);
      console.log(`   ${balance.toString()} wei\n`);

      // Verificar si tiene fondos suficientes
      const minBalance = 0.001; // 0.001 IP tokens como mínimo recomendado
      if (parseFloat(balanceInEth) < minBalance) {
        console.warn('⚠️ ADVERTENCIA: Balance bajo');
        console.warn(`   Se recomienda al menos ${minBalance} IP tokens para crear un SPG`);
        console.warn(`   y realizar operaciones en Story Protocol.\n`);
      } else {
        console.log('✅ Balance suficiente para crear un SPG\n');
      }
    } catch (error: any) {
      console.error('❌ Error obteniendo balance:', error.message);
    }

    // Información adicional
    console.log('🔗 Enlaces útiles:');
    console.log(`   Storyscan: https://mainnet.storyscan.xyz/address/${walletAddress}`);
    console.log(`   Story RPC: ${process.env.STORY_RPC_URL || 'https://mainnet.storyrpc.io'}\n`);

    console.log('📋 Variables de entorno configuradas:');
    console.log(`   STORY_WALLET_PRIVATE_KEY: ${process.env.STORY_WALLET_PRIVATE_KEY ? '✅ Configurada' : '❌ No configurada'}`);
    console.log(`   STORY_RPC_URL: ${process.env.STORY_RPC_URL || 'usando default'}`);
    console.log(`   SPG_NFT_CONTRACT: ${process.env.SPG_NFT_CONTRACT || '❌ No configurado (usando SPG público)'}\n`);

    if (!process.env.SPG_NFT_CONTRACT) {
      console.log('💡 Recomendación:');
      console.log('   Crea tu propio SPG para tener control total:');
      console.log('   npx tsx scripts/create-spg.ts\n');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
