'use client';

import { Cylinder, Cone } from '@react-three/drei';

const Tree = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      <Cylinder args={[0.3, 0.4, 2]} position={[0, 1, 0]} castShadow>
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </Cylinder>
      <Cone args={[1.5, 3, 8]} position={[0, 3.5, 0]} castShadow>
        <meshStandardMaterial color="#228B22" roughness={0.9} />
      </Cone>
    </group>
  );
};

export function Trees() {
  const treePositions: [number, number, number][] = [
    [-12, 0, -8],
    [12, 0, -10],
    [-10, 0, 10],
    [10, 0, 8],
    [-15, 0, 0],
    [15, 0, 2],
    [-8, 0, -12],
    [8, 0, 12],
  ];

  return (
    <>
      {treePositions.map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}
    </>
  );
}