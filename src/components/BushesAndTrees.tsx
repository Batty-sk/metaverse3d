// components/BushesAndTrees.tsx

import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Cloud, OrbitControls, Sparkles } from '@react-three/drei'

/** 🌿 Bush Component */
const Bush: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="green" />
    </mesh>
  )
}

/** 🌳 Tree Component */
const Tree: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
        <meshStandardMaterial color="sienna" />
      </mesh>

      {/* Leaves */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  )
}

const Campfire = () => (
    <group>
      <mesh position={[3.5,0,1]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="orange" emissive="orange" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[3.5,0.3,1]} color="orange" intensity={10} distance={2} decay={2} />
    </group>
  )


/** 🌲 Scene with Bushes and Trees */
const BushesAndTrees: React.FC = () => {
  return (
    <>
    <Campfire  />
    <Sparkles count={100} size={2} speed={0.5} scale={[10, 10, 10]} />

      {/* Trees */}
      <Tree position={[-5-2, 0,-12.5]} />
      <Tree position={[-5, 0,-12.5]} />
      <Tree position={[-3, 0,-12.5]} />



      {/* Bushes */}
      <Bush position={[-5-2, 0,-11.5]} />
      <Bush position={[-5, 0,-11.5]} />
      <Bush position={[-3, 0,-11.5]} />

      </>
  )
}

export default BushesAndTrees
