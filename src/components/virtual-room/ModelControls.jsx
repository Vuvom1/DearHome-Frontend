import React from 'react';
import { TransformControls } from '@react-three/drei';

const ModelControls = ({ modelRef }) => {
  return (
    <TransformControls
      object={modelRef}
      mode="translate"
      showX
      showY
      showZ
    />
  );
};

export default ModelControls; 