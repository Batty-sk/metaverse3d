import { PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useRef } from 'react';
import { animated, useSpring } from '@react-spring/three';
type ColorSelectionProps ={
    currentChoice:number,
    setCurrentChoice:React.Dispatch<React.SetStateAction<number>>,
}

const ColorSelectionWindowj = ({currentChoice,setCurrentChoice}:ColorSelectionProps) => {
    const cameraRef = useRef<any>();
    const colors = ['brown', 'yellow', 'gray'];
    const positions = [
        [0, 0, 4], 
        [0, 0, 0],  
        [0, 0, 2],  
    ];

    const { position } = useSpring({
        position: positions[currentChoice],
        config: { mass: 1, tension: 170, friction: 26 },
    });

    const handleLookAt = (slideLeft: boolean) => {
        setCurrentChoice((prev) => {
            if (slideLeft) {
                return prev === 0 ? colors.length - 1 : prev - 1;
            } else {
                return prev === colors.length - 1 ? 0 : prev + 1;
            }
        });
    };

    return (
        <div className='min-h-52 md:w-3/6 w-full flex relative justify-between items-center'>
            <div 
                className='left-arrow  bg-black shadow-sm shadow-white text-white rounded-full  h-fit w-fit px-2 py-1 cursor-pointer'
                onClick={() => handleLookAt(true)}
            >
                {'<'}
            </div>
            <Canvas style={{ width: '100%', height: '100%' }}>
                <PerspectiveCamera position={[0, 0, 5]} makeDefault ref={cameraRef} />
                <ambientLight intensity={1} />
                <directionalLight intensity={2.5}/>
                <animated.group position={position.to((x, y, z) => [x, y, z])}>
                    {colors.map((color, index) => (
                        
                        <mesh key={color} position={positions[index] as [number, number, number]}>
                            <sphereGeometry args={[0.3, 15, 15]} />
                            <meshStandardMaterial color={color} metalness={0.1} />
                        </mesh>
                    ))}
                </animated.group>
            </Canvas>
            <div 
                className='right-arrow bg-black shadow-sm shadow-white text-white rounded-full h-fit w-fit px-2 py-1 cursor-pointer'
                onClick={() => handleLookAt(false)}
            >
                {'>'}
            </div>
        </div>
    );
};

export default ColorSelectionWindowj;
