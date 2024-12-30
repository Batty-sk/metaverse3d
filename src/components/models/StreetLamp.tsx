import {useGLTF } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
type streetLampProps = {
    position:Vector3,
    rotation:Vector3,
    positionLight:Vector3
}
//[0.5,3.6,0]
function StreetLamp(args:streetLampProps) {
    const gltf = useGLTF('/models/StreetLamp.glb'); 
  
    return<>
    <pointLight position={args.positionLight} color={"white"} intensity={15} />
    <primitive object={gltf.scene} scale={[0.2, 0.3, 0.1]} position={args.position} rotation={args.rotation} /></>;
  }

  export default StreetLamp

