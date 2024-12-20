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
  const myPlayerRef = useRef<Mesh>(null);
  const { socket,someoneJoinsOrLeave } = useContext(SocketContext);
  const [somethingChanges,setSomethingChanges] = useState<boolean>(false)
  const playersRef = useRef<Map<string, Mesh | null>>(new Map());
  const [canvassize, updateCanvasSize] = useState<canvasSizeProp>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  //socket use Effect
  useEffect(() => {
    if(socket){
      console.log('someone-coordinates getting called....')
      socket.on("someone-coordinates", handleSomeOneCoordinates);
    }
    return () => {
      socket?.off("someone-coordinates", handleSomeOneCoordinates);
    };
  }, [socket,socket?.id]);

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
      style={{ width: canvassize.width, height: `${canvassize.height}px`,    background: 'linear-gradient(180deg, #000000, #0a2a43, #1a4465)', // Deep black to dark blue
      // Dark blue gradient
    }}
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

      <pointLight position={[0, 3,3]} color={"white"} intensity={13} />
      
      <Club />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <planeGeometry args={[10, 20]} />
        <meshStandardMaterial color={"green"} side={2} />
      </mesh>
    </Canvas>
  );
};

export default PlayGround;
