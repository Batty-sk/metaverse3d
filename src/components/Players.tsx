import React, { useEffect } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import { Text } from "@react-three/drei";
import { colorTEXTURES } from "../constants";
import { useTexture } from "@react-three/drei";

type PlayersProps = {
  Player_name: string;
  Player_color:  'yellow' | 'brown' | 'gray';
  PlayerRef: React.Ref<Mesh>;
  PlayerMaterialMesh:React.Ref<MeshStandardMaterial>
  startingPostition:[number,number,number],
};

const Players = (args: PlayersProps) => {

  const [playerTexture] = useTexture([
    colorTEXTURES[args.Player_color]
  ])
   console.log("real args....",args.startingPostition);
  useEffect(()=>{
    console.log("args.playerRef in the useEffect",args.PlayerRef)
  },[])
  return (
    <group>
    <mesh position={args.startingPostition} ref={args.PlayerRef} scale={[1, 1, 1]}>
      <Text position={[0, 1, 0]}
  fontSize={0.2}
  color="orange"
  anchorX="center"
  anchorY="middle"
  material-side={2} >
  {args.Player_name || "User"}
  </Text>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial ref={args.PlayerMaterialMesh} map={playerTexture}  />
    </mesh>
    </group>
  );
};

export default Players;
