import {useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

function CustomPerspectiveCamera() {
  const cameraRef = useRef<any>();
  const { set } = useThree();

  useEffect(() => {
    if (cameraRef.current) {
      set({ camera: cameraRef.current });
    }
  }, [set]);

  return <perspectiveCamera fov={1} ref={cameraRef} position={[0, 1, 10]} />;
}
export default CustomPerspectiveCamera