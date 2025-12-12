import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains'; // cambia si usas otra red

const SPG_ADDRESS = '0xF5ce96b793dd82375c3c3C684901B57F259F7f14';
const MINTER = '0x4a5Cde56d7F753B3F9212a74dDF232416CFA4fA5'; // server wallet
const OWNER_PK = process.env.OWNER_PRIVATE_KEY as `0x${string}`;
const RPC_URL = process.env.STORY_RPC_URL || 'https://mainnet.storyrpc.io';

const spgAbi = [
  {
    name: 'setMintAuthorized',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'minter', type: 'address' },
      { name: 'authorized', type: 'bool' },
    ],
    outputs: [],
  },
] as const;

async function main() {
  if (!OWNER_PK) throw new Error('Falta OWNER_PRIVATE_KEY');
  const account = privateKeyToAccount(OWNER_PK);
  const client = createWalletClient({
    account,
    chain: mainnet, // ajusta la chain si no es Homer
    transport: http(RPC_URL),
  });

  const hash = await client.writeContract({
    address: SPG_ADDRESS,
    abi: spgAbi,
    functionName: 'setMintAuthorized',
    args: [MINTER, true],
  });
  console.log('Tx enviada:', hash);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});