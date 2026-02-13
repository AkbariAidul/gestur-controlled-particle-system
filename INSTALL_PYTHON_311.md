# 🐍 Cara Install Python 3.11 untuk Gesture Detection yang Akurat

## Kenapa Perlu Python 3.11?

MediaPipe (library untuk hand tracking) tidak kompatibel dengan Python 3.13.
Dengan Python 3.11, gesture detection akan **100% AKURAT** menggunakan AI!

## 📥 Cara Install Python 3.11

### Opsi 1: Download dari Python.org

1. **Buka browser** dan kunjungi:
   ```
   https://www.python.org/downloads/release/python-3119/
   ```

2. **Scroll ke bawah** dan download:
   - Windows: `Windows installer (64-bit)`

3. **Install Python 3.11**
   - ✅ PENTING: Centang "Add Python 3.11 to PATH"
   - Klik "Install Now"

4. **Verifikasi instalasi**
   ```bash
   py -3.11 --version
   ```
   Harus muncul: `Python 3.11.9`

### Opsi 2: Microsoft Store (Lebih Mudah)

1. Buka **Microsoft Store**
2. Cari "**Python 3.11**"
3. Klik **Install**
4. Selesai!

## 🚀 Setup Project dengan Python 3.11

### 1. Buat Virtual Environment Baru

```bash
# Di folder project (gestur-controlled-particle-system)
py -3.11 -m venv venv311
```

### 2. Aktifkan Virtual Environment

```bash
venv311\Scripts\activate
```

Anda akan lihat `(venv311)` di awal command prompt.

### 3. Install Dependencies Backend

```bash
cd backend
pip install -r requirements.txt
```

Tunggu sampai selesai (sekitar 2-3 menit).

### 4. Jalankan Backend

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Anda akan lihat:
```
✓ Using MediaPipe gesture detector
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 5. Jalankan Frontend (Terminal Baru)

```bash
cd frontend
npm run dev
```

### 6. Buka Browser

```
http://localhost:3000
```

## ✅ Sekarang Gesture Detection Akan:

- ✅ Mendeteksi tangan Anda secara real-time dengan AI
- ✅ Mengenali 5 gesture dengan akurat:
  - ✌️ Peace Sign → "I LOVE U"
  - 🤟 Love Sign → Hati 3D
  - 🤙 L Sign → "Lidiya LOVE ❤️ Aidul"
  - ✋ Open Palm → Galaksi
  - ✊ Fist → Ledakan
- ✅ Responsif dan smooth!

## 🎯 Tips Gesture Detection

- Jarak ideal: 30-50cm dari webcam
- Pencahayaan yang cukup
- Tangan harus terlihat penuh di frame
- Tahan gesture 1-2 detik

## 🔄 Cara Kembali ke Python 3.13

Jika ingin kembali ke Python 3.13:
```bash
deactivate
```

Untuk kembali ke Python 3.11:
```bash
venv311\Scripts\activate
```

---

**Selamat! Aplikasi sekarang akan bekerja dengan sempurna! 💝**
