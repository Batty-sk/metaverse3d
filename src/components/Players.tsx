import React from "react";
import { Mesh } from "three";
type PlayersProps = {
  Player_name: string;
  Player_color: string;
  PlayerRef: React.Ref<Mesh>;
};

const Players = (args: PlayersProps) => {
  return (
    <mesh ref={args.PlayerRef} position={[0, 0, 1]} scale={[0.2, 0.4, 0.2]}>
      <sphereGeometry />
      <meshStandardMaterial color={args.Player_color} />
    </mesh>
  );
};

export default Players;
