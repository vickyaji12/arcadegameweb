# TODO - GitHub Pages Ready

- [x] Audit file-file game yang menggunakan fetch / asset path relatif
- [x] Perbaiki error message quiz agar tidak menyarankan penggunaan Live Server (GitHub Pages sudah HTTP)
- [x] Perbaiki reaction-time: konsisten simpan & baca skor “terendah” tanpa konflik highscore helper
- [x] Bungkus reaction-time.js dalam IIFE agar variabel tidak bentrok antar game
- [ ] Lakukan audit sisanya: potensi konflik namespace/variabel global lain (IIFE pada game lain jika ditemukan bentrok)

- [ ] Validasi manual di browser: index.html + 3-4 game random (cek console tidak ada 404 / reference error)
- [ ] Siapkan instruksi build/deploy GitHub Pages (struktur root & link)
