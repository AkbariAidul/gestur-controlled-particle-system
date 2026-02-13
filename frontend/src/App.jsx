import { useState } from 'react'
import ParticleSystem from './components/ParticleSystem'
import WebcamCapture from './components/WebcamCapture'
import { useHandGesture } from './hooks/useHandGesture'

function App() {
  const [videoElement, setVideoElement] = useState(null)
  const [showDebug, setShowDebug] = useState(false)
  const { gesture, isReady, debugInfo } = useHandGesture(videoElement)

  const handleVideoReady = (video) => {
    setVideoElement(video)
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Particle System */}
      <ParticleSystem gesture={gesture} />
      
      {/* Webcam Capture */}
      <WebcamCapture onVideoReady={handleVideoReady} />
      
      {/* Status Overlay */}
      <div className="absolute top-4 left-4 z-10 text-white">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isReady ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-sm">{isReady ? 'Ready' : 'Initializing...'}</span>
          </div>
          <div className="text-sm">
            Gesture: <span className="font-bold text-pink-400">{gesture}</span>
          </div>
          
          {/* Debug Toggle */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs text-gray-400 hover:text-white"
          >
            {showDebug ? 'Hide' : 'Show'} Debug
          </button>
          
          {/* Debug Info */}
          {showDebug && debugInfo && (
            <div className="text-xs space-y-1 mt-2 border-t border-gray-700 pt-2">
              <div>Fingers:</div>
              <div className="pl-2">
                <div>👍 Thumb: {debugInfo.fingers.thumb ? '✓' : '✗'}</div>
                <div>☝️ Index: {debugInfo.fingers.index ? '✓' : '✗'}</div>
                <div>🖕 Middle: {debugInfo.fingers.middle ? '✓' : '✗'}</div>
                <div>💍 Ring: {debugInfo.fingers.ring ? '✓' : '✗'}</div>
                <div>🤙 Pinky: {debugInfo.fingers.pinky ? '✓' : '✗'}</div>
                <div className="mt-1">Count: {debugInfo.fingers.count}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 z-10 text-white">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 max-w-xs">
          <h3 className="font-bold mb-2 text-pink-400">Gestures:</h3>
          <ul className="text-xs space-y-1">
            <li>✌️ Peace Sign → "I LOVE U"</li>
            <li>🤟 Love Sign → Heart Shape</li>
            <li>🤙 L Sign → "Lidiya LOVE ❤️ Aidul"</li>
            <li>✋ Open Palm → Galaxy</li>
            <li>✊ Fist → Explode</li>
          </ul>
        </div>
      </div>

      {/* Branding */}
      <div className="absolute bottom-4 left-4 z-10 text-white/50 text-xs">
        <p>💝 Made with love for Lidiya</p>
      </div>
    </div>
  )
}

export default App
