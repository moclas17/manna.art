import { NextRequest, NextResponse } from 'next/server';
import { createSPGCollection, getServerWalletAddress } from '@/lib/story-client';
import { zeroAddress } from 'viem';

/**
 * API Route para crear un SPG NFT Collection
 * 
 * POST /api/spg/create
 * Body: {
 *   name: string,
 *   symbol: string,
 *   isPublicMinting?: boolean,
 *   mintFeeRecipient?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar que la wallet del servidor esté configurada
    if (!process.env.STORY_WALLET_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'STORY_WALLET_PRIVATE_KEY no está configurada' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, symbol, isPublicMinting, mintFeeRecipient } = body;

    // Validar parámetros requeridos
    if (!name || !symbol) {
      return NextResponse.json(
        { error: 'name y symbol son requeridos' },
        { status: 400 }
      );
    }

    const walletAddress = getServerWalletAddress();

    console.log('🏗️ Creando SPG NFT Collection...');
    console.log(`   Nombre: ${name}`);
    console.log(`   Símbolo: ${symbol}`);
    console.log(`   Minting público: ${isPublicMinting ?? false}`);
    console.log(`   Owner: ${walletAddress}`);

    const result = await createSPGCollection({
      name,
      symbol,
      isPublicMinting: isPublicMinting ?? false,
      mintOpen: true,
      mintFeeRecipient: (mintFeeRecipient || zeroAddress) as `0x${string}`,
      contractURI: '',
      owner: walletAddress || undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        spgNftContract: result.spgNftContract,
        txHash: result.txHash,
        storyscanUrl: `https://mainnet.storyscan.xyz/address/${result.spgNftContract}`,
        message: 'SPG NFT Collection creado exitosamente. Agrega SPG_NFT_CONTRACT a tu .env.local',
      },
    });
  } catch (error: any) {
    console.error('❌ Error creando SPG:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear el SPG NFT Collection' },
      { status: 500 }
    );
  }
}


