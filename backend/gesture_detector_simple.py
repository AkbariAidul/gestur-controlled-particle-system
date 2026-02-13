import cv2
import numpy as np
import base64

class GestureDetector:
    """Simple gesture detector without MediaPipe for testing"""
    
    def __init__(self):
        self.current_gesture = "none"
        self.gesture_cycle = ["none", "peace", "love", "l_sign", "open_palm", "fist"]
        self.cycle_index = 0
        self.frame_count = 0
        print("Using simple gesture detector (demo mode)")
    
    def decode_image(self, base64_string):
        """Decode base64 image string to OpenCV format"""
        try:
            if ',' in base64_string:
                img_data = base64.b64decode(base64_string.split(',')[1])
            else:
                img_data = base64.b64decode(base64_string)
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            return img
        except Exception as e:
            print(f"Error decoding image: {e}")
            return None
    
    def detect_gesture(self, base64_image):
        """Detect hand gesture - demo mode cycles through gestures"""
        try:
            img = self.decode_image(base64_image)
            if img is None:
                return "none"
            
            # Demo mode: cycle through gestures every 50 frames
            self.frame_count += 1
            if self.frame_count % 50 == 0:
                self.cycle_index = (self.cycle_index + 1) % len(self.gesture_cycle)
                self.current_gesture = self.gesture_cycle[self.cycle_index]
                print(f"Demo gesture: {self.current_gesture}")
            
            return self.current_gesture
            
        except Exception as e:
            print(f"Error in detect_gesture: {e}")
            return "none"
    
    def close(self):
        """Release resources"""
        pass
