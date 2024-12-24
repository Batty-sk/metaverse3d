import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { SocketContext } from "../contexts/Socket";
import { Mesh } from "three";

type playerProps = {
  playerRef: React.RefObject<Mesh>;
};

const MyPlayer = ({ playerRef }: playerProps) => {
  const { socket } = useContext(SocketContext);
  const activeKeys = useRef<Set<string>>(new Set());
  const animationFrameId = useRef<number | null>(null);
  // Jump-related states
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [velocity, setVelocity] = useState<number>(0); // Vertical velocity for jump
  const gravity = -0.005; // Gravity strength
  const jumpStrength = 0.05; // Initial jump strength

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      activeKeys.current.add(e.key);

      // Jump logic for spacebar
      if (e.key === " " && !isJumping) {
        setIsJumping(true);
        setVelocity(jumpStrength);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      activeKeys.current.delete(e.key);
    };

    const updatePlayerPosition = () => {
      if (playerRef.current) {
        const position = playerRef.current.position;
        let moved = false;

        // Update player movement in X and Z directions
        if (activeKeys.current.has("ArrowUp")) {
          position.z -= 0.05;
          playerRef.current.rotation.x -= 0.05; // Rolling animation
          moved = true;
        }
        if (activeKeys.current.has("ArrowDown")) {
          position.z += 0.05;
          playerRef.current.rotation.x += 0.05;
          moved = true;
        }
        if (activeKeys.current.has("ArrowLeft")) {
          position.x -= 0.05;
          playerRef.current.rotation.z += 0.05;
          moved = true;
        }
        if (activeKeys.current.has("ArrowRight")) {
          position.x += 0.05;
          playerRef.current.rotation.z -= 0.05;
          moved = true;
        }

        // Handle jumping physics (gravity + jump)
        if (isJumping) {
          position.y += velocity; // A


          setVelocity((prevVelocity) => prevVelocity + gravity);
          if (position.y <= 0) {
            position.y = 0; 
            setIsJumping(false);
            setVelocity(0); 
          }
        }

        if (moved) {
          // Emit updated position to server
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

    // Start animation frame
    animationFrameId.current = requestAnimationFrame(updatePlayerPosition);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);

      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [socket, playerRef, isJumping, velocity]);

  return (
    <mesh position={[0, 0, 1]} ref={playerRef} scale={[1, 1, 1]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color={"white"} />
    </mesh>
  );
};

export default MyPlayer;
