# 💝 Gesture Controlled Particle System

Aplikasi web interaktif romantis yang mengendalikan partikel 3D dengan gerakan tangan via webcam. Hadiah spesial untuk orang tersayang! ✨

**🎉 100% Client-Side - No Backend Required!**

## ✨ Fitur Gestur

| Gestur | Efek Partikel |
|--------|---------------|
| ✌️ Peace Sign (Jari V) | Teks bercahaya "I LOVE U" |
| 🤟 Love Sign (Jempol + Telunjuk + Kelingking) | Bentuk Hati 3D romantis |
| 🤙 L Sign (Jempol + Telunjuk tegak lurus) | Teks "Lidiya ❤️ Aidul" |
| ✋ Open Palm (Tangan terbuka) | Partikel menyebar seperti galaksi |
| ✊ Fist (Kepalan tangan) | Partikel meledak spektakuler |

## 🚀 Tech Stack

### Frontend (100% Client-Side)
- **React 18** dengan Vite
- **Three.js** + React Three Fiber untuk 3D
- **MediaPipe Tasks Vision** untuk hand tracking (runs in browser!)
- **Tailwind CSS** untuk styling modern
- **WebRTC** untuk akses webcam

## 📦 Instalasi & Setup

### Prerequisites
- Node.js 18+
- Webcam
- Modern browser (Chrome, Edge, Firefox)

### Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 🌐 Deployment

### Deploy ke Vercel (Recommended - FREE!)

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set Root Directory: `frontend`
4. Deploy!

Vercel akan otomatis detect Vite dan deploy dengan benar.

**No backend needed!** Semua hand tracking berjalan di browser menggunakan MediaPipe WASM.

## 🎯 Cara Menggunakan

1. Buka aplikasi di browser
2. Izinkan akses webcam
3. Tunggu hingga status "Ready" muncul
4. Lakukan gesture di depan webcam:
   - Pastikan tangan terlihat jelas
   - Jarak ideal: 30-50cm dari kamera
   - Pencahayaan yang cukup
5. Lihat partikel berubah bentuk sesuai gesture!

## 🛠️ Struktur Proyek

```
gesture-particle-system/
├── frontend/
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useHandGesture.js     # MediaPipe hand tracking logic
│   │   ├── components/
│   │   │   ├── ParticleSystem.jsx    # 3D particle system
│   │   │   └── WebcamCapture.jsx     # Webcam component
│   │   ├── App.jsx                   # Main app
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── README.md
```

## 🔧 Troubleshooting

### Webcam tidak muncul
- Pastikan browser memiliki permission webcam
- Gunakan HTTPS di production (WebRTC requirement)
- Cek webcam tidak digunakan aplikasi lain

### Gesture tidak terdeteksi
- Pastikan pencahayaan cukup
- Tangan harus terlihat penuh di frame
- Coba perlambat gerakan
- Jarak ideal 30-50cm dari kamera

### MediaPipe loading lambat
- First load akan download WASM files (~2-3MB)
- Setelah itu akan di-cache oleh browser
- Gunakan koneksi internet yang stabil

## 💡 Tips

- Gunakan background yang kontras dengan warna kulit
- Pencahayaan dari depan lebih baik
- Gesture harus jelas dan stabil selama 1-2 detik
- Browser modern (Chrome/Edge) memberikan performa terbaik

## 🎨 Customization

Untuk mengubah gesture atau particle effects, edit:
- `frontend/src/hooks/useHandGesture.js` - Gesture detection logic
- `frontend/src/components/ParticleSystem.jsx` - Particle formations

## 📝 License

MIT License - Bebas digunakan untuk hadiah romantis! 💝

## 🙏 Credits

Dibuat dengan ❤️ menggunakan:
- [MediaPipe](https://mediapipe.dev/) - Hand tracking (client-side!)
- [Three.js](https://threejs.org/) - 3D graphics
- [React](https://react.dev/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
