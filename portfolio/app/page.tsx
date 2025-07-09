'use client';

import dynamic from 'next/dynamic';
import { LoadingScreen } from '@/components/3d/LoadingScreen';

const World = dynamic(() => import('@/components/3d/World'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function HomePage() {
  return (
    <main className="absolute top-0 left-0 w-full h-full">
      <World />
    </main>
  );
}