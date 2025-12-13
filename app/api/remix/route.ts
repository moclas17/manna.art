import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, uploadMetadata } from '@/lib/arweave-client';
import { mintAndRegisterDerivativeIP, IPMetadata } from '@/lib/story-client';
import { addArtwork, getArtworkByIpId } from '@/lib/artworks-db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extraer datos del formulario
    const parentIpId = formData.get('parentIpId') as string;
    const email = formData.get('email') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const ipType = formData.get('ipType') as string;
    const file = formData.get('file') as File;
    const walletAddress = formData.get('walletAddress') as string;
    const licenseFeeUSD = formData.get('licenseFee') as string;
    const commercialRevShare = formData.get('commercialRevShare') as string;

    console.log('📝 Remix solicitado:', {
      parentIpId,
      email,
      title,
      ipType,
      walletAddress,
      licenseFeeUSD,
      commercialRevShare,
    });

    // Validación de campos requeridos
    if (!parentIpId || !title || !description || !ipType || !file || !walletAddress) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // 0. Obtener el parent artwork de la base de datos para acceder a sus licenseTermsIds
    console.log('🔍 Buscando parent artwork en la base de datos...');
    const parentArtwork = getArtworkByIpId(parentIpId);

    if (!parentArtwork) {
      return NextResponse.json(
        { error: `No se encontró el artwork parent con ipId: ${parentIpId}` },
        { status: 404 }
      );
    }

    if (!parentArtwork.licenseTermsIds || parentArtwork.licenseTermsIds.length === 0) {
      return NextResponse.json(
        { error: `El artwork parent no tiene license terms. No se pueden crear derivatives.` },
        { status: 400 }
      );
    }

    console.log('✅ Parent artwork encontrado:', {
      id: parentArtwork.id,
      title: parentArtwork.title,
      licenseTermsIds: parentArtwork.licenseTermsIds,
    });

    // 1. Subir el archivo del remix a Arweave
    console.log('📤 Subiendo archivo del remix a Arweave...');
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileUploadResult = await uploadFile(fileBuffer, file.type, {
      'Title': title,
      'Type': ipType,
      'Creator': walletAddress,
      'Parent-IP': parentIpId,
      'Is-Remix': 'true',
    });

    console.log('✅ Archivo del remix subido a Arweave:', fileUploadResult.url);

    // 2. Crear metadata del remix y subirla a Arweave
    const metadata: IPMetadata = {
      title,
      description,
      ipType,
      creators: [walletAddress],
      createdAt: new Date().toISOString(),
      externalUrl: fileUploadResult.url,
    };

    console.log('📤 Subiendo metadata del remix a Arweave...');
    const metadataUploadResult = await uploadMetadata({
      ...metadata,
      image: fileUploadResult.url,
      attributes: [
        { trait_type: 'IP Type', value: ipType },
        { trait_type: 'Creator', value: walletAddress },
        { trait_type: 'Type', value: 'Remix/Derivative' },
        { trait_type: 'Parent IP ID', value: parentIpId },
        { trait_type: 'Platform', value: 'Manna Art' },
      ],
    });

    console.log('✅ Metadata del remix subida a Arweave:', metadataUploadResult.url);

    // 3. Registrar el remix como derivative IP en Story Protocol
    console.log('🎨 Registrando remix en Story Protocol...');

    // Convertir el precio de licencia de USD a unidades USDC (6 decimales)
    // USDC tiene 6 decimales, así que multiplicamos por 1,000,000
    const licenseFeeAmount = licenseFeeUSD ? BigInt(Math.floor(parseFloat(licenseFeeUSD) * 1_000_000)) : BigInt(0);
    const revSharePercent = commercialRevShare ? parseInt(commercialRevShare) : 10;

    console.log('🔢 Valores de licencia:', {
      licenseFeeUSD,
      licenseFeeAmount: licenseFeeAmount.toString(),
      revSharePercent,
    });

    const result = await mintAndRegisterDerivativeIP({
      parentIpId,
      recipient: walletAddress as `0x${string}`,
      metadataURI: metadataUploadResult.url,
      parentLicenseTermsIds: parentArtwork.licenseTermsIds, // Usar los license terms del parent
      licenseFeeUSDC: licenseFeeAmount,
      commercialRevShare: revSharePercent,
    });

    console.log('✅ Remix registrado en Story Protocol:', {
      ipId: result.ipId,
      tokenId: result.tokenId,
      txHash: result.txHash,
    });

    // 4. Guardar el remix en la base de datos
    console.log('💾 Guardando remix en la base de datos...');
    const artwork = addArtwork({
      title,
      description,
      ipType,
      fileUrl: fileUploadResult.url,
      fileId: fileUploadResult.id,
      metadataUrl: metadataUploadResult.url,
      metadataId: metadataUploadResult.id,
      creatorWallet: walletAddress,
      creatorEmail: email,
      ipId: result.ipId,
      nftTokenId: result.tokenId,
      parentIpId: parentIpId, // Guardar el parent IP ID
      isRemix: true, // Marcar como remix
    });

    console.log('✅ Remix guardado en la base de datos:', artwork.id);

    return NextResponse.json({
      success: true,
      data: {
        artworkId: artwork.id,
        fileUrl: fileUploadResult.url,
        fileId: fileUploadResult.id,
        metadataUrl: metadataUploadResult.url,
        metadataId: metadataUploadResult.id,
        ipId: result.ipId,
        tokenId: result.tokenId,
        txHash: result.txHash,
        message: 'Remix creado exitosamente como derivative IP en Story Protocol',
      },
    });
  } catch (error: any) {
    console.error('❌ Error creating remix:', error);
    return NextResponse.json(
      { error: error.message || 'Error al crear el remix' },
      { status: 500 }
    );
  }
}
