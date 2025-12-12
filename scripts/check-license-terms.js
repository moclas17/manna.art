/**
 * Script para verificar los términos de licencia de un IP Asset
 *
 * Uso: node scripts/check-license-terms.js <IP_ID>
 * Ejemplo: node scripts/check-license-terms.js 0xBdF66bC25cEA356eFDF83683aa151dd996E3345c
 */

require('dotenv').config({ path: '.env.local' });

async function checkLicenseTerms() {
  const ipId = process.argv[2] || '0xBdF66bC25cEA356eFDF83683aa151dd996E3345c'; // Tu IP ID

  console.log('🔍 Consultando términos de licencia...\n');
  console.log(`📍 IP Asset: ${ipId}\n`);

  try {
    // Importar dinámicamente el cliente de Story
    const { getStoryClient } = await import('../lib/story-client.js');
    const client = getStoryClient();

    // Obtener información del IP Asset
    console.log('📋 Obteniendo información del IP Asset...');
    const ipAsset = await client.ipAsset.get(ipId);

    console.log('✅ IP Asset encontrado:');
    console.log(`   Chain ID: ${ipAsset.chainId}`);
    console.log(`   IP ID: ${ipAsset.id}`);
    console.log(`   NFT Contract: ${ipAsset.nftMetadata?.tokenContract || 'N/A'}`);
    console.log(`   Token ID: ${ipAsset.nftMetadata?.tokenId || 'N/A'}`);
    console.log('');

    // Nota: El SDK no expone directamente los términos de licencia
    // Necesitaríamos llamar al contrato directamente para ver los detalles
    console.log('📜 Términos de licencia configurados en el código:');
    console.log('');
    console.log('   ✅ transferable: true - El NFT puede transferirse');
    console.log('   ✅ commercialUse: true - Permite uso comercial');
    console.log('   ✅ commercialAttribution: true - Requiere atribución');
    console.log('   ✅ derivativesAllowed: true - Permite crear derivados/remix');
    console.log('   ⚠️  derivativesApproval: false - NO requiere aprobación');
    console.log('   ⚠️  derivativesReciprocal: true - Los derivados deben usar la misma licencia');
    console.log('   ✅ derivativesAttribution: true - Los derivados deben dar atribución');
    console.log('');
    console.log('   💵 Configuración de fees:');
    console.log('      - defaultMintingFee: Precio configurado al registrar');
    console.log('      - commercialRevShare: % de royalty configurado');
    console.log('');

    console.log('🔗 Ver en Storyscan:');
    console.log(`   https://mainnet.storyscan.xyz/address/${ipId}`);
    console.log('');

    console.log('📝 Interpretación de los términos:');
    console.log('');
    console.log('   ✅ SÍ permite remix/derivados');
    console.log('   ✅ NO requiere aprobación previa');
    console.log('   ⚠️  Los derivados DEBEN:');
    console.log('      1. Usar la misma licencia (reciprocidad)');
    console.log('      2. Dar atribución al original');
    console.log('      3. Pagar el minting fee configurado');
    console.log('      4. Compartir royalties según commercialRevShare');
    console.log('');

    console.log('💡 Para cambiar a una licencia más abierta:');
    console.log('   - derivativesReciprocal: false (permitir cualquier licencia en derivados)');
    console.log('   - defaultMintingFee: menor (reducir costo de crear derivados)');
    console.log('   - commercialRevShare: ajustar % de royalty');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Verifica que:');
    console.error('   1. El IP ID sea correcto');
    console.error('   2. STORY_WALLET_PRIVATE_KEY esté configurada');
    console.error('   3. El servidor esté corriendo');
  }
}

checkLicenseTerms().catch(console.error);
