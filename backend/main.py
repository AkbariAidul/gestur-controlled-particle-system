from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json

# Try detectors in order: Advanced OpenCV -> MediaPipe -> Basic OpenCV -> Demo
detector = None
detector_type = "unknown"

# Try Advanced OpenCV first (best for Python 3.13)
try:
    from gesture_detector_advanced import GestureDetector
    detector = GestureDetector()
    detector_type = "Advanced OpenCV"
except Exception as e:
    print(f"⚠ Advanced OpenCV failed: {e}")
    
    # Try MediaPipe
    try:
        from gesture_detector import GestureDetector
        detector = GestureDetector()
        detector_type = "MediaPipe"
        print("✓ Using MediaPipe gesture detector")
    except Exception as e2:
        print(f"⚠ MediaPipe not available: {e2}")
        
        # Try basic OpenCV
        try:
            from gesture_detector_opencv import GestureDetector
            detector = GestureDetector()
            detector_type = "Basic OpenCV"
            print("✓ Using basic OpenCV gesture detector")
        except Exception as e3:
            print(f"⚠ Basic OpenCV failed: {e3}")
            
            # Fallback to demo
            from gesture_detector_simple import GestureDetector
            detector = GestureDetector()
            detector_type = "Demo Mode"
            print("✓ Using demo detector")

app = FastAPI(title="Gesture Particle System API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Gesture Particle System API", 
        "status": "running",
        "detector": detector_type
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "detector": detector_type}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")
    
    try:
        while True:
            # Receive base64 image from client
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
                if message.get("type") == "frame":
                    base64_image = message.get("image")
                    
                    # Detect gesture
                    gesture = detector.detect_gesture(base64_image)
                    
                    # Send result back to client
                    response = {
                        "type": "gesture",
                        "gesture": gesture
                    }
                    await websocket.send_json(response)
                    
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "message": "Invalid JSON"})
            except Exception as e:
                print(f"Error processing frame: {e}")
                await websocket.send_json({"type": "error", "message": str(e)})
                
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
