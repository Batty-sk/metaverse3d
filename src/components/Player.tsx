import React, { useEffect, useRef } from "react";

const Player = () => {
  const playerRef = useRef<any>();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("key pressed !", e.key);
      switch (e.key) {
        case "ArrowUp":
          playerRef.current.position.z -= 0.1;
          break;
        case "ArrowDown":
          playerRef.current.position.z += 0.1;
          break;
        case "ArrowLeft":
          playerRef.current.position.x -= 0.1;
          break;
        case "ArrowRight":
          playerRef.current.position.x += 0.1;
          break;
      }

      console.log(playerRef.current);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      console.log("key Up!", e.key);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <mesh position={[0, 0, 1]} ref={playerRef} scale={[0.5,0.5,0.5]} >
      <boxGeometry />
      <meshBasicMaterial color={"white"} />
    </mesh>
  );
};

export default Player;
