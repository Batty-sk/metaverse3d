import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { moonTexture } from '../assets/textures';

const Moon: React.FC = () => {
  const [colorMap] = useTexture([
    moonTexture,
  ]);

  return (
    <mesh position={[5,7,-10]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={colorMap}
        roughness={0.9}
        emissive={new THREE.Color('gray')} // Yellowish glow
      />
    </mesh>
  );
};

export default Moon;
