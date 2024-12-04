import React, { useEffect, useRef } from 'react';

type playerProps={
playerRef:any
}
const Player = ({playerRef}:playerProps) => {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          playerRef.current.position.z -= 0.1;
          break;
        case 'ArrowDown':
          playerRef.current.position.z += 0.1;
          break;
        case 'ArrowLeft':
          playerRef.current.position.x -= 0.1;
          break;
        case 'ArrowRight':
          playerRef.current.position.x += 0.1;
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <mesh position={[0, 0, 1]} ref={playerRef} scale={[0.2, 0.4, 0.2]}>
      <sphereGeometry />
      <meshBasicMaterial   color={'white'} />
    </mesh>
  );
};

export default Player;
