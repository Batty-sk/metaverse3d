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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      activeKeys.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      activeKeys.current.delete(e.key);
    };

    const updatePlayerPosition = () => {
      if (playerRef.current) {
        const position = playerRef.current.position;
        let moved = false;

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

    animationFrameId.current = requestAnimationFrame(updatePlayerPosition);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);

      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [socket, playerRef]);

  return (
<mesh position={[0, 0, 1]} ref={playerRef} scale={[1, 1, 1]}>
  <sphereGeometry args={[0.2, 32, 32]} />
  <meshStandardMaterial color={"white"} />
</mesh>
  );
};

export default MyPlayer;
