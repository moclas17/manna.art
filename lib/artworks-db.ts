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
}

const DB_PATH = path.join(process.cwd(), 'data', 'artworks.json');

// Asegurar que el directorio data existe
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Leer todas las obras
export function getAllArtworks(): Artwork[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(DB_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading artworks:', error);
    return [];
  }
}

// Agregar una nueva obra
export function addArtwork(artwork: Omit<Artwork, 'id' | 'createdAt' | 'likes' | 'views'>): Artwork {
  try {
    ensureDataDir();
    const artworks = getAllArtworks();

    const newArtwork: Artwork = {
      ...artwork,
      id: `artwork_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 0,
    };

    artworks.push(newArtwork);
    fs.writeFileSync(DB_PATH, JSON.stringify(artworks, null, 2));

    return newArtwork;
  } catch (error) {
    console.error('Error adding artwork:', error);
    throw error;
  }
}

// Obtener obra por ID
export function getArtworkById(id: string): Artwork | null {
  const artworks = getAllArtworks();
  return artworks.find(a => a.id === id) || null;
}

// Obtener obras por creador
export function getArtworksByCreator(walletAddress: string): Artwork[] {
  const artworks = getAllArtworks();
  return artworks.filter(a => a.creatorWallet.toLowerCase() === walletAddress.toLowerCase());
}

// Incrementar vistas
export function incrementViews(id: string): void {
  try {
    const artworks = getAllArtworks();
    const index = artworks.findIndex(a => a.id === id);
    if (index !== -1) {
      artworks[index].views += 1;
      fs.writeFileSync(DB_PATH, JSON.stringify(artworks, null, 2));
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

// Dar like
export function toggleLike(id: string): number {
  try {
    const artworks = getAllArtworks();
    const index = artworks.findIndex(a => a.id === id);
    if (index !== -1) {
      artworks[index].likes += 1;
      fs.writeFileSync(DB_PATH, JSON.stringify(artworks, null, 2));
      return artworks[index].likes;
    }
    return 0;
  } catch (error) {
    console.error('Error toggling like:', error);
    return 0;
  }
}

// Obtener obras más recientes
export function getRecentArtworks(limit: number = 12): Artwork[] {
  const artworks = getAllArtworks();
  return artworks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

// Obtener obras más populares
export function getPopularArtworks(limit: number = 12): Artwork[] {
  const artworks = getAllArtworks();
  return artworks
    .sort((a, b) => (b.views + b.likes * 10) - (a.views + a.likes * 10))
    .slice(0, limit);
}
