import cv2
import numpy as np
import base64

class GestureDetector:
    """Gesture detector using OpenCV color detection"""
    
    def __init__(self):
        print("Using OpenCV-based gesture detector")
        self.prev_gesture = "none"
        self.gesture_count = {"none": 0}
        self.stability_threshold = 3
    
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
        """Detect hand gesture using simple computer vision"""
        try:
            img = self.decode_image(base64_image)
            if img is None:
                return "none"
            
            # Convert to HSV for skin detection
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            
            # Skin color range (adjust for different lighting)
            lower_skin = np.array([0, 20, 70], dtype=np.uint8)
            upper_skin = np.array([20, 255, 255], dtype=np.uint8)
            
            # Create mask for skin color
            mask = cv2.inRange(hsv, lower_skin, upper_skin)
            
            # Apply morphological operations
            kernel = np.ones((5, 5), np.uint8)
            mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
            
            # Find contours
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            if not contours:
                return "none"
            
            # Get largest contour (hand)
            hand_contour = max(contours, key=cv2.contourArea)
            area = cv2.contourArea(hand_contour)
            
            # Ignore small areas
            if area < 5000:
                return "none"
            
            # Get convex hull and defects
            hull = cv2.convexHull(hand_contour, returnPoints=False)
            
            if len(hull) > 3:
                defects = cv2.convexityDefects(hand_contour, hull)
                
                if defects is not None:
                    # Count fingers based on defects
                    finger_count = 0
                    for i in range(defects.shape[0]):
                        s, e, f, d = defects[i, 0]
                        start = tuple(hand_contour[s][0])
                        end = tuple(hand_contour[e][0])
                        far = tuple(hand_contour[f][0])
                        
                        # Calculate angle
                        a = np.linalg.norm(np.array(start) - np.array(far))
                        b = np.linalg.norm(np.array(end) - np.array(far))
                        c = np.linalg.norm(np.array(start) - np.array(end))
                        
                        angle = np.arccos((a**2 + b**2 - c**2) / (2 * a * b))
                        
                        # If angle is less than 90 degrees, count as finger
                        if angle <= np.pi / 2:
                            finger_count += 1
                    
                    # Classify gesture based on finger count
                    gesture = self._classify_by_fingers(finger_count, area)
                    return gesture
            
            return "none"
            
        except Exception as e:
            print(f"Error in detect_gesture: {e}")
            return "none"
    
    def _classify_by_fingers(self, finger_count, area):
        """Classify gesture based on finger count and hand area"""
        
        # Fist: 0 fingers
        if finger_count == 0:
            return "fist"
        
        # Peace or Love sign: 1-2 fingers
        elif finger_count == 1:
            return "peace"
        
        # L sign or Love sign: 2 fingers
        elif finger_count == 2:
            if area > 15000:
                return "love"
            else:
                return "l_sign"
        
        # Open palm: 4+ fingers
        elif finger_count >= 4:
            return "open_palm"
        
        return "none"
    
    def close(self):
        """Release resources"""
        pass
