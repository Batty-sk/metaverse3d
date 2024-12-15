import { Canvas, useThree } from "@react-three/fiber";
import CustomPerspectiveCamera from "./CustomPerspectiveCamera";
import MyPlayer from "./MyPlayer";
import React, { useEffect, useRef, useState } from "react";
import { Mesh } from "three";

import { useContext } from "react";
import { SocketContext } from "../contexts/Socket";
import CustomeDirectionalLight from "./CustomDirectionalLight";
import Club from "./Club";
import Players from "./Players";

type canvasSizeProp = {
  width: number;
  height: number;
};

const PlayGround = () => {
  const myPlayerRef = useRef<Mesh>();
  const { socket,someoneJoinsOrLeave } = useContext(SocketContext);
  const [somethingChanges,setSomethingChanges] = useState<boolean>(false)
  const playersRef = useRef<Map<string, Mesh | null>>(new Map());
  const [canvassize, updateCanvasSize] = useState<canvasSizeProp>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  //socket use Effect
  useEffect(() => {
    if(socket)
      socket.on("someone-coordinates", handleSomeOneCoordinates);
    return () => {
      socket?.off("someone-coordinates", handleSomeOneCoordinates);
    };
  }, [socket]);

  useEffect(()=>{
    if(someoneJoinsOrLeave){
      if(someoneJoinsOrLeave[0]){
        console.log('adding the new player into the lobby...',someoneJoinsOrLeave)
          playersRef.current.set(someoneJoinsOrLeave[1],null)
      }
      else{
        playersRef.current.delete(someoneJoinsOrLeave[1])

      }
      setSomethingChanges(!somethingChanges)
    }

  },[someoneJoinsOrLeave])
  useEffect(() => {
    const handleUpdateSize = () => {
      updateCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleUpdateSize);
    return () => window.removeEventListener("resize", handleUpdateSize);
  }, []);

  interface coordinates {
    socketId: string;
    x: number;
    y: number;
    z: number;
  }

  const handleSomeOneCoordinates = (args: coordinates) => {
    if (playersRef.current.has(args.socketId)) {
      const playerRef = playersRef.current.get(args.socketId);
      if (playerRef) {
        playerRef.position.x = args.x;
        playerRef.position.y = args.y;
        playerRef.position.z = args.z;
      }
    }
  };
  /* window.requestAnimationFrame */
  console.log("canvas size ", canvassize);

  // this playground would have lot of players in it..
  return (
    <Canvas
      className=""
      style={{ width: canvassize.width, height: `${canvassize.height}px` }}
    >
      <axesHelper />
      <CustomPerspectiveCamera playerRef={myPlayerRef} />
      {/*       <ambientLight/>
       */}{" "}
      <MyPlayer playerRef={myPlayerRef} />

      {Array.from(playersRef.current.entries()).map(([playerId, playerRef]) => (
        <Players
          key={playerId}
          Player_name={playerId}
          Player_color="blue"
          PlayerRef={(el) => playersRef.current.set(playerId, el)}
        />
      ))}

      <pointLight position={[-3, 2, 5]} color={"white"} intensity={5} />
      
      <Club />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <planeGeometry args={[10, 20]} />
        <meshStandardMaterial color={"orange"} side={2} />
      </mesh>
    </Canvas>
  );
};

export default PlayGround;
