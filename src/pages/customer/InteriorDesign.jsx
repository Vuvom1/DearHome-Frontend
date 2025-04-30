import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Typography, Card, Row, Col, Button, Space, Divider, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ThreeDScene from '../../components/ThreeDScene';
import * as THREE from 'three';
import Controls from '../../components/Controls';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Room from '../../components/virtual-room/Room';
import { OBJLoader } from 'three/examples/jsm/Addons.js';
import ObjToPremitive from '../../components/virtual-room/ObjToPremitive';  
const { Title, Paragraph } = Typography;

const InteriorDesign = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  
  useEffect(() => {
    // Create camera if it doesn't exist
    if (!cameraRef.current) {
      cameraRef.current = new THREE.PerspectiveCamera(
        75, // field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        0.1, // near plane
        1000 // far plane
      );
      cameraRef.current.position.z = 5;
    }
  }, []);  
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      models.forEach(model => {
        if (model.url.startsWith('blob:')) {
          URL.revokeObjectURL(model.url);
        }
      });
    };
  }, [models]);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Interior Design Visualization</Title>
      
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div style={{ width: '100%', height: '100%' }}>
            <ThreeDScene>
              <Room 
                material={{
                  wallMaterial: "#e0e0e0",
                  floorMaterial: "#8B4513"
                }}
                roomDimensions={{
                  width: 8,
                  height: 3,
                  depth: 8
                }}
              />
              <ObjToPremitive url="/public/models/tmpzcupjnp4.obj" />
            </ThreeDScene>
          </div> 
          <Controls />
        </Col>
      </Row>
    </div>
  );
};

export default InteriorDesign;
