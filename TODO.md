# TODO - GitHub Pages Ready

- [x] Audit file-file game yang menggunakan fetch / asset path relatif
- [x] Perbaiki error message quiz agar tidak menyarankan penggunaan Live Server (GitHub Pages sudah HTTP)
- [x] Perbaiki reaction-time: konsisten simpan & baca skor “terendah” tanpa konflik highscore helper
- [x] Bungkus reaction-time.js dalam IIFE agar variabel tidak bentrok antar game
- [x] Lakukan audit sisanya: potensi konflik namespace/variabel global lain (IIFE pada game lain jika ditemukan bentrok)

- [x] Validasi manual di browser: index.html + semua 10 game (cek console tidak ada 404 / reference error)
- [x] Siapkan instruksi build/deploy GitHub Pages (struktur root & link)

---

## Panduan Deploy ke GitHub Pages

Proyek ini telah dikonfigurasi menggunakan file path relatif sehingga siap dideploy langsung ke GitHub Pages tanpa build step.

### Cara Deploy:
1. **Buat Repositori Baru** di GitHub (misal: `arcadegameweb`).
2. **Push Code** dari folder lokal Anda ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Premium Arcade Game Hub"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPOSITORI.git
   git push -u origin main
   ```
3. **Aktifkan GitHub Pages**:
   - Buka halaman repositori di GitHub.
   - Buka **Settings** -> **Pages**.
   - Di bagian **Build and deployment**, atur **Source** menjadi **Deploy from a branch**.
   - Pilih branch **main** dan folder **/ (root)**, lalu klik **Save**.
4. **Selesai!** Game Hub Anda akan tayang di `https://USERNAME.github.io/REPOSITORI/` dalam beberapa menit.
