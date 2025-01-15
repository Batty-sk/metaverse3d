import { useThree } from '@react-three/fiber';
import React, { useEffect } from 'react';

const CustomPerspectiveCamera = ({ playerRef, cameraRef }: { playerRef: React.RefObject<any>, cameraRef: React.RefObject<any> }) => {
  const { set } = useThree();

  useEffect(() => {
    if (cameraRef.current) {
      set({ camera: cameraRef.current });
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!cameraRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      cameraRef.current.rotation.x = -y * 0.1;
      cameraRef.current.rotation.y += -x * 0.05; // Horizontal rotation
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!cameraRef.current) return;
      const { innerWidth, innerHeight } = window;
      // We assume touch is always 1 touch point
      const touch = e.touches[0];
      const x = (touch.clientX / innerWidth) * 2 - 1;
      const y = (touch.clientY / innerHeight) * 2 - 1;
      cameraRef.current.rotation.x = -y * 0.1;
      cameraRef.current.rotation.y += -x * 0.05; // Horizontal rotation
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const followPlayer = () => {
      if (cameraRef.current && playerRef.current) {
        const playerPosition = playerRef.current.position;
        cameraRef.current.position.x = playerPosition.x;
        cameraRef.current.position.z = playerPosition.z + 1;
      }
    };

    const interval = setInterval(followPlayer, 12); 

    return () => clearInterval(interval);
  }, [playerRef]);

  return <perspectiveCamera ref={cameraRef} position={[0, 0.8, 2]} rotation={[0, 0, 0]} />;
};

export default CustomPerspectiveCamera;
