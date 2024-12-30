import {useGLTF } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
import React, { useEffect } from 'react'
import { Mesh, MeshStandardMaterial } from 'three';

type treeProps={
 position:Vector3,
}

const Tree = (args:treeProps) => 
    {
 const gltf = useGLTF('/models/tree.glb'); 
 useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.material && (mesh.material as MeshStandardMaterial).color) {
          (mesh.material as MeshStandardMaterial).color.set("yellow");
        }
      }
    });
  }, [gltf]);
  return (
          <primitive object={gltf.scene} scale={[0.1, 0.1, 0.1]} position={args.position} color={"green"} />

  )
}

export default Tree
