'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface CharacterProps {
  position: THREE.Vector3;
  rotation: number;
  isMoving: boolean;
  isRunning: boolean;
}

export function Character({ position, rotation, isMoving, isRunning }: CharacterProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/Meshy_Merged_Animations.glb');
  const { actions } = useAnimations(animations, group);

  // Initialize with Idle animation
  useEffect(() => {
    if (actions['Idle']) {
      actions['Idle'].reset().fadeIn(0.2).play();
    }
  }, [actions]);

  // Handle animation switching based on movement state
  useEffect(() => {
    if (!actions['Idle'] || !actions['Walking'] || !actions['Running']) {
      console.warn('Animation actions not loaded properly');
      return;
    }

    // Determine which animation should play
    if (isRunning && isMoving) {
      // Switch to Running
      actions['Idle'].fadeOut(0.2);
      actions['Walking'].fadeOut(0.2);
      actions['Running'].reset().fadeIn(0.2).play();
    } else if (isMoving) {
      // Switch to Walking
      actions['Idle'].fadeOut(0.2);
      actions['Running'].fadeOut(0.2);
      actions['Walking'].reset().fadeIn(0.2).play();
    } else {
      // Switch to Idle
      actions['Walking'].fadeOut(0.2);
      actions['Running'].fadeOut(0.2);
      actions['Idle'].reset().fadeIn(0.2).play();
    }
  }, [isMoving, isRunning, actions]);

  // Update position and rotation
  useFrame(() => {
    if (!group.current) return;
    
    // Smooth movement
    group.current.position.lerp(position, 0.1);
    
    // Smooth rotation with proper angle wrapping
    const currentRotation = group.current.rotation.y;
    let rotationDiff = rotation - currentRotation;
    
    // Wrap rotation difference to [-PI, PI]
    while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
    while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;
    
    group.current.rotation.y += rotationDiff * 0.1;
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <primitive 
        object={scene} 
        scale={1}
        castShadow
        receiveShadow
      />
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/Meshy_Merged_Animations.glb');