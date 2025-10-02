import SongClient from '@/components/songs/[id]/song';

interface SongPageProps {
  params: Promise<{ id: string }>;
}

export default async function SongPage({ params }: SongPageProps) {
  const { id } = await params;
  return <SongClient songId={id} />;
}

