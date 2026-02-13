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
              if (gestureHistoryRef.current.length > 2) {
                gestureHistoryRef.current.shift()
              }

              // Get most common gesture (require 2 out of 2 for faster response)
              const gestureCounts = {}
              gestureHistoryRef.current.forEach(g => {
                gestureCounts[g] = (gestureCounts[g] || 0) + 1
              })

              const mostCommon = Object.entries(gestureCounts).reduce((a, b) => 
                b[1] > a[1] ? b : a
              )

              // Update if we have at least 2 consistent readings OR if it's a clear gesture
              if ((mostCommon[1] >= 2 || mostCommon[0] !== 'none') && mostCommon[0] !== lastGestureRef.current) {
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
              if (gestureHistoryRef.current.length > 2) {
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

  // Log for debugging
  if (fingerCount > 0 && fingerCount < 5) {
    console.log('Fingers:', { thumb, index, middle, ring, pinky, count: fingerCount })
  }

  // Fist: All fingers down (check first for priority)
  if (fingerCount === 0) {
    return 'fist'
  }

  // Open Palm: 4 or 5 fingers up
  if (fingerCount >= 4) {
    return 'open_palm'
  }

  // Peace Sign: ONLY Index and Middle up (2 fingers)
  // More lenient - just check if index and middle are up
  if (index && middle && !ring && !pinky) {
    // Check finger distance for V shape
    const indexTip = landmarks[8]
    const middleTip = landmarks[12]
    const distance = Math.sqrt(
      Math.pow(indexTip.x - middleTip.x, 2) + 
      Math.pow(indexTip.y - middleTip.y, 2)
    )
    
    console.log('Peace check - distance:', distance, 'thumb:', thumb)
    
    // More lenient distance check
    if (distance < 0.2) {
      return 'peace'
    }
  }

  // Love Sign: Thumb, Index, and Pinky up (3 fingers)
  // More lenient - allow if these 3 are clearly up
  if (thumb && index && pinky && !middle && !ring) {
    console.log('Love sign detected!')
    return 'love'
  }

  // Alternative love sign check - sometimes middle might be slightly detected
  if (fingerCount === 3 && thumb && index && pinky) {
    console.log('Love sign detected (alternative)!')
    return 'love'
  }

  // L Sign: Thumb and Index up, forming L shape (2 fingers)
  if (thumb && index && !middle && !ring && !pinky) {
    // Check angle between thumb and index
    const angle = calculateAngle(landmarks[4], landmarks[0], landmarks[8])
    
    // Check orientation
    const thumbTip = landmarks[4]
    const thumbBase = landmarks[2]
    const indexTip = landmarks[8]
    const indexBase = landmarks[5]
    
    // Thumb should be more horizontal
    const thumbHorizontal = Math.abs(thumbTip.x - thumbBase.x) > Math.abs(thumbTip.y - thumbBase.y) * 0.7
    
    // Index should be more vertical
    const indexVertical = Math.abs(indexTip.y - indexBase.y) > Math.abs(indexTip.x - indexBase.x) * 0.7
    
    console.log('L Sign check - angle:', angle, 'thumbH:', thumbHorizontal, 'indexV:', indexVertical)
    
    // More lenient angle and orientation check
    if (angle > 50 && angle < 130) {
      return 'l_sign'
    }
  }

  return 'none'
}

// Determine which fingers are extended - MORE LENIENT
function getFingersUp(landmarks) {
  const fingers = []

  // Thumb: More lenient threshold
  const thumbIsUp = landmarks[4].x < landmarks[3].x - 0.03
  fingers.push(thumbIsUp ? 1 : 0)

  // Other fingers: More lenient threshold
  const fingerTips = [8, 12, 16, 20]
  const fingerPips = [6, 10, 14, 18]

  for (let i = 0; i < fingerTips.length; i++) {
    const tipY = landmarks[fingerTips[i]].y
    const pipY = landmarks[fingerPips[i]].y
    
    // More lenient - finger is up if tip is above PIP
    const isUp = tipY < pipY - 0.015
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
