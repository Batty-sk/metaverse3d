import React from "react";
import { Mesh } from "three";
type PlayersProps = {
  Player_name: string;
  Player_color: string;
  PlayerRef: React.Ref<Mesh>;
};

const Players = (args: PlayersProps) => {
  return (
    <mesh position={[0, 0, 1]} ref={args.PlayerRef} scale={[1, 1, 1]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color={args.Player_color} />
    </mesh>
  );
};

export default Players;
