export interface BahanBaku {
  id: string;
  nama: string;
  hargaTotal: number;
  jumlah: number;
  satuan: string;
}

export interface BiayaPengolahan {
  id: string;
  nama: string;
  harga: number;
  periode: "per_batch" | "per_bulan";
}

export interface ProdukTurunan {
  id: string;
  nama: string;
  qty: number;
  satuan: string;
  hargaJual: number;
}

export interface HPPPerProduk {
  nama: string;
  qty: number;
  alokasiBiaya: number;
  hppPerUnit: number;
  proporsi: number;
}

export interface HasilPerhitungan {
  totalBiayaProduksi: number;
  totalPotensiPenjualan: number;
  proyeksiLaba: number;
  hppPerProduk: HPPPerProduk[];
}

export interface BundlingItem {
  id: string;
  produkIds: string[];
  totalHPP: number;
  hargaNormal: number;
  hargaHemat: number;
  hargaSeimbang: number;
  hargaMaksimal: number;
}

export interface Calculation {
  id?: number;
  businessName: string;
  businessMode: string;
  batchPerMonth: number;
  bahanBaku: BahanBaku[];
  biayaPengolahan: BiayaPengolahan[];
  produkTurunan: ProdukTurunan[];
  hasilPerhitungan: HasilPerhitungan | null;
  bundling: BundlingItem[];
  createdAt: number;
}

export type BusinessMode =
  | "iklan_cod"
  | "marketplace"
  | "ritel_fnb"
  | "manufaktur"
  | "produksi_turunan"
  | "produk_jasa";

export interface BusinessModeOption {
  id: BusinessMode;
  label: string;
  icon: string;
}
