# 🚀 Panduan Deployment

## Backend (Render)

1. Push kode ke GitHub repository
2. Buat akun di [Render.com](https://render.com)
3. Klik "New +" → "Web Service"
4. Connect repository GitHub Anda
5. Konfigurasi:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3
6. Deploy dan catat URL backend (contoh: `https://your-app.onrender.com`)

## Frontend (Vercel)

1. Push kode ke GitHub repository
2. Buat akun di [Vercel.com](https://vercel.com)
3. Import repository GitHub
4. Konfigurasi:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Tambahkan Environment Variable:
   - Key: `VITE_WS_URL`
   - Value: `wss://your-app.onrender.com/ws` (ganti dengan URL Render Anda)
6. Deploy

## Update CORS di Backend

Setelah deploy, edit `backend/main.py` dan update CORS:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-vercel-app.vercel.app",  # Ganti dengan domain Vercel Anda
        "http://localhost:3000"  # Untuk development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing Local

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Buka browser di `http://localhost:3000`
