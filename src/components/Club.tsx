import { useRef } from "react";
import { woodBaseTexture } from "../assets/textures";

import { Mesh, TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

const Club = () => {
      const [woodTexture] = useLoader(TextureLoader, [
        woodBaseTexture
      ]);
    const clubRef = useRef<Mesh>(null)
    console.log("club position in 3d space !",clubRef);
  return (
    <>
    <mesh position={[-5, 1.5, Math.PI]} ref={clubRef}>
      <planeGeometry args={[5,3]} />
      <meshStandardMaterial map={woodTexture} side={2}/>
    </mesh>

    <mesh position={[-5-2.5, 1.5,Math.PI+2.5]} rotation={[0,Math.PI/2,0]} >
      <planeGeometry args={[5,3]} />
      <meshStandardMaterial map={woodTexture} side={2} />
    </mesh>

    <mesh position={[-5, 1.5,Math.PI + 5]} rotation={[0,0,0]} >
      <planeGeometry args={[5,3]} />
      <meshStandardMaterial map={woodTexture} side={2} />
    </mesh>
    </>
  );
};

export default Club;
