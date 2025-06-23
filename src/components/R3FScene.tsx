import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Water } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  theme: { waterNormal: string };
}

export const R3FScene: React.FC<Props> = ({ theme }) => {
  const waterRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (waterRef.current) {
      (waterRef.current.material as any).uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }} className="absolute inset-0">
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <Water
        ref={waterRef}
        args={[10, 10]}
        waterNormals={new THREE.TextureLoader().load(theme.waterNormal, (t) => {
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
        })}
        sunDirection={new THREE.Vector3(1, 1, 1)}
        sunColor={0xffffff}
        waterColor={0x001e0f}
        distortionScale={3}
      />
    </Canvas>
  );
};
