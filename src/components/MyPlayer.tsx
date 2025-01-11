import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { SocketContext } from "../contexts/Socket";
import { Mesh, Vector3 } from "three";

type playerProps = {
  playerRef: React.RefObject<Mesh>;
  cameraRef: React.RefObject<any>;
};

const MyPlayer = ({ playerRef, cameraRef }: playerProps) => {
  const { socket } = useContext(SocketContext);
  const activeKeys = useRef<Set<string>>(new Set());
  const animationFrameId = useRef<number | null>(null);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [velocity, setVelocity] = useState<number>(0);
  const gravity = -0.005;
  const jumpStrength = 0.05;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      activeKeys.current.add(e.key);

      if (e.key === " " && !isJumping) {
        setIsJumping(true);
        setVelocity(jumpStrength);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      activeKeys.current.delete(e.key);
    };

    const updatePlayerPosition = () => {
      if (playerRef.current && cameraRef.current) {
        const position = playerRef.current.position;
        let moved = false;

        const forward = new Vector3();
        cameraRef.current.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new Vector3();
        right.crossVectors(forward, cameraRef.current.up).normalize();

        if (activeKeys.current.has("ArrowUp")) {
          const forward = new Vector3();
          cameraRef.current.getWorldDirection(forward);
          forward.y = 0; // Ignore vertical movement
          forward.normalize();
        
          const newPosition = position.clone().add(forward.clone().multiplyScalar(0.05));
        
          // Out of bounds check for forward movement
          if (newPosition.z > -12.5 && newPosition.z < 12.5 && newPosition.x > -7.5 && newPosition.x < 7.5) {
            position.copy(newPosition);
            playerRef.current.rotation.x -= 0.05;
            moved = true;
          }
        }
        
        if (activeKeys.current.has("ArrowDown")) {
          const backward = new Vector3();
          cameraRef.current.getWorldDirection(backward);
          backward.y = 0;
          backward.normalize();
        
          const newPosition = position.clone().add(backward.clone().multiplyScalar(-0.05)); 
        
          if (newPosition.z > -12.5 && newPosition.z < 12.5 && newPosition.x > -7.5 && newPosition.x < 7.5) {
            position.copy(newPosition);
            playerRef.current.rotation.x += 0.05;
            moved = true;
          }
        }
        
        if (activeKeys.current.has("ArrowLeft")) {
          const forward = new Vector3();
          cameraRef.current.getWorldDirection(forward);
          forward.y = 0;
          forward.normalize();
        
          const right = new Vector3();
          right.crossVectors(forward, cameraRef.current.up).normalize();
        
          const newPosition = position.clone().add(right.clone().multiplyScalar(-0.05)); 
        
          if (newPosition.z > -12.5 && newPosition.z < 12.5 && newPosition.x > -7.5 && newPosition.x < 7.5) {
            position.copy(newPosition);
            playerRef.current.rotation.z += 0.05;
            moved = true;
          }
        }
        
        if (activeKeys.current.has("ArrowRight")) {
          const forward = new Vector3();
          cameraRef.current.getWorldDirection(forward);
          forward.y = 0;
          forward.normalize();
        
          const right = new Vector3();
          right.crossVectors(forward, cameraRef.current.up).normalize();
        
          const newPosition = position.clone().add(right.clone().multiplyScalar(0.05)); 
        
          if (newPosition.z > -12.5 && newPosition.z < 12.5 && newPosition.x > -7.5 && newPosition.x < 7.5) {
            position.copy(newPosition);
            playerRef.current.rotation.z -= 0.05;
            moved = true;
          }
        }
        if (isJumping) {
          position.y += velocity;
          setVelocity((prevVelocity) => prevVelocity + gravity);
          if (position.y <= 0.3) {
            position.y = 0.3;
            setIsJumping(false);
            setVelocity(0);
          }
        }

        if (moved) {
          socket?.emit("send-coordinates", {
            x: position.x,
            y: position.y,
            z: position.z,
          });
        }
      }

      animationFrameId.current = requestAnimationFrame(updatePlayerPosition);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    animationFrameId.current = requestAnimationFrame(updatePlayerPosition);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);

      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [socket, playerRef, cameraRef, isJumping, velocity]);

  return (
    <mesh position={[0, 0.3, 1]} ref={playerRef} scale={[1, 1, 1]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color={"white"} />
    </mesh>
  );
};

export default MyPlayer;
