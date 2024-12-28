import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { moonTexture } from '../assets/textures';

const Moon: React.FC = () => {
  const [colorMap, bumpMap] = useTexture([
    moonTexture,
  ]);

  return (
    <mesh position={[5,5,-15]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={colorMap}
        roughness={0.9}
        emissive={new THREE.Color('#FFD700')} // Yellowish glow
      />
    </mesh>
  );
};

export default Moon;
