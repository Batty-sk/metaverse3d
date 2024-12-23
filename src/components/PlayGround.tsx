import { Canvas, useThree } from "@react-three/fiber";
import CustomPerspectiveCamera from "./CustomPerspectiveCamera";
import MyPlayer from "./MyPlayer";
import React, { useEffect, useRef, useState } from "react";
import { Mesh } from "three";

import ChatBar from "./ChatArea";
import { useContext } from "react";
import { SocketContext } from "../contexts/Socket";
import Club from "./Club";
import Players from "./Players";
import { calculateDistance } from "../utils";
import ChatArea from "./ChatArea";
import YRoad from "./Yroad";

type canvasSizeProp = {
  width: number;
  height: number;
};

const PlayGround = () => {
  const myPlayerRef = useRef<Mesh>(null);
  const { socket,someoneJoinsOrLeave,playersMedia } = useContext(SocketContext);
  //getting the media variables from the sockets context
  const [somethingChanges,setSomethingChanges] = useState<boolean>(false)
  const playersRef =  useRef<Map<string, Mesh | null>>(new Map());
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
      let Media = null
      if(!playersMedia?.current.has(args.socketId))
      {
        console.log("This player doesn't assosicated with the media ! revertting the distance calculations");
        return 
      }
      Media = playersMedia.current.get(args.socketId)

      if (playerRef) {
        playerRef.position.x = args.x;
        playerRef.position.y = args.y;
        playerRef.position.z = args.z;
       if( calculateDistance({userX:playerRef?.position.x,userZ:playerRef?.position.z,
          currentPlayerX:myPlayerRef.current!.position.x,currentPlayerZ:myPlayerRef.current!.position.z})){
            console.log("players' media object",Media)
            Media!.muted = false
            Media?.play().catch(err=>{console.log("some error while playing the remote stream.")})
          }
        else{
          Media!.muted = true
          console.log("he is too far to be calcuaated ....")
        }
      }

 
    
    }
  };
  /* window.requestAnimationFrame */
  console.log("canvas size ", canvassize);

  // this playground would have lot of players in it..
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ position: "absolute",top:0,left:0,zIndex:1 }}>
        <ChatArea />
      </div>
    <Canvas
      className=""
      style={{ width: canvassize.width, height: `${canvassize.height}px`,    background: 'linear-gradient(180deg, #000000, #0a2a43, #1a4465)', // Deep black to dark blue
      // Dark blue gradient
    }}
    >

    <YRoad />
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

      <pointLight position={[0, 1.5,-5]} color={"white"} intensity={6} />
      <pointLight position={[0, 1.5,2]} color={"white"} intensity={6} />

      <Club />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <planeGeometry args={[10, 20]} />
        <meshStandardMaterial color={"green"} side={2} />
      </mesh>


    </Canvas>
    </div>
  );
};

export default PlayGround;
