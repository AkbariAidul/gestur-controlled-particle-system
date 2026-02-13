import cv2
import numpy as np
import base64
from collections import deque

class GestureDetector:
    """Advanced gesture detector using OpenCV for Python 3.13"""
    
    def __init__(self):
        print("✓ Using Advanced OpenCV gesture detector (Python 3.13 compatible)")
        
        # Gesture smoothing
        self.gesture_history = deque(maxlen=5)
        self.current_gesture = "none"
        
        # Hand detection parameters
        self.min_hand_area = 8000
        self.max_hand_area = 100000
        
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
        """Detect hand gesture using advanced computer vision"""
        try:
            img = self.decode_image(base64_image)
            if img is None:
                return self.current_gesture
            
            # Resize for faster processing
            img = cv2.resize(img, (320, 240))
            
            # Convert to YCrCb color space (better for skin detection)
            ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
            
            # Skin color range in YCrCb
            lower_skin = np.array([0, 133, 77], dtype=np.uint8)
            upper_skin = np.array([255, 173, 127], dtype=np.uint8)
            
            # Create mask
            mask = cv2.inRange(ycrcb, lower_skin, upper_skin)
            
            # Morphological operations to clean up
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
            mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
            
            # Apply Gaussian blur
            mask = cv2.GaussianBlur(mask, (5, 5), 0)
            
            # Find contours
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            if not contours:
                gesture = "none"
            else:
                # Get largest contour (hand)
                hand_contour = max(contours, key=cv2.contourArea)
                area = cv2.contourArea(hand_contour)
                
                # Check if area is valid
                if area < self.min_hand_area:
                    gesture = "none"
                else:
                    gesture = self._analyze_hand(hand_contour, area, img.shape)
            
            # Smooth gesture detection
            self.gesture_history.append(gesture)
            
            # Use most common gesture in history
            if len(self.gesture_history) >= 3:
                gesture_counts = {}
                for g in self.gesture_history:
                    gesture_counts[g] = gesture_counts.get(g, 0) + 1
                
                # Get most common gesture
                most_common = max(gesture_counts.items(), key=lambda x: x[1])
                if most_common[1] >= 2:  # At least 2 occurrences
                    self.current_gesture = most_common[0]
            
            return self.current_gesture
            
        except Exception as e:
            print(f"Error in detect_gesture: {e}")
            return self.current_gesture
    
    def _analyze_hand(self, contour, area, img_shape):
        """Analyze hand contour to determine gesture"""
        try:
            # Get convex hull
            hull = cv2.convexHull(contour, returnPoints=False)
            
            if len(hull) < 3:
                return "none"
            
            # Get convexity defects
            defects = cv2.convexityDefects(contour, hull)
            
            if defects is None:
                return "fist"
            
            # Count significant defects (fingers)
            finger_count = 0
            
            for i in range(defects.shape[0]):
                s, e, f, d = defects[i, 0]
                start = tuple(contour[s][0])
                end = tuple(contour[e][0])
                far = tuple(contour[f][0])
                
                # Calculate lengths
                a = np.sqrt((end[0] - start[0])**2 + (end[1] - start[1])**2)
                b = np.sqrt((far[0] - start[0])**2 + (far[1] - start[1])**2)
                c = np.sqrt((end[0] - far[0])**2 + (end[1] - far[1])**2)
                
                # Calculate angle using cosine rule
                if b + c > 0:
                    angle = np.arccos((b**2 + c**2 - a**2) / (2 * b * c))
                    
                    # Defect depth
                    depth = d / 256.0
                    
                    # Count as finger if angle is less than 90 degrees and depth is significant
                    if angle <= np.pi / 2 and depth > 20:
                        finger_count += 1
            
            # Get bounding rectangle
            x, y, w, h = cv2.boundingRect(contour)
            aspect_ratio = float(w) / h if h > 0 else 0
            
            # Classify gesture
            return self._classify_gesture(finger_count, area, aspect_ratio)
            
        except Exception as e:
            print(f"Error analyzing hand: {e}")
            return "none"
    
    def _classify_gesture(self, finger_count, area, aspect_ratio):
        """Classify gesture based on features"""
        
        # Fist: 0 fingers, compact shape
        if finger_count == 0:
            return "fist"
        
        # Peace sign: 1 finger (V shape)
        elif finger_count == 1:
            if aspect_ratio > 0.6 and aspect_ratio < 1.4:
                return "peace"
            return "none"
        
        # L sign or Love sign: 2 fingers
        elif finger_count == 2:
            # L sign tends to be more angular
            if aspect_ratio > 1.2:
                return "l_sign"
            # Love sign (thumb + index + pinky)
            elif area > 15000:
                return "love"
            return "l_sign"
        
        # Three fingers
        elif finger_count == 3:
            return "love"
        
        # Open palm: 4+ fingers
        elif finger_count >= 4:
            return "open_palm"
        
        return "none"
    
    def close(self):
        """Release resources"""
        pass
