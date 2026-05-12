# Synoids POS 🚀

**AI-Powered SaaS Point of Sale & Inventory System for UMKM**

Synoids POS adalah platform Point of Sale (Kasir) modern berbasis SaaS yang dirancang khusus untuk UMKM dengan standar arsitektur startup kelas dunia. Memadukan kecepatan Next.js, keandalan Supabase, dan desain premium yang futuristik.

![Banner](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop)

## ✨ Fitur Utama (Phase 1)

- **Multi-Tenant Architecture**: Satu infrastruktur untuk ribuan bisnis dengan isolasi data yang ketat.
- **Modern Auth & Onboarding**: Alur pendaftaran bisnis yang seamless dengan pengisian data demo otomatis.
- **RBAC (Role-Based Access Control)**: Sistem hak akses berlapis (Owner, Manager, Cashier).
- **Futuristic UI/UX**: Dashboard dengan estetika *Glassmorphism* dan *Dark Mode first* menggunakan Tailwind CSS & Shadcn UI.
- **Automated Infrastructure**: Setup organisasi dan inventaris awal hanya dalam hitungan detik.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS & Framer Motion
- **UI Components**: Shadcn UI & Base UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)

## 🚀 Memulai Pengembangan

### Prasyarat
- Node.js 18+
- Akun Supabase

### Instalasi

1. **Clone Repositori**
   ```bash
   git clone https://github.com/Synoids/pos-umkm.git
   cd pos-umkm
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**
   Buat file `.env.local` dan masukkan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

## 📂 Struktur Proyek

```text
src/
├── app/            # Next.js App Router (Routes & Pages)
├── components/     # UI & Business Components
├── hooks/          # Custom React Hooks
├── lib/            # Shared Utilities & Configurations
├── providers/      # Context Providers (Auth, Theme, Query)
├── services/       # Database & API Services (Supabase)
├── store/          # Global State (Zustand)
└── types/          # TypeScript Definitions & Database Schema
```

## 📜 Lisensi

Synoids POS dikembangkan sebagai solusi *state-of-the-art* untuk digitalisasi UMKM. Hak Cipta &copy; 2026 Synoids.

---
Built with 💙 by **Synoids Engineering Team**
