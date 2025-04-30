import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

const ThreeDScene = ({ children }) => {

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 75 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Suspense fallback={null}>
          {children}
       
          <Environment preset="apartment" />
        </Suspense>
        <OrbitControls enableDamping dampingFactor={0.1} />
      
      </Canvas>
    </div>
  );
};

export default ThreeDScene;
