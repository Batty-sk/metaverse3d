import { useRef } from "react";
const Club = () => {
    const clubRef = useRef<any>()
    console.log("club position in 3d space !",clubRef);
  return (
    <>
    <mesh position={[-5, 0.1, 5]} ref={clubRef}>
      <planeGeometry args={[4,5]}/>
      <meshStandardMaterial />
    </mesh>
    </>
  );
};

export default Club;
