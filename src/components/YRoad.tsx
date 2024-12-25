import React from "react";
import { roadBaseTexture } from "../assets/textures";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

const YRoad = () => {
    const [colorMap] = useLoader(TextureLoader, [
      roadBaseTexture
    ]);
  return (
    <>
      <mesh position={[0, -0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 20]} />
        <meshStandardMaterial map={colorMap} color={"gray"} side={2} />
      </mesh>

      <mesh position={[-1, -0.39, -7]} rotation={[-Math.PI / 2, 0, 7]}>
        <planeGeometry args={[2, 4]} />
        <meshStandardMaterial color={"gray"} side={2} />
      </mesh>

      <mesh position={[1, -0.39, -7]} rotation={[Math.PI / 2, 0, 7]}>
        <planeGeometry args={[2, 4]} />
        <meshStandardMaterial color={"gray"} side={2} />
      </mesh>
    </>
  );
};

export default YRoad;
