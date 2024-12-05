const Club = () => {
  return (
    <mesh position={[-3, 0.5, 5]}>
      <boxGeometry args={[2, 2, 3]} />
      <meshPhongMaterial />
    </mesh>
  );
};

export default Club;
