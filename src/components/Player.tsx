import React, { useEffect, useRef } from "react";

type playerProps = {
  playerRef: any;
};
const Player = ({ playerRef }: playerProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("player position", playerRef.current);

      if (
        (playerRef.current.position.x <= -2.3 &&
        playerRef.current.position.x >= -4) &&
       ( playerRef.current.position.z >= 5 && playerRef.current.position.z <=7)
      )
      {
        console.log("club area.....")
        // entering the club means sending the music streaming to the current user who has entered the club
        // and also removeing the stream after he left.
        // you can't really talk with other people in club -> yeah 
        // maybe only voice should only be probhited.
      }
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
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <mesh position={[0, 0, 1]} ref={playerRef} scale={[0.2, 0.4, 0.2]}>
      <sphereGeometry />
      <meshStandardMaterial color={"white"} />
    </mesh>
  );
};

export default Player;
