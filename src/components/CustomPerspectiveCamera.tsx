import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

const CustomPerspectiveCamera = ({ playerRef }: { playerRef: React.RefObject<any> }) => {
  const cameraRef = useRef<any>();
  const { set } = useThree();

  useEffect(() => {
    if (cameraRef.current) {
      set({ camera: cameraRef.current });
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!cameraRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1; 
      const y = -(e.clientY / innerHeight) * 2 + 1;

      cameraRef.current.rotation.y = -x * 1.8; // Horizontal rotation
      cameraRef.current.rotation.x = y * 0.5; // Vertical rotation
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };  
  }, []);

  useEffect(() => {
    const followPlayer = () => {
      if (cameraRef.current && playerRef.current) {
        const playerPosition = playerRef.current.position;
        cameraRef.current.position.x = playerPosition.x;
        cameraRef.current.position.z = playerPosition.z + 2; // Adjust distance behind the player
      }
    };

    const interval = setInterval(followPlayer, 12); // Follow the player in near-real time (60 FPS)

    return () => clearInterval(interval);
  }, [playerRef]);

  return <perspectiveCamera  ref={cameraRef} position={[0, 1, 5]} rotation={[0,0,0]}/>;
};

export default CustomPerspectiveCamera;
