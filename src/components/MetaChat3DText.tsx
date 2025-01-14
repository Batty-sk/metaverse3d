import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import { Suspense } from 'react';
import { Mesh } from 'three';

const MetaChat3D: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 30], fov: 30 }} style={{ width: '100%', height: '100%' }}>
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <Suspense fallback={null}>
        <Center>
          <Text3D
            font={'/fonts/three_font.json'}
            size={6}
            height={1}
            curveSegments={12}
            bevelThickness={0.3}
            bevelSize={0.1}
            bevelOffset={0}
            bevelSegments={5}
          >
            META CHAT
            <meshStandardMaterial color="white" metalness={0.8} roughness={0.2} emissive={"yellow"} emissiveIntensity={0.5} />
          </Text3D>
          <OrbitControls
        enableRotate={true}  // Enable rotation
        enableZoom={true}   // Disable zoom

      />
        </Center>
      </Suspense>
    </Canvas>
  );
};

export default MetaChat3D;
