import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { CarColor } from '../../backend';
import { getCarModelProfile } from './carModelProfiles';

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
  const profile = useMemo(() => getCarModelProfile(modelName), [modelName]);

  // Animate car rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.5, 0]}>
      {/* Main body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[profile.bodyWidth, profile.bodyHeight, profile.bodyLength]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Cabin/roof */}
      <mesh 
        position={[0, 0.6 + profile.bodyHeight * 0.5 + profile.cabinHeight * 0.5, profile.cabinOffset]} 
        castShadow
      >
        <boxGeometry args={[profile.cabinWidth, profile.cabinHeight, profile.cabinLength]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Windshield (dark glass) */}
      <mesh 
        position={[0, 0.6 + profile.bodyHeight * 0.5 + profile.cabinHeight * 0.3, profile.cabinOffset + profile.cabinLength * 0.35]} 
        castShadow
      >
        <boxGeometry args={[profile.cabinWidth * 0.95, profile.cabinHeight * 0.6, profile.cabinLength * 0.3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} transparent opacity={0.3} />
      </mesh>

      {/* Front nose/splitter */}
      <mesh position={[0, 0.3, profile.bodyLength / 2 + profile.frontNoseLength / 2]} castShadow>
        <boxGeometry args={[profile.frontSpoilerWidth, profile.frontSpoilerHeight, profile.frontNoseLength]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rear deck */}
      <mesh 
        position={[0, 0.6 + profile.bodyHeight * 0.5 + profile.rearDeckHeight / 2, -profile.bodyLength / 2 + 0.3]} 
        castShadow
      >
        <boxGeometry args={[profile.bodyWidth * 0.9, profile.rearDeckHeight, profile.bodyLength * 0.25]} />
        <meshStandardMaterial color={color} metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Rear spoiler */}
      <mesh 
        position={[0, 0.6 + profile.bodyHeight + profile.rearSpoilerHeight / 2, -profile.bodyLength / 2 - 0.1]} 
        castShadow
      >
        <boxGeometry args={[profile.rearSpoilerWidth, profile.rearSpoilerHeight, profile.rearSpoilerThickness]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Side intakes (if applicable) */}
      {profile.sideIntakes && (
        <>
          <mesh position={[-profile.bodyWidth / 2 - 0.05, 0.6 + profile.bodyHeight * 0.3, -0.5]} castShadow>
            <boxGeometry args={[0.15, profile.sideIntakeSize, profile.sideIntakeSize]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.8} />
          </mesh>
          <mesh position={[profile.bodyWidth / 2 + 0.05, 0.6 + profile.bodyHeight * 0.3, -0.5]} castShadow>
            <boxGeometry args={[0.15, profile.sideIntakeSize, profile.sideIntakeSize]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.5} roughness={0.8} />
          </mesh>
        </>
      )}

      {/* Wheels */}
      {[
        [-profile.trackWidth / 2, 0, profile.wheelbaseLength / 2],
        [profile.trackWidth / 2, 0, profile.wheelbaseLength / 2],
        [-profile.trackWidth / 2, 0, -profile.wheelbaseLength / 2],
        [profile.trackWidth / 2, 0, -profile.wheelbaseLength / 2],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[profile.wheelRadius, profile.wheelRadius, profile.wheelWidth, 32]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
            <cylinderGeometry args={[profile.wheelRadius * 0.6, profile.wheelRadius * 0.6, profile.wheelWidth + 0.02, 32]} />
            <meshStandardMaterial color="#404040" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      <mesh position={[-profile.bodyWidth / 3, 0.8, profile.bodyLength / 2 + 0.01]}>
        <boxGeometry args={[0.3, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[profile.bodyWidth / 3, 0.8, profile.bodyLength / 2 + 0.01]}>
        <boxGeometry args={[0.3, 0.2, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-profile.bodyWidth / 3, 0.8, -profile.bodyLength / 2 - 0.01]}>
        <boxGeometry args={[0.3, 0.15, 0.1]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[profile.bodyWidth / 3, 0.8, -profile.bodyLength / 2 - 0.01]}>
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
