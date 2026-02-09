import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { CarColor } from '../../backend';

const COLOR_MAP: Record<CarColor, string> = {
  [CarColor.blue]: '#3b82f6',
  [CarColor.black]: '#000000',
  [CarColor.red]: '#ef4444',
  [CarColor.yellow]: '#eab308',
  [CarColor.white]: '#ffffff',
};

interface CarModelProps {
  color: string;
  modelName: string;
}

function CarModel({ color, modelName }: CarModelProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Animate car rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  // Create a stylized supercar shape
  const carGeometry = useMemo(() => {
    const isBugatti = modelName.includes('Bugatti');
    const isUrus = modelName.includes('Urus');
    
    return {
      // Main body dimensions based on car type
      bodyWidth: isBugatti ? 2.2 : isUrus ? 2.4 : 2.0,
      bodyLength: isBugatti ? 5.0 : isUrus ? 5.2 : 4.8,
      bodyHeight: isUrus ? 1.8 : 1.2,
    };
  }, [modelName]);

  return (
    <group ref={meshRef} position={[0, -0.5, 0]}>
      {/* Main body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[carGeometry.bodyWidth, carGeometry.bodyHeight, carGeometry.bodyLength]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cabin/roof */}
      <mesh position={[0, carGeometry.bodyHeight * 0.8, -0.3]} castShadow>
        <boxGeometry args={[carGeometry.bodyWidth * 0.8, carGeometry.bodyHeight * 0.6, carGeometry.bodyLength * 0.5]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Front spoiler */}
      <mesh position={[0, 0.2, carGeometry.bodyLength / 2 + 0.2]} castShadow>
        <boxGeometry args={[carGeometry.bodyWidth * 0.9, 0.2, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rear spoiler */}
      <mesh position={[0, carGeometry.bodyHeight + 0.3, -carGeometry.bodyLength / 2 - 0.1]} castShadow>
        <boxGeometry args={[carGeometry.bodyWidth * 0.8, 0.15, 0.6]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wheels */}
      {[
        [-carGeometry.bodyWidth / 2 - 0.2, 0, carGeometry.bodyLength / 2 - 0.8],
        [carGeometry.bodyWidth / 2 + 0.2, 0, carGeometry.bodyLength / 2 - 0.8],
        [-carGeometry.bodyWidth / 2 - 0.2, 0, -carGeometry.bodyLength / 2 + 0.8],
        [carGeometry.bodyWidth / 2 + 0.2, 0, -carGeometry.bodyLength / 2 + 0.8],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.42, 32]} />
            <meshStandardMaterial color="#404040" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      <mesh position={[-carGeometry.bodyWidth / 3, 0.8, carGeometry.bodyLength / 2 + 0.01]}>
        <boxGeometry args={[0.3, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[carGeometry.bodyWidth / 3, 0.8, carGeometry.bodyLength / 2 + 0.01]}>
        <boxGeometry args={[0.3, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-carGeometry.bodyWidth / 3, 0.8, -carGeometry.bodyLength / 2 - 0.01]}>
        <boxGeometry args={[0.3, 0.15, 0.1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[carGeometry.bodyWidth / 3, 0.8, -carGeometry.bodyLength / 2 - 0.01]}>
        <boxGeometry args={[0.3, 0.15, 0.1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

interface CarViewer3DProps {
  modelName: string;
  color: CarColor;
}

export default function CarViewer3D({ modelName, color }: CarViewer3DProps) {
  const hexColor = COLOR_MAP[color] || COLOR_MAP[CarColor.blue];

  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 4, 8]} fov={50} />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={6}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-10, 5, -5]} intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.5} />

        {/* Car */}
        <CarModel color={hexColor} modelName={modelName} />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.8} />
        </mesh>

        {/* Grid */}
        <gridHelper args={[50, 50, '#333333', '#222222']} position={[0, -0.49, 0]} />
      </Canvas>
    </div>
  );
}
