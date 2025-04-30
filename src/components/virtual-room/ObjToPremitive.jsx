import React, { useState, useEffect, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import * as THREE from 'three';

const ObjToPremitive = ({ url }) => {
  const [model, setModel] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);

  // Wrap loader in a try-catch to handle errors
  const obj = useMemo(() => {
    try {
      return useLoader(OBJLoader, url);
    } catch (error) {
      console.error("Error loading OBJ model:", error);
      return null;
    }
  }, [url]);

  useEffect(() => {
    if (obj) {
      try {
        // Create a clone to avoid modifying the original
        const modelClone = obj.clone();
        
        // Calculate bounding box and center the model
        const box = new THREE.Box3().setFromObject(modelClone);
        const center = box.getCenter(new THREE.Vector3());
        modelClone.position.sub(center);
        
        // Calculate scale
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const newScale = 2 / maxDim;
        
        setModel(modelClone);
        setScale(newScale);
        setPosition([0, 1, 0]);
        setRotation([0, Math.PI / 4, 0]);
      } catch (error) {
        console.error("Error processing OBJ model:", error);
      }
    }
  }, [obj]);

  // Create custom material
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ff0000',
    metalness: 0.5,
    roughness: 0.5,
    envMapIntensity: 1,
  }), []);

  // Apply material to all meshes
  useEffect(() => {
    if (model) {
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = material;
        }
      });
    }
  }, [model, material]);

  if (!model) return null;

  return (
    <primitive 
      object={model}
      position={position}
      scale={[scale, scale, scale]}
      rotation={rotation}
    />
  );
};

export default ObjToPremitive;