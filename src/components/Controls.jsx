import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Controls = ({ camera, domElement, options = {} }) => {
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!camera || !domElement) return;

    // Create new OrbitControls
    const controls = new OrbitControls(camera, domElement);
    
    // Apply default settings
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 0.8;
    
    // Apply any custom options passed in props
    Object.keys(options).forEach(key => {
      if (controls[key] !== undefined) {
        controls[key] = options[key];
      }
    });

    // Store controls reference
    controlsRef.current = controls;

    // Animation loop is typically handled in the parent component
    // but we need to make sure controls.update() is called in that loop

    return () => {
      // Clean up
      controls.dispose();
    };
  }, [camera, domElement, options]);

  // Expose the controls reference to parent components if needed
  return null;
};

export default Controls;
