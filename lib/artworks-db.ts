import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

export interface Artwork {
  id: string;
  title: string;
  description: string;
  ipType: string;
  fileUrl: string;
  fileId: string;
  metadataUrl: string;
  metadataId: string;
  creatorWallet: string;
  creatorEmail: string;
  createdAt: string;
  likes: number;
  views: number;
  ipId?: string; // IP ID de Story Protocol
  nftTokenId?: string; // Token ID del NFT en el contrato SPG
  licenseTermsIds?: string[]; // IDs de los license terms adjuntos (para crear derivatives)
  parentIpId?: string; // IP ID del parent (si es un remix/derivative)
  isRemix?: boolean; // Flag para indicar que es un remix
}

const DB_PATH = path.join(process.cwd(), 'data', 'artworks.json');
const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
const usePostgres = isProduction && process.env.POSTGRES_URL;

// Database Strategy:
// - Development: Uses local JSON file for easy testing
// - Production (Vercel): Uses Postgres to avoid read-only filesystem errors

// Inicializar la tabla en Postgres si no existe
async function initPostgresTable() {
  if (!usePostgres) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS artworks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        ip_type TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_id TEXT NOT NULL,
        metadata_url TEXT NOT NULL,
        metadata_id TEXT NOT NULL,
        creator_wallet TEXT NOT NULL,
        creator_email TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        likes INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        ip_id TEXT,
        nft_token_id TEXT,
        license_terms_ids TEXT[],
        parent_ip_id TEXT,
        is_remix BOOLEAN DEFAULT FALSE
      )
    `;
    console.log('✅ Tabla artworks inicializada en Postgres');
  } catch (error) {
    console.error('Error inicializando tabla de Postgres:', error);
  }
}

// Llamar a la inicialización (solo se ejecuta una vez)
if (usePostgres) {
  initPostgresTable();
}

// Asegurar que el directorio data existe (solo para desarrollo)
function ensureDataDir() {
  if (usePostgres) return;
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Leer todas las obras
export async function getAllArtworks(): Promise<Artwork[]> {
  try {
    if (usePostgres) {
      const { rows } = await sql`SELECT * FROM artworks ORDER BY created_at DESC`;
      return rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        ipType: row.ip_type,
        fileUrl: row.file_url,
        fileId: row.file_id,
        metadataUrl: row.metadata_url,
        metadataId: row.metadata_id,
        creatorWallet: row.creator_wallet,
        creatorEmail: row.creator_email,
        createdAt: new Date(row.created_at).toISOString(),
        likes: row.likes,
        views: row.views,
        ipId: row.ip_id,
        nftTokenId: row.nft_token_id,
        licenseTermsIds: row.license_terms_ids,
        parentIpId: row.parent_ip_id,
        isRemix: row.is_remix,
      }));
    } else {
      ensureDataDir();
      if (!fs.existsSync(DB_PATH)) {
        return [];
      }
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading artworks:', error);
    return [];
  }
}

// Agregar una nueva obra
export async function addArtwork(artwork: Omit<Artwork, 'id' | 'createdAt' | 'likes' | 'views'>): Promise<Artwork> {
  try {
    const newArtwork: Artwork = {
      ...artwork,
      id: `artwork_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0,
    };

    if (usePostgres) {
      await sql`
        INSERT INTO artworks (
          id, title, description, ip_type, file_url, file_id,
          metadata_url, metadata_id, creator_wallet, creator_email,
          created_at, likes, views, ip_id, nft_token_id,
          license_terms_ids, parent_ip_id, is_remix
        ) VALUES (
          ${newArtwork.id},
          ${newArtwork.title},
          ${newArtwork.description},
          ${newArtwork.ipType},
          ${newArtwork.fileUrl},
          ${newArtwork.fileId},
          ${newArtwork.metadataUrl},
          ${newArtwork.metadataId},
          ${newArtwork.creatorWallet},
          ${newArtwork.creatorEmail},
          ${newArtwork.createdAt},
          ${newArtwork.likes},
          ${newArtwork.views},
          ${newArtwork.ipId || null},
          ${newArtwork.nftTokenId || null},
          ${newArtwork.licenseTermsIds ? JSON.stringify(newArtwork.licenseTermsIds) : null}::text[],
          ${newArtwork.parentIpId || null},
          ${newArtwork.isRemix || false}
        )
      `;
    } else {
      ensureDataDir();
      const artworks = await getAllArtworks();
      artworks.push(newArtwork);
      fs.writeFileSync(DB_PATH, JSON.stringify(artworks, null, 2));
    }

    return newArtwork;
  } catch (error) {
    console.error('Error adding artwork:', error);
    throw error;
  }
}

// Obtener obra por ID
export async function getArtworkById(id: string): Promise<Artwork | null> {
  if (usePostgres) {
    try {
      const { rows } = await sql`SELECT * FROM artworks WHERE id = ${id}`;
      if (rows.length === 0) return null;

      const row = rows[0];
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        ipType: row.ip_type,
        fileUrl: row.file_url,
        fileId: row.file_id,
        metadataUrl: row.metadata_url,
        metadataId: row.metadata_id,
        creatorWallet: row.creator_wallet,
        creatorEmail: row.creator_email,
        createdAt: new Date(row.created_at).toISOString(),
        likes: row.likes,
        views: row.views,
        ipId: row.ip_id,
        nftTokenId: row.nft_token_id,
        licenseTermsIds: row.license_terms_ids,
        parentIpId: row.parent_ip_id,
        isRemix: row.is_remix,
      };
    } catch (error) {
      console.error('Error getting artwork by id:', error);
      return null;
    }
  } else {
    const artworks = await getAllArtworks();
    return artworks.find(a => a.id === id) || null;
  }
}

// Obtener obra por IP ID de Story Protocol
export async function getArtworkByIpId(ipId: string): Promise<Artwork | null> {
  if (usePostgres) {
    try {
      const { rows } = await sql`SELECT * FROM artworks WHERE ip_id = ${ipId}`;
      if (rows.length === 0) return null;

      const row = rows[0];
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        ipType: row.ip_type,
        fileUrl: row.file_url,
        fileId: row.file_id,
        metadataUrl: row.metadata_url,
        metadataId: row.metadata_id,
        creatorWallet: row.creator_wallet,
        creatorEmail: row.creator_email,
        createdAt: new Date(row.created_at).toISOString(),
        likes: row.likes,
        views: row.views,
        ipId: row.ip_id,
        nftTokenId: row.nft_token_id,
        licenseTermsIds: row.license_terms_ids,
        parentIpId: row.parent_ip_id,
        isRemix: row.is_remix,
      };
    } catch (error) {
      console.error('Error getting artwork by ipId:', error);
      return null;
    }
  } else {
    const artworks = await getAllArtworks();
    return artworks.find(a => a.ipId === ipId) || null;
  }
}

// Obtener obras por creador
export async function getArtworksByCreator(walletAddress: string): Promise<Artwork[]> {
  if (usePostgres) {
    try {
      const { rows } = await sql`
        SELECT * FROM artworks
        WHERE LOWER(creator_wallet) = LOWER(${walletAddress})
        ORDER BY created_at DESC
      `;
      return rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        ipType: row.ip_type,
        fileUrl: row.file_url,
        fileId: row.file_id,
        metadataUrl: row.metadata_url,
        metadataId: row.metadata_id,
        creatorWallet: row.creator_wallet,
        creatorEmail: row.creator_email,
        createdAt: new Date(row.created_at).toISOString(),
        likes: row.likes,
        views: row.views,
        ipId: row.ip_id,
        nftTokenId: row.nft_token_id,
        licenseTermsIds: row.license_terms_ids,
        parentIpId: row.parent_ip_id,
        isRemix: row.is_remix,
      }));
    } catch (error) {
      console.error('Error getting artworks by creator:', error);
      return [];
    }
  } else {
    const artworks = await getAllArtworks();
    return artworks.filter(a => a.creatorWallet.toLowerCase() === walletAddress.toLowerCase());
  }
}

// Incrementar vistas
export async function incrementViews(id: string): Promise<void> {
  try {
    if (usePostgres) {
      await sql`UPDATE artworks SET views = views + 1 WHERE id = ${id}`;
    } else {
      const artworks = await getAllArtworks();
      const index = artworks.findIndex(a => a.id === id);
      if (index !== -1) {
        artworks[index].views += 1;
        fs.writeFileSync(DB_PATH, JSON.stringify(artworks, null, 2));
      }
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

// Dar like
export async function toggleLike(id: string): Promise<number> {
  try {
    if (usePostgres) {
      const { rows } = await sql`
        UPDATE artworks
        SET likes = likes + 1
        WHERE id = ${id}
        RETURNING likes
      `;
      return rows[0]?.likes || 0;
    } else {
      const artworks = await getAllArtworks();
      const index = artworks.findIndex(a => a.id === id);
      if (index !== -1) {
        artworks[index].likes += 1;
        fs.writeFileSync(DB_PATH, JSON.stringify(artworks, null, 2));
        return artworks[index].likes;
      }
      return 0;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return 0;
  }
}

// Obtener obras más recientes
export async function getRecentArtworks(limit: number = 12): Promise<Artwork[]> {
  if (usePostgres) {
    try {
      const { rows } = await sql`
        SELECT * FROM artworks
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
      return rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        ipType: row.ip_type,
        fileUrl: row.file_url,
        fileId: row.file_id,
        metadataUrl: row.metadata_url,
        metadataId: row.metadata_id,
        creatorWallet: row.creator_wallet,
        creatorEmail: row.creator_email,
        createdAt: new Date(row.created_at).toISOString(),
        likes: row.likes,
        views: row.views,
        ipId: row.ip_id,
        nftTokenId: row.nft_token_id,
        licenseTermsIds: row.license_terms_ids,
        parentIpId: row.parent_ip_id,
        isRemix: row.is_remix,
      }));
    } catch (error) {
      console.error('Error getting recent artworks:', error);
      return [];
    }
  } else {
    const artworks = await getAllArtworks();
    return artworks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

// Obtener obras más populares
export async function getPopularArtworks(limit: number = 12): Promise<Artwork[]> {
  if (usePostgres) {
    try {
      const { rows } = await sql`
        SELECT * FROM artworks
        ORDER BY (views + likes * 10) DESC
        LIMIT ${limit}
      `;
      return rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        ipType: row.ip_type,
        fileUrl: row.file_url,
        fileId: row.file_id,
        metadataUrl: row.metadata_url,
        metadataId: row.metadata_id,
        creatorWallet: row.creator_wallet,
        creatorEmail: row.creator_email,
        createdAt: new Date(row.created_at).toISOString(),
        likes: row.likes,
        views: row.views,
        ipId: row.ip_id,
        nftTokenId: row.nft_token_id,
        licenseTermsIds: row.license_terms_ids,
        parentIpId: row.parent_ip_id,
        isRemix: row.is_remix,
      }));
    } catch (error) {
      console.error('Error getting popular artworks:', error);
      return [];
    }
  } else {
    const artworks = await getAllArtworks();
    return artworks
      .sort((a, b) => (b.views + b.likes * 10) - (a.views + a.likes * 10))
      .slice(0, limit);
  }
}
