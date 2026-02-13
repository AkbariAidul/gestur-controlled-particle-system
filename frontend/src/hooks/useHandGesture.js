import { useState, useEffect, useRef } from 'react'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

export function useHandGesture(videoElement) {
  const [gesture, setGesture] = useState('none')
  const [isReady, setIsReady] = useState(false)
  const [debugInfo, setDebugInfo] = useState(null)
  const handLandmarkerRef = useRef(null)
  const lastGestureRef = useRef('none')
  const gestureHistoryRef = useRef([])

  // Initialize MediaPipe Hand Landmarker
  useEffect(() => {
    let animationFrameId = null

    const initializeHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm'
        )

        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 1,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5
        })

        handLandmarkerRef.current = handLandmarker
        setIsReady(true)
        console.log('✓ MediaPipe Hand Landmarker initialized')
      } catch (error) {
        console.error('Error initializing Hand Landmarker:', error)
      }
    }

    initializeHandLandmarker()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close()
      }
    }
  }, [])

  // Process video frames
  useEffect(() => {
    if (!isReady || !videoElement || !handLandmarkerRef.current) return

    let animationFrameId = null
    let lastVideoTime = -1
    let lastDetectionTime = 0
    const detectionInterval = 150 // Increase to 150ms (slower but smoother camera)

    const detectGesture = async () => {
      const now = performance.now()
      
      if (videoElement.readyState >= 2) {
        const currentTime = videoElement.currentTime

        // Only process if enough time has passed AND video time changed
        if (currentTime !== lastVideoTime && now - lastDetectionTime >= detectionInterval) {
          lastVideoTime = currentTime
          lastDetectionTime = now

          try {
            const results = handLandmarkerRef.current.detectForVideo(
              videoElement,
              now
            )

            if (results.landmarks && results.landmarks.length > 0) {
              const landmarks = results.landmarks[0]
              const fingers = getFingersUp(landmarks)
              const detectedGesture = classifyGesture(landmarks)
              
              // Smooth gesture detection with history
              gestureHistoryRef.current.push(detectedGesture)
              if (gestureHistoryRef.current.length > 3) {
                gestureHistoryRef.current.shift()
              }

              // Get most common gesture (require 2 out of 3)
              const gestureCounts = {}
              gestureHistoryRef.current.forEach(g => {
                gestureCounts[g] = (gestureCounts[g] || 0) + 1
              })

              const mostCommon = Object.entries(gestureCounts).reduce((a, b) => 
                b[1] > a[1] ? b : a
              )

              // Update if we have at least 2 consistent readings
              if (mostCommon[1] >= 2 && mostCommon[0] !== lastGestureRef.current) {
                lastGestureRef.current = mostCommon[0]
                setGesture(mostCommon[0])
                
                // Only update debug info when gesture changes (reduce re-renders)
                setDebugInfo({
                  fingers: {
                    thumb: fingers[0],
                    index: fingers[1],
                    middle: fingers[2],
                    ring: fingers[3],
                    pinky: fingers[4],
                    count: fingers.filter(f => f).length
                  },
                  gesture: mostCommon[0]
                })
              }
            } else {
              // No hand detected
              gestureHistoryRef.current.push('none')
              if (gestureHistoryRef.current.length > 3) {
                gestureHistoryRef.current.shift()
              }
              
              if (lastGestureRef.current !== 'none') {
                lastGestureRef.current = 'none'
                setGesture('none')
                setDebugInfo(null)
              }
            }
          } catch (error) {
            console.error('Error detecting gesture:', error)
          }
        }
      }

      animationFrameId = requestAnimationFrame(detectGesture)
    }

    detectGesture()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isReady, videoElement])

  return { gesture, isReady, debugInfo }
}

// Classify gesture based on hand landmarks
function classifyGesture(landmarks) {
  const fingers = getFingersUp(landmarks)
  const [thumb, index, middle, ring, pinky] = fingers
  
  // Count extended fingers
  const fingerCount = fingers.filter(f => f).length

  // Fist: All fingers down (check first for priority)
  if (fingerCount === 0) {
    return 'fist'
  }

  // Open Palm: 4 or 5 fingers up
  if (fingerCount >= 4) {
    return 'open_palm'
  }

  // Peace Sign: ONLY Index and Middle up (2 fingers)
  // Check more strictly - thumb must be clearly down
  if (fingerCount === 2 && index && middle && !ring && !pinky) {
    // Additional check: index and middle should be close together
    const indexTip = landmarks[8]
    const middleTip = landmarks[12]
    const distance = Math.sqrt(
      Math.pow(indexTip.x - middleTip.x, 2) + 
      Math.pow(indexTip.y - middleTip.y, 2)
    )
    
    // If fingers are reasonably close (V shape), it's peace sign
    if (distance < 0.15) {
      return 'peace'
    }
  }

  // Love Sign: Thumb, Index, and Pinky up (3 fingers)
  if (fingerCount === 3 && thumb && index && !middle && !ring && pinky) {
    return 'love'
  }

  // L Sign: Thumb and Index up, forming L shape (2 fingers)
  if (fingerCount === 2 && thumb && index && !middle && !ring && !pinky) {
    // Check angle between thumb and index
    const angle = calculateAngle(landmarks[4], landmarks[0], landmarks[8])
    
    // Also check if thumb is horizontal and index is vertical
    const thumbTip = landmarks[4]
    const thumbBase = landmarks[2]
    const indexTip = landmarks[8]
    const indexBase = landmarks[5]
    
    // Thumb should be more horizontal (x difference > y difference)
    const thumbHorizontal = Math.abs(thumbTip.x - thumbBase.x) > Math.abs(thumbTip.y - thumbBase.y)
    
    // Index should be more vertical (y difference > x difference)
    const indexVertical = Math.abs(indexTip.y - indexBase.y) > Math.abs(indexTip.x - indexBase.x)
    
    if (angle > 60 && angle < 120 && thumbHorizontal && indexVertical) {
      return 'l_sign'
    }
  }

  return 'none'
}

// Determine which fingers are extended
function getFingersUp(landmarks) {
  const fingers = []

  // Thumb: Check if tip is to the right of MCP joint (for right hand)
  // Use a more lenient threshold
  const thumbIsUp = landmarks[4].x < landmarks[3].x - 0.04
  fingers.push(thumbIsUp ? 1 : 0)

  // Other fingers: Compare tip with PIP joint
  const fingerTips = [8, 12, 16, 20]
  const fingerPips = [6, 10, 14, 18]

  for (let i = 0; i < fingerTips.length; i++) {
    const tipY = landmarks[fingerTips[i]].y
    const pipY = landmarks[fingerPips[i]].y
    
    // Finger is up if tip is significantly above PIP
    // Use more lenient threshold for better detection
    const isUp = tipY < pipY - 0.02
    fingers.push(isUp ? 1 : 0)
  }

  return fingers
}

// Calculate angle between three points
function calculateAngle(point1, point2, point3) {
  const a = [point1.x - point2.x, point1.y - point2.y]
  const b = [point3.x - point2.x, point3.y - point2.y]

  const dotProduct = a[0] * b[0] + a[1] * b[1]
  const magnitudeA = Math.sqrt(a[0] * a[0] + a[1] * a[1])
  const magnitudeB = Math.sqrt(b[0] * b[0] + b[1] * b[1])

  const cosineAngle = dotProduct / (magnitudeA * magnitudeB)
  const angle = Math.acos(Math.max(-1, Math.min(1, cosineAngle)))

  return (angle * 180) / Math.PI
}
