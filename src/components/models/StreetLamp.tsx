import { OrbitControls, useGLTF } from 'react-three/drei';
function Model() {
    // Load the GLB file using the useGLTF hook
    const gltf = useGLTF('/models/your-model.glb'); // Ensure the path is correct
  
    return <primitive object={gltf.scene} scale={0.5} />;
  }


