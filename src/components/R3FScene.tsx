import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  theme: { waterNormal: string };
}

export const R3FScene: React.FC<Props> = ({ theme }) => {
  const waterRef = useRef<THREE.Mesh>(null!);
  const normalMap = useMemo(() => {
    const t = new THREE.TextureLoader().load(theme.waterNormal);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, [theme.waterNormal]);

  useFrame(({ clock }) => {
    if (waterRef.current) {
      const material = waterRef.current.material as THREE.MeshStandardMaterial;
      material.normalMap.offset.set(clock.getElapsedTime() * 0.05, 0);
    }
  });

  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }} className="absolute inset-0">
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <mesh ref={waterRef} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[20, 20, 32, 32]} />
        <meshStandardMaterial color="#1e3c72" normalMap={normalMap} />
      </mesh>
    </Canvas>
  );
};
