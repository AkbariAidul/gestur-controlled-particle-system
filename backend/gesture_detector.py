import cv2
import numpy as np
import base64
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

class GestureDetector:
    def __init__(self):
        # Create hand landmarker with default model
        base_options = python.BaseOptions(model_asset_buffer=self._get_default_model())
        options = vision.HandLandmarkerOptions(
            base_options=base_options,
            num_hands=1,
            min_hand_detection_confidence=0.5,
            min_hand_presence_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.detector = vision.HandLandmarker.create_from_options(options)
    
    def _get_default_model(self):
        """Download and return default hand landmarker model"""
        import urllib.request
        import os
        
        model_path = "hand_landmarker.task"
        if not os.path.exists(model_path):
            print("Downloading hand landmarker model...")
            url = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
            urllib.request.urlretrieve(url, model_path)
            print("Model downloaded!")
        
        with open(model_path, 'rb') as f:
            return f.read()
    
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
        """Detect hand gesture from base64 encoded image"""
        try:
            img = self.decode_image(base64_image)
            if img is None:
                return "none"
            
            # Convert to RGB and create MediaPipe Image
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
            
            # Detect hands
            results = self.detector.detect(mp_image)
            
            if not results.hand_landmarks or len(results.hand_landmarks) == 0:
                return "none"
            
            landmarks = results.hand_landmarks[0]
            
            # Extract finger states
            fingers = self._get_fingers_up(landmarks)
            
            # Detect gestures
            gesture = self._classify_gesture(fingers, landmarks)
            return gesture
        except Exception as e:
            print(f"Error in detect_gesture: {e}")
            import traceback
            traceback.print_exc()
            return "none"
    
    def _get_fingers_up(self, landmarks):
        """Determine which fingers are extended"""
        fingers = []
        
        # Thumb (compare x-coordinate for horizontal orientation)
        if landmarks[4].x < landmarks[3].x:
            fingers.append(1)
        else:
            fingers.append(0)
        
        # Other fingers (compare y-coordinate)
        finger_tips = [8, 12, 16, 20]
        finger_pips = [6, 10, 14, 18]
        
        for tip, pip in zip(finger_tips, finger_pips):
            if landmarks[tip].y < landmarks[pip].y:
                fingers.append(1)
            else:
                fingers.append(0)
        
        return fingers
    
    def _classify_gesture(self, fingers, landmarks):
        """Classify gesture based on finger states"""
        thumb, index, middle, ring, pinky = fingers
        
        # Peace Sign: Index and Middle up, others down
        if not thumb and index and middle and not ring and not pinky:
            return "peace"
        
        # Love Sign: Thumb, Index, and Pinky up
        if thumb and index and not middle and not ring and pinky:
            return "love"
        
        # L Sign: Thumb and Index up, others down
        if thumb and index and not middle and not ring and not pinky:
            # Check if they form an L shape (perpendicular)
            thumb_tip = landmarks[4]
            index_tip = landmarks[8]
            wrist = landmarks[0]
            
            # Calculate angle between thumb and index
            angle = self._calculate_angle(thumb_tip, wrist, index_tip)
            if 70 < angle < 110:  # Roughly 90 degrees
                return "l_sign"
        
        # Open Palm: All fingers up
        if sum(fingers) >= 4:
            return "open_palm"
        
        # Fist: All fingers down
        if sum(fingers) <= 1:
            return "fist"
        
        return "none"
    
    def _calculate_angle(self, point1, point2, point3):
        """Calculate angle between three points"""
        a = np.array([point1.x, point1.y])
        b = np.array([point2.x, point2.y])
        c = np.array([point3.x, point3.y])
        
        ba = a - b
        bc = c - b
        
        cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
        angle = np.arccos(np.clip(cosine_angle, -1.0, 1.0))
        
        return np.degrees(angle)
    
    def close(self):
        """Release resources"""
        if hasattr(self, 'detector'):
            self.detector.close()
