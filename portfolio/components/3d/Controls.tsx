'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector2, Vector3, Raycaster, Plane } from 'three';

interface ControlsProps {
  onMove: (pos: Vector3, rot: number, isMoving: boolean, isRunning: boolean) => void;
}

export function Controls({ onMove }: ControlsProps) {
  const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
  const moveDirection = useRef(new Vector3());
  const targetPosition = useRef(new Vector3(0, 0, 0));
  const clickTarget = useRef<Vector3 | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const { camera, gl } = useThree();
  const raycaster = new Raycaster();
  const groundPlane = new Plane(new Vector3(0, 1, 0), 0);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key as keyof typeof keys.current] = true;
      }
    };

    const keyup = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key as keyof typeof keys.current] = false;
      }
    };

    const handleClick = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new Vector2(x, y), camera);

      const intersectionPoint = new Vector3();
      if (raycaster.ray.intersectPlane(groundPlane, intersectionPoint)) {
        clickTarget.current = intersectionPoint.clone();
        clickTarget.current.y = 0;
      }
    };

    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    gl.domElement.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
      gl.domElement.removeEventListener('click', handleClick);
    };
  }, [camera, gl]);

  useFrame((_, delta) => {
    moveDirection.current.set(0, 0, 0);
    const baseSpeed = 4;
    const runMultiplier = 2;
    const speed = baseSpeed * (keys.current.shift ? runMultiplier : 1) * delta;

    let moving = false;
    let angle = 0;

    // Keyboard movement
    if (keys.current.w || keys.current.s || keys.current.a || keys.current.d) {
      clickTarget.current = null;

      if (keys.current.w) moveDirection.current.z -= 1;
      if (keys.current.s) moveDirection.current.z += 1;
      if (keys.current.a) moveDirection.current.x -= 1;
      if (keys.current.d) moveDirection.current.x += 1;

      moveDirection.current.normalize().multiplyScalar(speed);
      targetPosition.current.add(moveDirection.current);

      targetPosition.current.x = Math.max(-15, Math.min(15, targetPosition.current.x));
      targetPosition.current.z = Math.max(-15, Math.min(15, targetPosition.current.z));

      angle = Math.atan2(moveDirection.current.x, moveDirection.current.z);
      moving = true;
    }

    // Click-to-move
    else if (clickTarget.current) {
      const direction = new Vector3()
        .subVectors(clickTarget.current, targetPosition.current)
        .setY(0);

      const distance = direction.length();

      if (distance > 0.1) {
        direction.normalize();
        const moveSpeed = Math.min(speed, distance);
        direction.multiplyScalar(moveSpeed);

        targetPosition.current.add(direction);
        angle = Math.atan2(direction.x, direction.z);
        moving = true;
      } else {
        clickTarget.current = null;
      }
    }

    if (moving !== isMoving || keys.current.shift !== isRunning) {
      setIsMoving(moving);
      setIsRunning(keys.current.shift);
    }

    onMove(targetPosition.current.clone(), angle, moving, keys.current.shift);
  });

  return null;
}
