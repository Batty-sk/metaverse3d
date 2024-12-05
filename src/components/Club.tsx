import { useRef } from "react";
const Club = () => {
    const clubRef = useRef<any>()
    console.log("club position in 3d space !",clubRef);
  return (
    <mesh position={[-3, 0.5, 5]} ref={clubRef}>
      <boxGeometry args={[2, 2, 3]} />
      <meshPhongMaterial />
    </mesh>
  );
};

export default Club;
