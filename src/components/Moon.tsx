import React from 'react';
import { Cloud, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { moonTexture } from '../assets/textures';

const Moon: React.FC = () => {
  const [colorMap] = useTexture([
    moonTexture,
  ]);

  return (
    <mesh position={[5,7,-15]}>
      <Cloud  position={[5,5,-13]} rotation={[1,0,0]} opacity={0.4} speed={0.2}/>

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
