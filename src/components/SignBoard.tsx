import { Text, useTexture } from "@react-three/drei";
import { woodenBoardTexture } from "../assets/textures";

const SignBoard = () => {
      const [colorMap] = useTexture([
        woodenBoardTexture,
      ]);
  return (
  <>
      {/* Pole */}
      <mesh position={[0, 0.1, -8]}>
        <boxGeometry args={[0.1, 1, 0.2]} />
        <meshStandardMaterial/>
      </mesh>
      <group position={[0, 0.5, -7.9]}>
        <mesh >
        <boxGeometry args={[1.2, 0.5, 0.2]} />
        <meshStandardMaterial map={colorMap} />
        </mesh>
        <Text 
        fontSize={0.1}
        position={[0,0,0.2]}
        color={"#C19A6B"}
        anchorY={"middle"}
        font="/fonts/Rockybilly.ttf"
         >
        {"Welcome"}
         </Text>

      </group>
      </>
  );
};

export default SignBoard;
