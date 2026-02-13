# 🚀 Quick Start Guide

## Status Instalasi ✅

- ✅ Backend dependencies terinstall
- ✅ Frontend dependencies terinstall  
- ✅ Backend sudah dijalankan di terminal terpisah
- ✅ Frontend sudah dijalankan di terminal terpisah

## Cara Menggunakan

### 1. Cek Terminal
Anda sekarang punya 2 terminal CMD yang terbuka:
- **Terminal 1 (Backend)**: Running di `http://localhost:8000`
- **Terminal 2 (Frontend)**: Running di `http://localhost:3000`

### 2. Buka Browser
Buka browser dan akses:
```
http://localhost:3000
```

### 3. Izinkan Webcam
- Browser akan minta izin akses webcam
- Klik "Allow" atau "Izinkan"

### 4. Coba Gesture! 🎉
Lakukan gesture di depan webcam:

| Gesture | Hasil |
|---------|-------|
| ✌️ **Peace Sign** (Jari V) | Teks "I LOVE U" |
| 🤟 **Love Sign** (Jempol + Telunjuk + Kelingking) | Hati 3D ❤️ |
| 🤙 **L Sign** (Jempol + Telunjuk tegak lurus) | "Lidiya ❤️ Aidul" |
| ✋ **Open Palm** (Tangan terbuka) | Galaksi bintang ✨ |
| ✊ **Fist** (Kepalan) | Ledakan 💥 |

## Tips Gesture
- Jarak ideal: 30-50cm dari webcam
- Pastikan pencahayaan cukup
- Tangan harus terlihat penuh di frame
- Tahan gesture 1-2 detik

## Troubleshooting

### Backend tidak jalan?
Jalankan manual:
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend tidak jalan?
Jalankan manual:
```bash
cd frontend
npm run dev
```

### Gesture tidak terdeteksi?
- Cek status "Connected" di pojok kiri atas
- Pastikan backend running
- Refresh browser

## Stop Server
Untuk stop server, tekan `Ctrl + C` di masing-masing terminal.

---

**Selamat mencoba! Semoga Lidiya suka! 💝**
