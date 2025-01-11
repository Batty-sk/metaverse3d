import React, { useEffect } from "react";
import { Mesh, MeshStandardMaterial, Vector3 } from "three";
import { Text } from "@react-three/drei";

type PlayersProps = {
  Player_name: string;
  Player_color: string;
  PlayerRef: React.Ref<Mesh>;
  PlayerMaterialMesh:React.Ref<MeshStandardMaterial>
  startingPostition:[number,number,number],
};

const Players = (args: PlayersProps) => {
   console.log("real args....",args.startingPostition);
  console.log('args we are getting for the player',args.startingPostition[0],args.startingPostition[1])
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
      <meshStandardMaterial ref={args.PlayerMaterialMesh} />
    </mesh>
    </group>
  );
};

export default Players;
