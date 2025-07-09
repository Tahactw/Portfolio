'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Cone } from '@react-three/drei';
import * as THREE from 'three';

const Building = ({ position, label, path, onClick, isDay }: any) => {
  const ref = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = Math.sin(t * 1.5 + position[0]) * 0.05;
    }
  });

  return (
    <group 
      ref={ref}
      position={position} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)} 
      onClick={() => onClick(path)}
    >
      <Box args={[3, 2, 3]} position={[0, 1, 0]} castShadow receiveShadow>
        <meshStandardMaterial 
          color={hovered ? "#FFF7E0" : "#FDF6E3"} 
          roughness={0.8} 
          metalness={0.1}
        />
      </Box>
      
      <Cone args={[2.2, 1.5, 4]} position={[0, 2.75, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <meshStandardMaterial color="#AF4D4D" roughness={0.9} metalness={0.1} />
      </Cone>
      
      <Box position={[-0.8, 1, 1.51]} args={[0.5, 0.7, 0.02]}>
        <meshStandardMaterial 
          color="#000000" 
          emissive={isDay ? "#FFF7E0" : "#FFA500"} 
          emissiveIntensity={isDay ? 0.1 : 1} 
        />
      </Box>
      <Box position={[0.8, 1, 1.51]} args={[0.5, 0.7, 0.02]}>
        <meshStandardMaterial 
          color="#000000" 
          emissive={isDay ? "#FFF7E0" : "#FFA500"} 
          emissiveIntensity={isDay ? 0.1 : 1} 
        />
      </Box>
      
      <Box position={[0, 0.6, 1.51]} args={[0.8, 1.2, 0.02]}>
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </Box>
      
      <Text 
        position={[0, 4, 0]} 
        fontSize={0.5} 
        color={hovered ? "#D4A373" : "#FDF6E3"} 
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  );
};

export function Buildings({ onBuildingClick, isDay }: { onBuildingClick: (path: string) => void; isDay: boolean }) {
  return (
    <>
      <Building 
        position={[-6, 0, -5]} 
        label="PROJECTS" 
        path="/projects" 
        onClick={onBuildingClick} 
        isDay={isDay}
      />
      <Building 
        position={[6, 0, -5]} 
        label="EXPERIENCE" 
        path="/experience" 
        onClick={onBuildingClick} 
        isDay={isDay}
      />
      <Building 
        position={[0, 0, 6]} 
        label="CONTACT" 
        path="/contact" 
        onClick={onBuildingClick} 
        isDay={isDay}
      />
    </>
  );
}