import React, { useEffect, useRef, useState, useContext } from "react";
import { SocketContext } from "../contexts/Socket";
import { Mesh, TextureLoader, Vector3 } from "three";

import { useLoader } from "@react-three/fiber";
import { colorTEXTURES } from "../constants";

type playerProps = {
  playerRef: React.RefObject<Mesh>;
  cameraRef: React.RefObject<any>;
};

const MyPlayer = ({ playerRef, cameraRef }: playerProps) => {
  const { socket,color } = useContext(SocketContext);
  const activeKeys = useRef<Set<string>>(new Set());
  const animationFrameId = useRef<number | null>(null);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [velocity, setVelocity] = useState<number>(0);
  const gravity = -0.005;
  const jumpStrength = 0.05;
  const throttleInterval = 100;
  const lastSentTime = useRef<number>(0);

  const [playerTexture] = useLoader(TextureLoader, [colorTEXTURES[color]]);

  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchMoveRef = useRef({ x: 0, y: 0 });

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

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchMoveRef.current = { x: touch.clientX, y: touch.clientY };

      const dx = touchMoveRef.current.x - touchStartRef.current.x;
      const dy = touchMoveRef.current.y - touchStartRef.current.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) {
          activeKeys.current.add("ArrowRight");
          activeKeys.current.delete("ArrowLeft");
        } else if (dx < -30) {
          activeKeys.current.add("ArrowLeft");
          activeKeys.current.delete("ArrowRight");
        }
      }

      // Vertical swipe (up or down)
      if (Math.abs(dy) > Math.abs(dx)) {
        if (dy < -30) {
          activeKeys.current.add("ArrowUp");
          activeKeys.current.delete("ArrowDown");
        } else if (dy > 30) {
          activeKeys.current.add("ArrowDown");
          activeKeys.current.delete("ArrowUp");
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Reset the keys when touch ends
      activeKeys.current.delete("ArrowUp");
      activeKeys.current.delete("ArrowDown");
      activeKeys.current.delete("ArrowLeft");
      activeKeys.current.delete("ArrowRight");
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
          const newPosition = position.clone().add(forward.clone().multiplyScalar(0.05));
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
          const newPosition = position.clone().add(right.clone().multiplyScalar(-0.05));
          if (newPosition.z > -12.5 && newPosition.z < 12.5 && newPosition.x > -7.5 && newPosition.x < 7.5) {
            position.copy(newPosition);
            playerRef.current.rotation.z += 0.05;
            moved = true;
          }
        }

        if (activeKeys.current.has("ArrowRight")) {
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

        const now = Date.now();
        if (moved && now - lastSentTime.current >= throttleInterval) {
          socket?.emit("send-coordinates", { x: position.x, y: position.y, z: position.z });
          lastSentTime.current = now;
        }
      }

      animationFrameId.current = requestAnimationFrame(updatePlayerPosition);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    animationFrameId.current = requestAnimationFrame(updatePlayerPosition);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);

      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [socket, playerRef, cameraRef, isJumping, velocity]);

  return (
    <mesh position={[0, 0.3, 1]} ref={playerRef} scale={[1, 1, 1]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial map={playerTexture} roughness={1} />
    </mesh>
  );
};

export default MyPlayer;
