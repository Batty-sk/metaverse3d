import { useEffect, useMemo } from 'react';
import { Vector3 } from 'three';
import { useTexture, useGLTF } from '@react-three/drei';
import { chair } from '../../assets/textures';

type ChairProps = { position: Vector3 ,rotation:[number,number,number]};

const Chair = ({ position,rotation }: ChairProps) => {
  const [chairTexture] = useTexture([chair]);
  const { scene } = useGLTF('/models/chair.glb');

  const chairClone = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    chairClone.traverse((child: any) => {
      if (child.isMesh) {
        child.material.map = chairTexture;
        child.material.needsUpdate = true;
      }
    });
  }, [chairClone, chairTexture]);
  console.log("poistion: ",position)

  return <primitive object={chairClone} position={position} rotation={rotation} />;
};

export default Chair;
