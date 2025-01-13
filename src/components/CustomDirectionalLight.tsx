import { DirectionalLightHelper } from 'three';
import { useRef, useEffect } from 'react';

function CustomeDirectionalLight() {
  const lightRef = useRef<any>();

  useEffect(() => {
    if (lightRef.current) {
      // Create a helper for the directional light
      const lightHelper = new DirectionalLightHelper(lightRef.current, 5);
      lightRef.current.add(lightHelper);
    }
  }, []);

  return (
    <>
      <directionalLight
        ref={lightRef}
        color={'pink'}
        position={[0, 1, 0]}
        rotation={[0,0.9,0]}
        intensity={1}
        castShadow={true}
        
      />
    </>
  );
}

export default CustomeDirectionalLight;
