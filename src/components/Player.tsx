import React, { useEffect, useRef } from 'react';

type PlayerProps={
playerRef:any
}
const Player = ({playerRef}:PlayerProps) => {

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
    <mesh position={[0, 0, 1]} ref={playerRef} scale={[0.5, 0.5, 0.5]}>
      <boxGeometry />
      <meshBasicMaterial color={'white'} />
    </mesh>
  );
};

export default Player;
