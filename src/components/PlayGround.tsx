import { Canvas, useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import {
  Color,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  Vector3,
} from "three";
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
import BushesAndTrees from "./BushesAndTrees";
import GlowingStar from "./GithubStar";

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
  type InterpolatedMesh = Mesh & {
    interpolation?: {
      startPosition: Vector3;
      endPosition: Vector3;
      progress: number;
    };
  };

  const playersRef = useRef<Map<string, InterpolatedMesh | null>>(new Map()); //camera ref.
  const cameraRef = useRef<any>();

  const playersMaterialRef = useRef<Map<string, MeshStandardMaterial | null>>(
    new Map()
  );

  const [canvassize, updateCanvasSize] = useState<canvasSizeProp>({
    width: window.innerWidth-10,
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
      console.log("updating.. the size");
      updateCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleUpdateSize);
    setTimeout(() => handleUpdateSize(), 100);
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

      let Media = null;
      let Mutes = false;

      Media = playersMedia?.current.get(args.socketId)?.audio;
      Mutes = playersMedia?.current.get(args.socketId)?.mutes || false;

      if (playerRef) {
        // Initialize interpolation data if not present
        if (!playerRef.interpolation) {
          playerRef.interpolation = {
            startPosition: playerRef.position.clone(), //will gives the starting position.
            endPosition: new Vector3(args.x, args.y, args.z), // the ending position where this player needs to be go.
            progress: 0,
          };
        } else {
          playerRef.interpolation.startPosition.copy(playerRef.position);
          playerRef.interpolation.endPosition.set(args.x, args.y, args.z);
          playerRef.interpolation.progress = 0;
        }

        const smoothMove = () => {
          if (playerRef && playerRef.interpolation) {
            playerRef.interpolation.progress += 0.05;
            if (playerRef.interpolation.progress > 1) {
              playerRef.interpolation.progress = 1;
            }

            playerRef.position.lerpVectors(
              playerRef.interpolation.startPosition,
              playerRef.interpolation.endPosition,
              playerRef.interpolation.progress
            );

            if (playerRef.interpolation.progress < 1) {
              requestAnimationFrame(smoothMove);
            }
          }
        };

        smoothMove();
        if (!Media) {
          console.log("player doesnt associated with any media!");
          return;
        }
        if (
          calculateDistance({
            userX: args.x,
            userZ: args.z,
            currentPlayerX: myPlayerRef.current!.position.x,
            currentPlayerZ: myPlayerRef.current!.position.z,
          }) &&
          !Mutes
        ) {
          console.log("players' media object", Media);
          Media!.muted = false;

          Media?.play().catch((err) => {
            console.log("Error playing the remote stream.");
          });
        } else {
          Media!.muted = true;
          console.log("getting players actual coordinates",args.x,args.z)
          console.log("enemy player xz: ",playerRef.position.x,playerRef.position.z)
          console.log("Player is too far...");
        }
      }
    }
  };
  console.log("canvas size ", canvassize);

  // this playground would have lot of players in it..
  return (
    <div
      style={{
        position: "relative",
        width: canvassize.width,
        height: canvassize.height,
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
        <ChatArea />
      </div>
      <Canvas
        className=""
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #000000, #0a2a43, #1a4465)", // Deep black to dark blue
        }}
      >
        <ambientLight intensity={0.5} />
        <YRoad />
        <CustomPerspectiveCamera
          cameraRef={cameraRef}
          playerRef={myPlayerRef}
        />
        {/*       <ambientLight/>
         */}{" "}
        <MyPlayer playerRef={myPlayerRef} cameraRef={cameraRef} />
        {peersState.map((args, index) => (
          <Players
            key={args.peerId}
            Player_name={args.peerName}
            Player_color={args.color}
            startingPostition={args.position}
            PlayerRef={(el) => playersRef.current.set(args.peerId, el)}
            PlayerMaterialMesh={(el) =>
              playersMaterialRef.current.set(args.peerId, el)
            }
          />
        ))}
        <StreetLamp
          positionLight={[0.5, 3.6, -5]}
          position={[-1.1, -0.1, -5]}
          rotation={[0, 0, 0]}
        />
        <Club />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[15, 25]} />
          <meshStandardMaterial map={paveColorMap} side={2} />
        </mesh>
        <Moon />
        <GlowingStar />
        <BushesAndTrees />
      </Canvas>
    </div>
  );
};

export default PlayGround;
