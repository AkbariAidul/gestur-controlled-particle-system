# 🚀 CARA MENJALANKAN APLIKASI

## ✅ Status: SIAP DIGUNAKAN!

Backend dan Frontend sudah running di 2 terminal PowerShell terpisah.

## 📱 Akses Aplikasi

Buka browser dan kunjungi:
```
http://localhost:3000
```

## ✨ Cara Menggunakan

1. **Izinkan Webcam** - Browser akan minta izin, klik "Allow"

2. **Tunggu Status "Connected"** - Lihat pojok kiri atas, tunggu sampai muncul titik hijau dan tulisan "Connected"

3. **Lakukan Gesture!** - Aplikasi sekarang dalam MODE DEMO yang akan otomatis cycle gesture setiap beberapa detik untuk testing

## 🎯 Gesture yang Tersedia

| Gesture | Efek Partikel |
|---------|---------------|
| ✌️ Peace Sign | Teks "I LOVE U" |
| 🤟 Love Sign | Bentuk Hati 3D ❤️ |
| 🤙 L Sign | "Lidiya ❤️ Aidul" |
| ✋ Open Palm | Galaksi bintang |
| ✊ Fist | Ledakan |

## 📝 Catatan Penting

**MODE DEMO AKTIF**: Karena MediaPipe tidak kompatibel dengan Python 3.13, aplikasi sekarang berjalan dalam mode demo yang akan otomatis mengganti gesture setiap beberapa detik. Ini untuk testing visual partikel.

**Untuk Gesture Detection yang Sebenarnya**: Anda perlu:
- Downgrade ke Python 3.11 atau 3.10
- Reinstall dependencies: `pip install -r requirements.txt`
- MediaPipe akan berfungsi dengan baik di Python 3.11

## 🛑 Cara Stop Aplikasi

Tutup 2 terminal PowerShell yang terbuka, atau tekan `Ctrl+C` di masing-masing terminal.

## 🔄 Cara Restart

Jika ingin restart, jalankan file:
```
run-app.bat
```

Atau jalankan manual:

**Terminal 1 (Backend):**
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

**Selamat mencoba! Semoga Lidiya suka! 💝**
