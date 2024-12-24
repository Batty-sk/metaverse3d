import React from "react";

const YRoad = () => {
  return (
    <>
      <mesh position={[0, -0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 20]} />
        <meshStandardMaterial color={"gray"} side={2} />
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
