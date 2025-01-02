import { useRef } from "react";
import { woodBaseTexture } from "../assets/textures";

import { Mesh, TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import NeonText from "./NeonText";
import YouTubeLogo from "./YoutubeLogo";
import YoutubeController from "./YoutubeController";
const Club = () => {
      const [woodTexture] = useLoader(TextureLoader, [
        woodBaseTexture
      ]);
    const clubRef = useRef<Mesh>(null)
    console.log("club position in 3d space !",clubRef);
  return (
    <>
    <pointLight position={[-5,2,Math.PI+2.5]} color={"pink"} intensity={10}/>
    
    <mesh position={[-5, 1, Math.PI]} ref={clubRef}>
      <planeGeometry args={[5,2]} />
      <meshStandardMaterial map={woodTexture} side={2}/>
    </mesh>

    <mesh position={[-5-2.5, 1,Math.PI+2.5]} rotation={[0,Math.PI/2,0]} >
      <planeGeometry args={[5,2]} />
      <meshStandardMaterial color={"black"} side={2}/>
    </mesh>

    <mesh position={[-5, 1,Math.PI + 5]} rotation={[0,0,0]} >
      <planeGeometry args={[5,2]} />
      <meshStandardMaterial map={woodTexture} side={2}  />
    </mesh>

    <YouTubeLogo />
    <YoutubeController />
    <mesh position={[-5,2,Math.PI+2.5]} rotation={[Math.PI/2,0,0]} >
      <planeGeometry args={[5,5]} />
      <meshStandardMaterial map={woodTexture} side={2} />
    </mesh>
    <NeonText />
    </>
  );
};

export default Club;
