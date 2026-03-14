# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── hpp-calculator/     # Kalkulator HPP Bisnis (React + Vite, frontend-only)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Artifacts

### `artifacts/hpp-calculator` (Kalkulator HPP Bisnis)

Frontend-only React + Vite app served at `/`. No backend required - all data stored in IndexedDB via the `idb` library.

**Features:**
- 6 mode bisnis (Iklan & COD, Marketplace, Bisnis Ritel/F&B, Manufaktur/Pabrik, Produksi Turunan, Produk Jasa)
- Input bahan baku utama, biaya pengolahan, produk turunan
- Perhitungan HPP otomatis dengan alokasi biaya proporsional berdasarkan nilai jual
- Grafik proyeksi laba 30 hari menggunakan Chart.js (3 garis: Rame, Target, Sepi)
- Bundling Cerdas: pilih beberapa produk, hitung 3 opsi harga bundling
- Riwayat perhitungan tersimpan di IndexedDB (hpp_calculator_db)
- Export Excel (.xlsx) menggunakan library xlsx
- Mobile-first, responsive

**Key Dependencies:**
- `chart.js` — grafik proyeksi laba
- `idb` — IndexedDB wrapper
- `xlsx` — export Excel

**Components:**
- `BusinessModeSelector` — grid 2x3 pilihan mode bisnis
- `InputBahanBaku` — form input bahan baku
- `InputBiaya` — form input biaya pengolahan
- `InputProduk` — form input produk turunan
- `HPPResult` — tampilan hasil perhitungan HPP
- `ProfitProjection` — proyeksi laba bulanan
- `ChartProfit` — grafik Chart.js proyeksi 30 hari
- `BundlingCalculator` — modal bundling cerdas
- `HistoryPanel` — modal riwayat perhitungan

**Data Flow:**
- Formula: Total Biaya Produksi = Bahan Baku + Biaya Pengolahan (biaya bulanan dibagi batch per bulan)
- Alokasi biaya ke produk: proporsional terhadap nilai jual (qty × harga jual)
- HPP per unit = alokasi biaya / qty produk
