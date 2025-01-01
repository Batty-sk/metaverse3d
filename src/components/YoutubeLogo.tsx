import React from "react";
import { MeshProps } from "@react-three/fiber";
import {  Shape } from "three";

const RedRectangle: React.FC<MeshProps> = (props) => {
  return (
    <mesh {...props} rotation={[0,Math.PI/2,0]}>
      <boxGeometry args={[2, 1, 0.1]}  />
      <meshStandardMaterial color="#FF0000" />
    </mesh>
  );
};

const WhiteTriangle: React.FC<MeshProps> = (props) => {
  const shape = new Shape();
  shape.moveTo(0, 0.5);
  shape.lineTo(-0.3, -0.3);
  shape.lineTo(0.3, -0.3);
  shape.lineTo(0, 0.5);

  return (
    <mesh {...props} rotation={[0,Math.PI/2,-Math.PI/2]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color="" emissive={"white"} emissiveIntensity={10} />
    </mesh>
  );
};

const YouTubeLogo: React.FC = () => {
  return (
    <group >
      <RedRectangle position={[-5,2.6,Math.PI+2.5]} />
      <WhiteTriangle position={[-4.9,2.6,Math.PI+2.5]} />
    </group>
  );
};

export default YouTubeLogo;
