import { roadBaseTexture } from "../assets/textures";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

const YRoad = () => {
    const [colorMap] = useLoader(TextureLoader, [
      roadBaseTexture
    ]);
  return (
    <>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 20]} />
        <meshStandardMaterial map={colorMap} color={"gray"} side={2} />
      </mesh>



    </>
  );
};

export default YRoad;
