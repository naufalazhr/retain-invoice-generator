# Faktur — Invoice Generator

SPA statis, tanpa build step, tanpa npm. Langsung serve folder ini.

## File

- `index.html` — struktur app (editor + preview)
- `styles.css` — styling + print CSS (A4)
- `app.js` — state, kalkulasi, localStorage, draft, print
- `wrangler.toml` — config Cloudflare (static assets)

## Cara run lokal

Pilih salah satu:

```bash
# Python (paling gampang)
python3 -m http.server 8000
# buka http://localhost:8000

# atau Node
npx serve .
```

Bisa juga double-click `index.html`, tapi disarankan via local server agar font/CDN Tailwind jalan normal.

## Cara test

1. Isi profil usaha + upload logo (base64, tersimpan lokal).
2. Isi klien, tanggal, ubah mata uang (default IDR/Rp, format `id-ID`).
3. Tambah/hapus/edit line items → cek subtotal, diskon (%/Rp), pajak %, ongkir, total terhitung otomatis di preview.
4. Klik **Cetak / PDF** → dialog print muncul, hanya kertas invoice yang tercetak (editor disembunyikan via print CSS). Pilih "Save as PDF".
5. Reload halaman → data kembali (autosave `localStorage`). Klik **Simpan draft** → muncul di daftar draft, bisa dimuat/dihapus.
6. Mobile: pakai tab Editor/Preview, layout responsif.

## Deploy ke Cloudflare

Jangan deploy dari task ini — manual saat siap:

```bash
# Workers static assets (butuh wrangler login)
npx wrangler@latest deploy

# atau Pages
npx wrangler@latest pages deploy . --project-name invoice-generator
```

Butuh internet untuk CDN Tailwind + Google Fonts. Untuk full-offline, ganti Tailwind CDN dengan CSS murni (saat ini `styles.css` sudah menanggung sebagian besar styling kritis + print).
