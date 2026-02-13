import { useEffect, useRef, useState } from 'react'

function WebcamCapture({ onVideoReady }) {
  const videoRef = useRef(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let stream = null

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
            setIsReady(true)
            
            // Pass video element to parent
            if (onVideoReady) {
              onVideoReady(videoRef.current)
            }
          }
        }
      } catch (err) {
        console.error('Error accessing webcam:', err)
        setError('Cannot access webcam. Please allow camera permission.')
      }
    }

    startWebcam()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [onVideoReady])

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="relative w-48 h-36 rounded-lg overflow-hidden border-2 border-pink-500/50 shadow-lg bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
        {!isReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <span className="text-white text-xs">Loading camera...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/70 p-2">
            <span className="text-white text-xs text-center">{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default WebcamCapture
