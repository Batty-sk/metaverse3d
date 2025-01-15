import {  Text } from "@react-three/drei";
import * as THREE from "three";

const createHollowStar = (radius: number, points: number): THREE.Shape => {
  const shape = new THREE.Shape();
  const step = Math.PI / points;

  for (let i = 0; i < 2 * points; i++) {
    const angle = i * step;
    const radiusFactor = i % 2 === 0 ? radius : radius / 2;
    const x = radiusFactor * Math.cos(angle);
    const y = radiusFactor * Math.sin(angle);
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }

  shape.closePath();
  return shape;
};

const GlowingStar = () => {
  const radius = 0.5; 
  const points = 5;

  const starGeometry = new THREE.ShapeGeometry(createHollowStar(radius, points));

  return (

    <group onClick={()=>{
        window.open("https://github.com/Batty-sk/metaverse3d/", "_blank");
    }}>
      <mesh geometry={starGeometry} position={[-5-2.5, 2, 0]} rotation={[0,Math.PI/2,0]}>
        <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={2} />
      </mesh>

      <Text position={[-5-2.5, 2, -2]}  rotation={[0,Math.PI/2,0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
      Star It on GitHub ⭐
            </Text>
      <Text position={[-5-2.5, 1.7, -2]}   rotation={[0,Math.PI/2,0]} fontSize={0.1} color="white" anchorX="center" anchorY="middle">
       Click here
      </Text>
    </group>
  );
};

export default GlowingStar