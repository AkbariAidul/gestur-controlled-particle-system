# 🎯 Complete Guide - Gesture Controlled Particle System

## 🚀 Quick Start

### Local Development
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:3000

### Deploy to Vercel (FREE!)
1. Go to https://vercel.com
2. Import GitHub repository
3. Set Root Directory: `frontend`
4. Deploy!

## 🖐️ Gestures

| Gesture | How to Do It | Effect |
|---------|--------------|--------|
| ✌️ Peace | Index + Middle up (V shape) | "I LOVE U" text |
| 🤟 Love | Thumb + Index + Pinky up | Heart shape ❤️ |
| 🤙 L Sign | Thumb horizontal + Index vertical | "Lidiya ❤️ Aidul" |
| ✋ Open Palm | All 5 fingers up | Galaxy spiral |
| ✊ Fist | All fingers closed | Explosion |

## 🔧 Debug Mode

Click "Show Debug" button to see:
- Which fingers are detected (✓ or ✗)
- Finger count
- Current gesture

**Use this to troubleshoot!**

## 💡 Tips for Best Results

### Lighting
- ✅ Good, even lighting
- ✅ Face a light source
- ❌ Avoid backlighting

### Distance
- ✅ 30-50cm from camera
- ❌ Too close: hand fills frame
- ❌ Too far: hand too small

### Hand Position
- ✅ Show full hand to camera
- ✅ Keep hand flat
- ✅ Clear background
- ❌ Don't hide fingers

### Gesture Tips
- ✅ Hold steady for 1-2 seconds
- ✅ Make gestures clear and exaggerated
- ✅ Keep other fingers fully closed
- ❌ Don't move too fast

## 🐛 Troubleshooting

### Peace Sign not working?
- Make sure index and middle are CLOSE together (V shape)
- Thumb must be DOWN
- Other fingers must be DOWN
- Check debug: Count should be 2

### L Sign not working?
- Thumb must be HORIZONTAL (sideways)
- Index must be VERTICAL (pointing up)
- Form a clear 90-degree L
- Check debug: Count should be 2

### Camera flickering?
- This is normal during gesture detection
- Processing happens every 150ms
- Reduces CPU usage while maintaining accuracy

### Gesture not detected?
1. Enable debug mode
2. Check which fingers are detected
3. Adjust lighting
4. Try different distance
5. Make gesture more exaggerated

## 🎨 Technical Details

### Architecture
- 100% Client-Side (no backend!)
- MediaPipe runs in browser via WASM
- Hand tracking at ~7 FPS (150ms interval)
- Gesture smoothing with 3-frame history

### Performance
- First load: Downloads MediaPipe WASM (~2-3MB)
- Subsequent loads: Cached by browser
- Optimized for smooth camera feed
- Low CPU usage

### Tech Stack
- React 18 + Vite
- Three.js + React Three Fiber
- MediaPipe Tasks Vision
- Tailwind CSS

## 📝 Deployment

### Vercel (Recommended - FREE)
1. Push to GitHub
2. Import to Vercel
3. Root Directory: `frontend`
4. Deploy!

**No credit card needed!**

### Environment
- No environment variables needed
- Everything runs client-side
- HTTPS automatically enabled by Vercel

## 🎁 Features

✅ Real-time hand tracking
✅ 5 gesture types
✅ 3D particle morphing
✅ Smooth animations
✅ Debug mode
✅ Mobile compatible
✅ 100% free to deploy

---

**Made with 💝 for Lidiya**

Repository: https://github.com/AkbariAidul/gestur-controlled-particle-system
