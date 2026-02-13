import { useState, useEffect } from 'react'
import ParticleSystem from './components/ParticleSystem'
import WebcamCapture from './components/WebcamCapture'

function App() {
  const [gesture, setGesture] = useState('none')
  const [ws, setWs] = useState(null)
  const [connected, setConnected] = useState(false)

  // WebSocket URL - update with your Render backend URL
  const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws'

  useEffect(() => {
    const websocket = new WebSocket(WS_URL)

    websocket.onopen = () => {
      console.log('Connected to backend')
      setConnected(true)
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'gesture') {
        setGesture(data.gesture)
      }
    }

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnected(false)
    }

    websocket.onclose = () => {
      console.log('Disconnected from backend')
      setConnected(false)
    }

    setWs(websocket)

    return () => {
      websocket.close()
    }
  }, [])

  const sendFrame = (base64Image) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'frame',
        image: base64Image
      }))
    }
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Particle System */}
      <ParticleSystem gesture={gesture} />
      
      {/* Webcam Capture */}
      <WebcamCapture onFrame={sendFrame} />
      
      {/* Status Overlay */}
      <div className="absolute top-4 left-4 z-10 text-white">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="text-sm">
            Gesture: <span className="font-bold text-pink-400">{gesture}</span>
          </div>
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
    </div>
  )
}

export default App
