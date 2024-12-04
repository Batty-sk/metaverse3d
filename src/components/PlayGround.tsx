import { Canvas, useThree } from "@react-three/fiber";
import CustomPerspectiveCamera from "./CustomPerspectiveCamera";
import Player from "./Player";
import React, { useEffect, useRef, useState } from "react";

type canvasSizeProp = {
  width: number;
  height: number;
};

const PlayGround = () => {
  const box = useRef<any>();
  const playerRef= useRef<any>()
const [canvassize, updateCanvasSize] = useState<canvasSizeProp>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleUpdateSize = () => {
      updateCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleUpdateSize);
    return () => window.removeEventListener("resize", handleUpdateSize);
  }, []);

  useEffect(() => {
    if (box.current) {
      console.log("use ref is initialziesdd fdsafda sfd");
      console.log("box current", box.current.rotation._x);
      console.log("box current", box.current.rotation);

      const animate = () => {
        console.log("rotating....");
        box.current.rotation.x += 0.01;

        window?.requestAnimationFrame(animate);
      };
      animate();
    }
  }, []);

  /* window.requestAnimationFrame */
  console.log("canvas size ", canvassize);


  // this playground would have lot of players in it..
  return (
    <Canvas
      className=""
      style={{ width: canvassize.width, height: `${canvassize.height}px` }}
    >
      <axesHelper />
      <gridHelper />
       <CustomPerspectiveCamera playerRef={playerRef} />
{/*       <ambientLight/>
 */}      <Player playerRef={playerRef}/>

        <mesh rotation={[-Math.PI / 2,0,0]} position={[0,-0.5,0]} >
            <planeGeometry args={[10,20]}/>
            <meshBasicMaterial color={'orange'} side={2}/>
        </mesh>
    </Canvas>
  );
};

export default PlayGround;
