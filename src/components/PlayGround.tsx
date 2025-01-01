import { Canvas, useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { Color, Mesh, MeshStandardMaterial, TextureLoader } from "three";
import { useContext } from "react";

import CustomPerspectiveCamera from "./CustomPerspectiveCamera";
import { SocketContext } from "../contexts/Socket";
import MyPlayer from "./MyPlayer";
import Moon from "./Moon";
import Club from "./Club";
import Players from "./Players";
import { calculateDistance } from "../utils";
import ChatArea from "./ChatArea";
import YRoad from "./YRoad";
import { pavingStoneTexture } from "../assets/textures";
import StreetLamp from "./models/StreetLamp";
import YouTubeLogo from "./YoutubeLogo";
import YouTubePlayer from "./YoutubePlayer";

type canvasSizeProp = {
  width: number;
  height: number;
};

const PlayGround = () => {
  const [paveColorMap] = useLoader(TextureLoader, [pavingStoneTexture]);
  const { socket, peersState, playersMedia, myPlayerRef } =
    useContext(SocketContext);
  //getting the media variables from the sockets context
  //const [somethingChanges, setSomethingChanges] = useState<boolean>(false);
  const playersRef = useRef<Map<string, Mesh | null>>(new Map());
  const playersMaterialRef = useRef<Map<string, MeshStandardMaterial | null>>(
    new Map()
  );

  const [canvassize, updateCanvasSize] = useState<canvasSizeProp>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  //socket use Effect
  useEffect(() => {
    if (socket) {
      console.log("someone-coordinates getting called....");
      socket.on("someone-coordinates", handleSomeOneCoordinates);
    }
    return () => {
      socket?.off("someone-coordinates", handleSomeOneCoordinates);
    };
  }, [socket, socket?.id]);

  useEffect(() => {
    const previousPeers = new Set(playersRef.current.keys());
    const currentPeers = new Set(peersState.map((peer) => peer.peerId));

    for (const peerId of currentPeers) {
      if (!previousPeers.has(peerId)) {
        console.log("Adding new player to the lobby...", peerId);
        playersRef.current.set(peerId, null);
      }
    }

    for (const peerId of previousPeers) {
      if (!currentPeers.has(peerId)) {
        console.log("Removing player from the lobby...", peerId);
        playersRef.current.delete(peerId);
      }
    }
  }, [peersState]);
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
  useEffect(()=>{
    updateCanvasSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  },[])

  interface coordinates {
    socketId: string;
    x: number;
    y: number;
    z: number;
  }

  const handleSomeOneCoordinates = (args: coordinates) => {
    if (playersRef.current.has(args.socketId)) {
      const playerRef = playersRef.current.get(args.socketId);
      let Media = null;
      if (!playersMedia?.current.has(args.socketId)) {
        console.log(
          "This player doesn't assosicated with the media ! revertting the distance calculations"
        );
        return;
      }
      Media = playersMedia.current.get(args.socketId);

      if (playerRef) {
        playerRef.position.x = args.x;
        playerRef.position.y = args.y;
        playerRef.position.z = args.z;
        if (
          calculateDistance({
            userX: playerRef?.position.x,
            userZ: playerRef?.position.z,
            currentPlayerX: myPlayerRef.current!.position.x,
            currentPlayerZ: myPlayerRef.current!.position.z,
          })
        ) {
          console.log("players' media object", Media);
          Media!.muted = false;
          // we need to add the volume.
          if (playersMaterialRef.current.has(args.socketId)) {
            console.log("player volume", Media?.volume);
            const player = playersMaterialRef.current.get(args.socketId);
            console.log("setting up the color..");
            player!.color = new Color("blue");
          }
          Media?.play().catch((err) => {
            console.log("some error while playing the remote stream.");
          });
        } else {
          Media!.muted = true;
          console.log("he is too far to be calcuaated ....");
        }
      }
    }
  };
  /* window.requestAnimationFrame */
  console.log("canvas size ", canvassize);

  // this playground would have lot of players in it..
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
        <ChatArea />
      </div>
      <Canvas
        className=""
        style={{
          width: canvassize.width,
          height: `${canvassize.height}px`,
          background: "linear-gradient(180deg, #000000, #0a2a43, #1a4465)", // Deep black to dark blue
          // Dark blue gradient
        }}
      >

        <YRoad />
        <CustomPerspectiveCamera playerRef={myPlayerRef} />
        {/*       <ambientLight/>
         */}{" "}
        <MyPlayer playerRef={myPlayerRef} />
        {peersState.map(
          (args,index) => (
            <Players
              key={args.peerId}
              Player_name={args.peerId}
              Player_color="blue"
              startingPostition={args.position}
              PlayerRef={(el) => playersRef.current.set(args.peerId, el)}
              PlayerMaterialMesh={(el) =>
                playersMaterialRef.current.set(args.peerId, el)
              }
            />
          )
        )}
        <StreetLamp
          positionLight={[0.5, 3.6, 0]}
          position={[-1.1, -0.1, 0]}
          rotation={[0, 0, 0]}
        />
        <Club />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[15, 25]} />
          <meshStandardMaterial map={paveColorMap} side={2} />
        </mesh>
        <Moon />
        <YouTubePlayer />

      </Canvas>
    </div>
  );
};

export default PlayGround;
