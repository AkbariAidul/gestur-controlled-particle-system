# 🔧 Cara Memperbaiki Gesture Detection

## Masalah
Gesture detection tidak akurat karena MediaPipe tidak kompatibel dengan Python 3.13.
Aplikasi sekarang berjalan dalam MODE DEMO yang otomatis cycle gesture.

## ✅ Solusi 1: Install Python 3.11 (RECOMMENDED)

### Langkah-langkah:

1. **Download Python 3.11**
   - Kunjungi: https://www.python.org/downloads/
   - Download Python 3.11.x (bukan 3.13)
   - Install dengan centang "Add Python to PATH"

2. **Buat Virtual Environment dengan Python 3.11**
   ```bash
   # Di folder project
   py -3.11 -m venv venv311
   venv311\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Jalankan Backend**
   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```

5. **Jalankan Frontend** (terminal baru)
   ```bash
   cd frontend
   npm run dev
   ```

6. **Buka Browser**
   ```
   http://localhost:3000
   ```

Sekarang gesture detection akan bekerja dengan AKURAT menggunakan webcam Anda!

---

## 🔄 Solusi 2: Gunakan Python 3.11 dari Microsoft Store

1. Buka Microsoft Store
2. Cari "Python 3.11"
3. Install
4. Ikuti langkah 2-6 di atas

---

## 📝 Catatan

Setelah menggunakan Python 3.11, MediaPipe akan:
- ✅ Mendeteksi tangan Anda secara real-time
- ✅ Mengenali gesture dengan akurat
- ✅ Mengubah partikel sesuai gesture yang Anda lakukan

Tidak perlu ubah kode apapun, cukup ganti Python version!
