
import { Text } from '@react-three/drei';

const NeonText = () => {
  return (
    <>
      <Text
        position={[-5, 1, Math.PI + 5+0.2]} 
        fontSize={0.3} 
        color="#1a4465"
        font='/fonts/Rockybilly.ttf'
      >
        Better Player
        <meshStandardMaterial emissive="yellow" emissiveIntensity={10} />
      </Text>

      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, 10]} intensity={0.5} />
    </>
  );
};

export default NeonText