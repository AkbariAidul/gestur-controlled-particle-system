import { useEffect, useRef, useState } from 'react'

function WebcamCapture({ onFrame }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let stream = null
    let intervalId = null

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
          
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
            setIsReady(true)
            
            // Send frames every 300ms (slower to reduce flicker)
            intervalId = setInterval(() => {
              captureFrame()
            }, 300)
          }
        }
      } catch (error) {
        console.error('Error accessing webcam:', error)
      }
    }

    const captureFrame = () => {
      if (videoRef.current && canvasRef.current && isReady) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          ctx.drawImage(video, 0, 0)

          const base64Image = canvas.toDataURL('image/jpeg', 0.7)
          onFrame(base64Image)
        }
      }
    }

    startWebcam()

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [onFrame, isReady])

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="relative w-48 h-36 rounded-lg overflow-hidden border-2 border-pink-500/50 shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform -scale-x-100"
        />
        <canvas ref={canvasRef} className="hidden" />
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-white text-xs">Loading...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default WebcamCapture
