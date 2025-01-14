import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import { Suspense } from 'react';

const MetaChat3D: React.FC = () => {
  const [textSize, setTextSize] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setTextSize(4); 
      } else {
        setTextSize(7);  
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 30], fov: 30 }} style={{ width: '100%', height: '100%' }}>
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <Suspense fallback={null}>
        <Center>
          <Text3D
            font={'/fonts/three_font.json'}
            size={textSize}
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
            enableRotate={true}  
            enableZoom={true}   
          />
        </Center>
      </Suspense>
    </Canvas>
  );
};

export default MetaChat3D;
