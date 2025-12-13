import { NextRequest, NextResponse } from 'next/server';
import { getAllArtworks, getRecentArtworks, getPopularArtworks } from '@/lib/artworks-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'recent';
    const limit = parseInt(searchParams.get('limit') || '12');

    let artworks;

    switch (filter) {
      case 'popular':
        artworks = await getPopularArtworks(limit);
        break;
      case 'all':
        artworks = await getAllArtworks();
        break;
      case 'recent':
      default:
        artworks = await getRecentArtworks(limit);
        break;
    }

    return NextResponse.json({ artworks });
  } catch (error: any) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json(
      { error: error.message || 'Error al obtener las obras' },
      { status: 500 }
    );
  }
}
