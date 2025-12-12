/**
 * Script de prueba para verificar el registro de obras de arte
 * Simula una petición POST a /api/register-ip
 *
 * Uso: node scripts/test-registration.js
 */

require('dotenv').config({ path: '.env.local' });

async function testRegistration() {
  console.log('🧪 Iniciando prueba de registro de obra de arte...\n');

  // Verificar configuración
  console.log('📋 Verificando configuración:');
  console.log(`   SPG_NFT_CONTRACT: ${process.env.SPG_NFT_CONTRACT || '❌ No configurado'}`);
  console.log(`   STORY_WALLET_PRIVATE_KEY: ${process.env.STORY_WALLET_PRIVATE_KEY ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`   ARWEAVE_WALLET_KEY: ${process.env.ARWEAVE_WALLET_KEY ? '✅ Configurada' : '❌ No configurada'}`);
  console.log('');

  if (!process.env.SPG_NFT_CONTRACT) {
    console.error('❌ ERROR: SPG_NFT_CONTRACT no está configurado');
    console.error('   Ejecuta: npx tsx scripts/create-spg.ts');
    process.exit(1);
  }

  // Crear una imagen de prueba (1x1 pixel PNG transparente)
  const testImageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  // Preparar datos del formulario (usar FormData nativo de Node 18+)
  const formData = new FormData();
  formData.append('email', 'erik.valle@gmail.com');
  formData.append('title', 'Test Artwork - SPG Integration');
  formData.append('description', 'Prueba de integración con SPG personalizado de Manna Art');
  formData.append('ipType', 'image');
  formData.append('file', new Blob([testImageBuffer], { type: 'image/png' }), 'test-artwork.png');
  formData.append('walletAddress', process.env.SPG_NFT_CONTRACT); // Usar la dirección del SPG como recipient
  formData.append('licenseFee', '0.001'); // 0.001 ETH
  formData.append('commercialRevShare', '10'); // 10% royalty

  console.log('📤 Enviando petición a /api/register-ip...');
  console.log('   Email: test@manna.art');
  console.log('   Wallet: ' + process.env.SPG_NFT_CONTRACT);
  console.log('   License Fee: 0.001 ETH');
  console.log('   Royalty: 10%');
  console.log('');

  try {
    // Usa el puerto del server si está definido; por defecto Next usa 3000
    const port = process.env.PORT || process.env.NEXT_PUBLIC_PORT || '3000';
    const apiBase = `http://localhost:${port}`;

    const response = await fetch(`${apiBase}/api/register-ip`, {
      method: 'POST',
      body: formData,
      // No setear headers manualmente; fetch añade el boundary correcto
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Registro exitoso!\n');
      console.log('📊 Resultados:');
      console.log(`   Artwork ID: ${data.data.artworkId}`);
      console.log(`   File URL: ${data.data.fileUrl}`);
      console.log(`   Metadata URL: ${data.data.metadataUrl}`);

      if (data.data.storyIpId) {
        console.log(`   Story IP ID: ${data.data.storyIpId}`);
        console.log(`   Story Token ID: ${data.data.storyTokenId}`);
        console.log(`   Story TX Hash: ${data.data.storyTxHash}`);
        console.log('');
        console.log('🔗 Ver en Storyscan:');
        console.log(`   IP Asset: https://mainnet.storyscan.xyz/address/${data.data.storyIpId}`);
        console.log(`   Transaction: https://mainnet.storyscan.xyz/tx/${data.data.storyTxHash}`);
      } else {
        console.log('   ⚠️ Story Protocol: No disponible (solo Arweave)');
      }

      console.log('');
      console.log('✅ Todo funcionó correctamente!');
      console.log('   Tu SPG está configurado y listo para usar.');
    } else {
      console.error('❌ Error en el registro:');
      console.error(`   Status: ${response.status}`);
      console.error(`   Error: ${data.error}`);

      if (data.error?.includes('Workflow__CallerNotAuthorizedToMint')) {
        console.error('');
        console.error('⚠️ SOLUCIÓN:');
        console.error('   El SPG está configurado pero aún no tiene permisos.');
        console.error('   Espera unos minutos y vuelve a intentar.');
      }
    }
  } catch (error) {
    console.error('❌ Error ejecutando la prueba:', error.message);
    console.error('');
    console.error('Verifica que:');
    console.error('   1. El servidor esté corriendo (npm run dev)');
    console.error('   2. El puerto 3001 esté disponible');
    console.error('   3. Las variables de entorno estén configuradas');
  }
}

testRegistration().catch(console.error);
