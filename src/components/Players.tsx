import React from "react";
import { Mesh, MeshStandardMaterial } from "three";
type PlayersProps = {
  Player_name: string;
  Player_color: string;
  PlayerRef: React.Ref<Mesh>;
  PlayerMaterialMesh:React.Ref<MeshStandardMaterial>
};

const Players = (args: PlayersProps) => {
  return (
    <mesh position={[0, 0, 1]} ref={args.PlayerRef} scale={[1, 1, 1]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial ref={args.PlayerMaterialMesh} />
    </mesh>
  );
};

export default Players;
