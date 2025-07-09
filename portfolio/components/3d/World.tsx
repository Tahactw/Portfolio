'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { Character } from './Character';
import { Buildings } from './Buildings';
import { Controls } from './Controls';
import { Trees } from './Trees';
import { Plane, OrbitControls, Stars, Sky } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { Vector3 } from 'three';
import { useSound } from '@/hooks/useSound';
import { useTheme } from 'next-themes';

export default function World() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [characterPosition, setCharacterPosition] = useState(() => new Vector3(0, 0, 0));
  const [characterRotation, setCharacterRotation] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const { playSound, isMuted } = useSound();

  const isDay = resolvedTheme === 'light';

  useEffect(() => {
    if (!isMuted) {
        const sound = playSound('ambient-city', { loop: true, volume: 0.1 });
        return () => sound?.stop();
    }
  }, [isMuted, playSound]);

  const handleBuildingClick = (path: string) => {
    playSound('building-enter', { volume: 0.4 });
    setTimeout(() => router.push(path), 300);
  };

  const handleMove = (newPosition: Vector3, rotation: number, moving: boolean, running: boolean) => {
    setCharacterPosition(newPosition);
    setCharacterRotation(rotation);
    setIsMoving(moving);
    setIsRunning(running);
    
    // Play footstep sound only when starting to move
    if (moving && !isMoving) {
      playSound('robot-footstep', { volume: 0.2 });
    }
  };

  return (
    <Canvas 
      shadows 
      camera={{ position: [10, 10, 10], fov: 50 }}
    >
      <color attach="background" args={[isDay ? '#87CEEB' : '#000020']} />
      <fog attach="fog" args={[isDay ? '#87CEEB' : '#000020', 10, 50]} />
      
      <Suspense fallback={null}>
        <ambientLight intensity={isDay ? 0.5 : 0.1} />
        <directionalLight 
          position={[10, 20, 5]} 
          intensity={isDay ? 1.5 : 0.2} 
          castShadow 
          shadow-mapSize={[2048, 2048]} 
          color={isDay ? '#FFF7E0' : '#A0C0FF'}
        />
        
        <Sky
          distance={450000}
          sunPosition={isDay ? [10, 10, 5] : [0, -1, 0]}
          inclination={0}
          azimuth={0.25}
        />
        
        {!isDay && (
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1} 
          />
        )}
        
        <Character 
          position={characterPosition} 
          rotation={characterRotation}
          isMoving={isMoving}
          isRunning={isRunning}
        />
        <Buildings onBuildingClick={handleBuildingClick} isDay={isDay} />
        <Trees />
        
        <Plane 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.01, 0]} 
          args={[50, 50]} 
          receiveShadow
        >
          <meshStandardMaterial color="#556B2F" roughness={0.8} />
        </Plane>
        
        <Controls onMove={handleMove} />
        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2.5} 
          minDistance={5} 
          maxDistance={25} 
        />
      </Suspense>
    </Canvas>
  );
}