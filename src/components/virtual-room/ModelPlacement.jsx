import React, { useRef, useState, useEffect } from 'react';
import { TransformControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import ModelLoader from './ModelLoader';

const ModelPlacement = ({ modelUrl, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const modelRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [mode, setMode] = useState('translate'); // 'translate', 'rotate', 'scale'
  
  const handleModelLoad = ({ scene }) => {
    if (scene) {
      // Setup shadows and optimize model
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      setIsLoaded(true);
    }
  };
  
  const handleModelError = (error) => {
    console.error("Error loading model:", error);
  };

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (modelUrl.startsWith('blob:')) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  return (
    <group ref={modelRef} position={position} rotation={rotation}>
      <ModelLoader 
        url={modelUrl} 
        onLoad={handleModelLoad} 
        onError={handleModelError} 
      />
      {isLoaded && (
        <>
          <TransformControls
            object={modelRef}
            mode={mode}
            onMouseDown={() => {
              document.body.style.cursor = 'grabbing';
            }}
            onMouseUp={() => {
              document.body.style.cursor = 'auto';
            }}
          />
          <group position={[0, 2, 0]}>
            <Text
              position={[-1, 0, 0]}
              fontSize={0.2}
              color="white"
              onClick={() => setMode('translate')}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'auto'}
            >
              Move
            </Text>
            <Text
              position={[0, 0, 0]}
              fontSize={0.2}
              color="white"
              onClick={() => setMode('rotate')}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'auto'}
            >
              Rotate
            </Text>
            <Text
              position={[1, 0, 0]}
              fontSize={0.2}
              color="white"
              onClick={() => setMode('scale')}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'auto'}
            >
              Scale
            </Text>
          </group>
        </>
      )}
    </group>
  );
};

export default ModelPlacement; 