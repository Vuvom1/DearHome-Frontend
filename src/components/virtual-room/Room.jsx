import React from 'react';
import { useThree } from '@react-three/fiber';
import { Box } from '@react-three/drei';

const Room = ({roomDimensions, material}) => {


  return (
    <group>
      {/* Floor */}
      <Box
        args={[roomDimensions.width, 0.1, roomDimensions.depth]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color={material.floorMaterial} />
      </Box>

      {/*Front Wall*/}
      <Box
        args={[roomDimensions.width, roomDimensions.height, 0.1]}
        position={[0, roomDimensions.height / 2, roomDimensions.depth / 2]}
      >
        <meshStandardMaterial color={material.wallMaterial} />
      </Box>

      {/* Back Wall */}
      <Box
        args={[roomDimensions.width, roomDimensions.height, 0.1]}
        position={[0, roomDimensions.height / 2, -roomDimensions.depth / 2]}
      >
        <meshStandardMaterial color={material.wallMaterial} />
      </Box>

      {/* Left Wall */}
      <Box
        args={[0.1, roomDimensions.height, roomDimensions.depth]}
        position={[-roomDimensions.width / 2, roomDimensions.height / 2, 0]}
      >
        <meshStandardMaterial color={material.wallMaterial} />
      </Box>

      {/* Right Wall */}
      <Box
        args={[0.1, roomDimensions.height, roomDimensions.depth]}
        position={[roomDimensions.width / 2, roomDimensions.height / 2, 0]}
      >
        <meshStandardMaterial color={material.wallMaterial} />
      </Box>
    </group>
  );
};

export default Room;
