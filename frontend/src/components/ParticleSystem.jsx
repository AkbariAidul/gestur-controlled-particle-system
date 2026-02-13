import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'

function Particles({ gesture }) {
  const particlesRef = useRef()
  const particleCount = 5000
  
  // Create particle positions
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      
      colors[i * 3] = Math.random()
      colors[i * 3 + 1] = Math.random() * 0.5 + 0.5
      colors[i * 3 + 2] = 1
    }
    
    return { positions, colors }
  }, [])

  // Target positions based on gesture
  const targetPositions = useMemo(() => {
    const targets = new Float32Array(particleCount * 3)
    
    switch (gesture) {
      case 'peace':
        // Form "I LOVE U" text shape
        return createTextShape('I LOVE U', particleCount)
      
      case 'love':
        // Form heart shape
        return createHeartShape(particleCount)
      
      case 'l_sign':
        // Form "Lidiya LOVE ❤️ Aidul" text
        return createTextShape('Lidiya ❤️ Aidul', particleCount)
      
      case 'open_palm':
        // Galaxy spread
        return createGalaxyShape(particleCount)
      
      case 'fist':
        // Explode outward
        return createExplosionShape(particleCount)
      
      default:
        // Default sphere
        return createSphereShape(particleCount)
    }
  }, [gesture])

  useFrame((state) => {
    if (!particlesRef.current) return
    
    const positions = particlesRef.current.geometry.attributes.position.array
    const time = state.clock.elapsedTime
    
    // Animate particles toward target
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Lerp toward target
      positions[i3] += (targetPositions[i3] - positions[i3]) * 0.05
      positions[i3 + 1] += (targetPositions[i3 + 1] - positions[i3 + 1]) * 0.05
      positions[i3 + 2] += (targetPositions[i3 + 2] - positions[i3 + 2]) * 0.05
      
      // Add subtle floating animation
      positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.01
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
    particlesRef.current.rotation.y = time * 0.1
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Helper functions to create shapes
function createTextShape(text, count) {
  const positions = new Float32Array(count * 3)
  
  // Create text-like pattern using letter positions
  const letters = text.split('')
  const letterWidth = 1.5
  const totalWidth = letters.length * letterWidth
  const startX = -totalWidth / 2
  
  for (let i = 0; i < count; i++) {
    const letterIndex = Math.floor((i / count) * letters.length)
    const localProgress = ((i / count) * letters.length) % 1
    
    // Position for this letter
    const letterX = startX + letterIndex * letterWidth
    
    // Create letter shape (simplified block letters)
    const x = letterX + (Math.random() - 0.5) * letterWidth * 0.8
    const y = (Math.random() - 0.5) * 2
    const z = (Math.random() - 0.5) * 0.5
    
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }
  
  return positions
}

function createHeartShape(count) {
  const positions = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    
    positions[i * 3] = x * 0.15 + (Math.random() - 0.5) * 0.3
    positions[i * 3 + 1] = y * 0.15 + (Math.random() - 0.5) * 0.3
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5
  }
  
  return positions
}

function createGalaxyShape(count) {
  const positions = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    const radius = Math.random() * 8
    const angle = (i / count) * Math.PI * 2 * 5
    const height = (Math.random() - 0.5) * 2
    
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = height
    positions[i * 3 + 2] = Math.sin(angle) * radius
  }
  
  return positions
}

function createExplosionShape(count) {
  const positions = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = Math.random() * 15
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
  }
  
  return positions
}

function createSphereShape(count) {
  const positions = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const radius = 3 + Math.random() * 0.5
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)
  }
  
  return positions
}

function ParticleSystem({ gesture }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 75 }}
      style={{ background: 'linear-gradient(to bottom, #000000, #1a0033)' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Particles gesture={gesture} />
    </Canvas>
  )
}

export default ParticleSystem
