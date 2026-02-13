# 💝 Gesture Controlled Particle System

Aplikasi web interaktif romantis yang mengendalikan partikel 3D dengan gerakan tangan via webcam. Hadiah spesial untuk orang tersayang! ✨

## ✨ Fitur Gestur

| Gestur | Efek Partikel |
|--------|---------------|
| ✌️ Peace Sign (Jari V) | Teks bercahaya "I LOVE U" |
| 🤟 Love Sign (Jempol + Telunjuk + Kelingking) | Bentuk Hati 3D romantis |
| 🤙 L Sign (Jempol + Telunjuk tegak lurus) | Teks "Lidiya ❤️ Aidul" |
| ✋ Open Palm (Tangan terbuka) | Partikel menyebar seperti galaksi |
| ✊ Fist (Kepalan tangan) | Partikel meledak spektakuler |

## 🚀 Tech Stack

### Backend
- **Python 3.11** dengan FastAPI
- **MediaPipe** untuk deteksi gesture tangan
- **WebSocket** untuk komunikasi real-time
- **OpenCV** untuk pemrosesan gambar

### Frontend
- **React 18** dengan Vite
- **Three.js** + React Three Fiber untuk 3D
- **Tailwind CSS** untuk styling modern
- **WebRTC** untuk akses webcam

## 📦 Instalasi & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Webcam

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend akan berjalan di `http://localhost:8000`

### Frontend Setup
```bash
cd frontend
npm install
cp env.example .env
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 🌐 Deployment

Lihat [DEPLOYMENT.md](DEPLOYMENT.md) untuk panduan lengkap deployment ke:
- **Backend**: Render.com
- **Frontend**: Vercel.com

## 🎯 Cara Menggunakan

1. Buka aplikasi di browser
2. Izinkan akses webcam
3. Tunggu hingga status "Connected" muncul
4. Lakukan gesture di depan webcam:
   - Pastikan tangan terlihat jelas
   - Jarak ideal: 30-50cm dari kamera
   - Pencahayaan yang cukup
5. Lihat partikel berubah bentuk sesuai gesture!

## 🛠️ Struktur Proyek

```
gesture-particle-system/
├── backend/
│   ├── main.py                 # FastAPI server & WebSocket
│   ├── gesture_detector.py     # Logika deteksi gesture
│   ├── requirements.txt        # Dependencies Python
│   └── render.yaml            # Config deployment Render
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Komponen utama
│   │   ├── components/
│   │   │   ├── ParticleSystem.jsx  # Sistem partikel 3D
│   │   │   └── WebcamCapture.jsx   # Capture webcam
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json            # Config deployment Vercel
└── README.md
```

## 🔧 Troubleshooting

### Backend tidak connect
- Pastikan backend sudah running di port 8000
- Cek firewall tidak memblokir port
- Lihat console untuk error messages

### Webcam tidak muncul
- Pastikan browser memiliki permission webcam
- Gunakan HTTPS di production (WebRTC requirement)
- Cek webcam tidak digunakan aplikasi lain

### Gesture tidak terdeteksi
- Pastikan pencahayaan cukup
- Tangan harus terlihat penuh di frame
- Coba perlambat gerakan
- Jarak ideal 30-50cm dari kamera

## 💡 Tips

- Gunakan background yang kontras dengan warna kulit
- Pencahayaan dari depan lebih baik
- Gesture harus jelas dan stabil selama 1-2 detik
- Jika lag, kurangi resolusi webcam di `WebcamCapture.jsx`

## 📝 License

MIT License - Bebas digunakan untuk hadiah romantis! 💝

## 🙏 Credits

Dibuat dengan ❤️ menggunakan:
- [MediaPipe](https://mediapipe.dev/) - Hand tracking
- [Three.js](https://threejs.org/) - 3D graphics
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [React](https://react.dev/) - Frontend framework
