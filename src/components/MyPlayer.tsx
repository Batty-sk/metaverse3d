import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { SocketContext } from "../contexts/Socket";
import { calculateDistance } from "../utils";

type playerProps = {
  playerRef: any;
};


const MyPlayer = ({ playerRef }: playerProps) => {
  const { socket } = useContext(SocketContext);
  const isInside = useState<boolean>(false);


  //rather than calculating the players position for each movement i will do it for the each 300ms 
  //for each 300ms all the players's position will be matched with the current player if the distance is small
  // it means we have to make those mics unmute , if its not muted by the current user only.

  useEffect(() => {
    if (isInside) {
      socket?.on("club_entered", handleClubEntered);
    }
    return () => {
      socket?.off("club_entered", handleClubEntered);
    };
  });
  const handleClubEntered = () => {
    // will get the music streaming data.... i need to make an audio instance and embed in the dom
    //using js
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("player position", playerRef.current);

      if (
        playerRef.current.position.x <= -2.3 &&
        playerRef.current.position.x >= -4 &&
        playerRef.current.position.z >= 5 &&
        playerRef.current.position.z <= 7
      ) {
        console.log("club area.....");
        // entering the club means sending the music streaming to the current user who has entered the club
        // and also removeing the stream after he left.
        // you can't really talk with other people in club -> yeah
        // maybe only voice should only be probhited.
      } else {

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
      socket?.emit("send-coordinates",{x:playerRef.current.position.x,y:playerRef.current.position.y})
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

export default MyPlayer;
