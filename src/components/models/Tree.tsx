import {useGLTF } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
import React from 'react'

type treeProps={
 position:Vector3,
}

const Tree = (args:treeProps) => 
    {
 const gltf = useGLTF('/models/tree.glb'); 

  return (
          <primitive object={gltf.scene} scale={[0.1, 0.1, 0.1]} position={args.position} color={"green"} />

  )
}

export default Tree
