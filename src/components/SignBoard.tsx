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
        fontSize={0.2}
        position={[0,0.05,0.2]}
        color={"black"}
        anchorY={"middle"}
         >
        {"see behind"}
         </Text>

      </group>
      </>
  );
};

export default SignBoard;
