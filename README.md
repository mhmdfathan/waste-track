# 📌 TrashIt – Platform Web untuk Transformasi Pengelolaan Sampah dan Bank Sampah Berkelanjutan


## 👥 Tim Pengembang – Jagoan Timbang

**Universitas Diponegoro**

- **Alkha Nayla Syahla** – NIM: 21080121140038 – Teknik Lingkungan  
- **Wimanda Novita Putri** – NIM: 21080121140039 – Teknik Lingkungan  
- **Muhammad Fathan Mubiina** – NIM: 21120121140164 – Teknik Komputer  

---

## 🌐 Deskripsi Proyek

**TrashIt** adalah platform digital berbasis web yang dirancang untuk memfasilitasi pengelolaan sampah secara efisien dan berkelanjutan.  
Platform ini memungkinkan nasabah, admin bank sampah, dan perusahaan pengepul (offtaker) untuk berinteraksi dalam ekosistem pengelolaan sampah yang terintegrasi.  
Dengan fitur-fitur seperti input data sampah, pemantauan saldo, dan marketplace sampah, TrashIt bertujuan untuk meningkatkan kesadaran dan partisipasi masyarakat dalam pengelolaan sampah.

---

## 💠 Panduan Instalasi dan Menjalankan Aplikasi

### 1. Persyaratan Sistem

- Node.js (versi terbaru disarankan)
- Package manager seperti `npm`, `yarn`, `pnpm`, atau `bun`

### 2. Langkah-langkah Instalasi

#### a. Kloning Repository

```bash
git clone https://github.com/username/trashit.git
cd trashit
```

b. Instalasi Dependensi

```bash
npm install
# atau
yarn install
# atau
pnpm install
# atau
bun install
```


c. Menjalankan Server Pengembangan
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 🚀 Fitur Utama
Untuk Nasabah:
Akses aplikasi: https://waste-track.vercel.app

Login menggunakan akun nasabah

Pilih menu Input Sampah Organik

Masukkan data (jenis & berat) dan klik Simpan

Cek saldo dan histori di halaman Dashboard

Tarik saldo via GoPay, ShopeePay, transfer bank, atau tunai

## Untuk Admin:
Login ke sistem sebagai admin

Pilih menu Timbang Sampah Anorganik

Masukkan nama nasabah dan data penimbangan

Klik Simpan, data langsung masuk ke akun nasabah

## Untuk Offtaker (Perusahaan Pengepul):
Login sebagai pengguna offtaker

Buka menu Marketplace

Lihat dan pilih jenis sampah yang tersedia

Klik Pesan dan konfirmasi ke admin TrashIt

## ❓ FAQ & Troubleshooting
Q: Saya lupa password, bagaimana cara reset?
A: Klik “Lupa Password” di halaman login dan ikuti instruksi reset melalui email.

Q: Saldo saya belum muncul setelah setor sampah. Apa solusinya?
A: Pastikan admin telah memasukkan data. Jika belum masuk dalam 24 jam, hubungi admin bank sampah Anda.

Q: Sampah apa saja yang bisa saya input sendiri?
A: Nasabah hanya dapat menginput sampah organik seperti buah/sayur, kompos, dan eco-enzyme. Sampah anorganik diinput oleh admin.

Q: Apakah bisa tarik saldo langsung ke dompet digital?
A: Bisa. TrashIt mendukung GoPay, ShopeePay, dan transfer bank.

Q: Bagaimana cara membeli sampah dari marketplace TrashIt?
A: Login sebagai offtaker → buka marketplace → pilih item → klik “Pesan” → admin akan mengatur pengambilan.
