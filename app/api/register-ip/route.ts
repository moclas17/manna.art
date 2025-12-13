import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, uploadMetadata } from '@/lib/arweave-client';
import { mintAndRegisterIP, IPMetadata } from '@/lib/story-client';
import { addArtwork } from '@/lib/artworks-db';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY no está configurada');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
});

// Límites de registros por plan
const PLAN_LIMITS: Record<string, number> = {
  CREADOR: 4,
  PROFESIONAL: 20,
  ELITE: 100,
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extraer datos del formulario
    const email = formData.get('email') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const ipType = formData.get('ipType') as string;
    const file = formData.get('file') as File;
    const walletAddress = formData.get('walletAddress') as string;
    const licenseFeeUSD = formData.get('licenseFee') as string; // Precio de licencia en USD
    const commercialRevShare = formData.get('commercialRevShare') as string; // Porcentaje de royalty

    console.log('📝 Registro de IP solicitado:', {
      email,
      title,
      ipType,
      walletAddress,
      licenseFeeUSD,
      commercialRevShare
    });

    // Validar datos requeridos
    if (!email || !title || !description || !ipType || !file || !walletAddress) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // 1. Verificar que el usuario tiene una suscripción activa
    // MODO DESARROLLO: Simular suscripción para testing
    let userSubscription: any = null;
    let planName: 'CREADOR' | 'PROFESIONAL' | 'ELITE' = 'PROFESIONAL';
    let registrationsUsed = 0;
    let registrationsLimit = PLAN_LIMITS['PROFESIONAL'];

    if (process.env.DEV_MODE_SKIP_SUBSCRIPTION === 'true') {
      console.log('🔧 Development mode: Skipping subscription check for', email);
      // En modo desarrollo, simular plan PROFESIONAL
    } else {
      // Primero buscar el cliente por email
      const customers = await stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (customers.data.length === 0) {
        return NextResponse.json(
          { error: 'No tienes una suscripción activa' },
          { status: 403 }
        );
      }

      const customer = customers.data[0];

      // Luego buscar suscripciones activas de ese cliente
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length === 0) {
        return NextResponse.json(
          { error: 'No tienes una suscripción activa' },
          { status: 403 }
        );
      }

      userSubscription = subscriptions.data[0];

      planName = userSubscription.metadata?.planName as 'CREADOR' | 'PROFESIONAL' | 'ELITE';
      registrationsUsed = parseInt(userSubscription.metadata?.registrationsUsed || '0');
      registrationsLimit = PLAN_LIMITS[planName] || 0;

      console.log(`✅ Suscripción encontrada: ${planName}, registros usados: ${registrationsUsed}/${registrationsLimit}`);

      // 2. Verificar que no ha excedido el límite de registros
      if (registrationsUsed >= registrationsLimit) {
        return NextResponse.json(
          { error: `Has alcanzado el límite de ${registrationsLimit} registros de tu plan ${planName}` },
          { status: 403 }
        );
      }
    }

    // 3. Subir el archivo a Arweave
    console.log('📤 Subiendo archivo a Arweave...');
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileUploadResult = await uploadFile(fileBuffer, file.type, {
      'Title': title,
      'Type': ipType,
      'Creator': walletAddress,
    });

    console.log('✅ Archivo subido a Arweave:', fileUploadResult.url);

    // 4. Crear metadata y subirla a Arweave
    const metadata: IPMetadata = {
      title,
      description,
      ipType,
      creators: [walletAddress],
      createdAt: new Date().toISOString(),
      externalUrl: fileUploadResult.url,
    };

    console.log('📤 Subiendo metadata a Arweave...');
    const metadataUploadResult = await uploadMetadata({
      ...metadata,
      image: fileUploadResult.url,
      attributes: [
        { trait_type: 'IP Type', value: ipType },
        { trait_type: 'Creator', value: walletAddress },
        { trait_type: 'Platform', value: 'Manna Art' },
      ],
    });

    console.log('✅ Metadata subida a Arweave:', metadataUploadResult.url);

    // 5. Registrar en Story Protocol (mintear NFT y registrar IP)
    console.log('🎨 Registrando IP en Story Protocol...');
    console.log('📋 Datos para Story Protocol:', {
      metadataURI: metadataUploadResult.url,
      recipient: walletAddress,
      licenseFeeUSD,
      commercialRevShare,
    });

    let storyIpId: string | null = null;
    let storyTokenId: string | null = null;
    let storyTxHash: string | null = null;
    let storyLicenseTermsIds: string[] | undefined = undefined;

    try {
      // Convertir el precio de licencia de USD a unidades USDC (6 decimales)
      // USDC tiene 6 decimales, así que multiplicamos por 1,000,000
      const licenseFeeAmount = licenseFeeUSD ? BigInt(Math.floor(parseFloat(licenseFeeUSD) * 1_000_000)) : BigInt(0);
      const revSharePercent = commercialRevShare ? parseInt(commercialRevShare) : 0;

      console.log('🔢 Valores convertidos:', {
        licenseFeeUSD,
        licenseFeeAmount: licenseFeeAmount.toString(),
        revSharePercent,
      });

      console.log('📞 Llamando a mintAndRegisterIP...');
      const storyResult = await mintAndRegisterIP({
        metadataURI: metadataUploadResult.url,
        recipient: walletAddress as `0x${string}`,
        licenseFeeUSDC: licenseFeeAmount,
        commercialRevShare: revSharePercent,
      });

      storyIpId = storyResult.ipId;
      storyTokenId = storyResult.tokenId;
      storyTxHash = storyResult.txHash;
      const storyLicenseTermsIds = storyResult.licenseTermsIds;

      console.log('✅ IP registrado en Story Protocol:', {
        ipId: storyIpId,
        tokenId: storyTokenId,
        txHash: storyTxHash,
        licenseTermsIds: storyLicenseTermsIds,
      });
    } catch (storyError: any) {
      console.error('⚠️ Error registrando en Story Protocol:', storyError);
      console.error('⚠️ Stack trace:', storyError.stack);
      // Continuar aunque falle Story Protocol, ya que el archivo está en Arweave
      console.log('⚠️ Continuando sin registro en Story Protocol');
    }

    // 6. Guardar la obra en la base de datos
    console.log('💾 Guardando obra en la base de datos...');
    const artwork = await addArtwork({
      title,
      description,
      ipType,
      fileUrl: fileUploadResult.url,
      fileId: fileUploadResult.id,
      metadataUrl: metadataUploadResult.url,
      metadataId: metadataUploadResult.id,
      creatorWallet: walletAddress,
      creatorEmail: email,
      ipId: storyIpId || undefined,
      nftTokenId: storyTokenId || undefined,
      licenseTermsIds: storyLicenseTermsIds,
    });

    console.log('✅ Obra guardada en la base de datos:', artwork.id);

    // 7. Actualizar el contador de registros usados en Stripe
    if (process.env.DEV_MODE_SKIP_SUBSCRIPTION !== 'true' && userSubscription) {
      await stripe.subscriptions.update(userSubscription.id, {
        metadata: {
          ...userSubscription.metadata,
          registrationsUsed: (registrationsUsed + 1).toString(),
        },
      });
      console.log('✅ Contador de registros actualizado');
    } else {
      console.log('🔧 Development mode: Skipping Stripe subscription update');
    }

    return NextResponse.json({
      success: true,
      data: {
        artworkId: artwork.id,
        fileUrl: fileUploadResult.url,
        fileId: fileUploadResult.id,
        metadataUrl: metadataUploadResult.url,
        metadataId: metadataUploadResult.id,
        storyIpId,
        storyTokenId,
        storyTxHash,
        registrationsUsed: registrationsUsed + 1,
        registrationsLimit,
        message: storyIpId
          ? 'Obra registrada exitosamente en Arweave y Story Protocol.'
          : 'Obra registrada en Arweave. Story Protocol no disponible en este momento.',
      },
    });

  } catch (error: any) {
    console.error('❌ Error registrando IP:', error);
    return NextResponse.json(
      { error: error.message || 'Error al registrar la IP' },
      { status: 500 }
    );
  }
}
