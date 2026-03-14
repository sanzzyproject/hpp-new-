import type { BahanBaku, BiayaPengolahan, ProdukTurunan, HasilPerhitungan, HPPPerProduk } from "@/types";

export function hitungHPP(
  bahanBaku: BahanBaku[],
  biayaPengolahan: BiayaPengolahan[],
  produkTurunan: ProdukTurunan[],
  batchPerMonth: number
): HasilPerhitungan {
  const totalBahanBaku = bahanBaku.reduce((sum, b) => sum + b.hargaTotal, 0);

  const totalBiayaPengolahan = biayaPengolahan.reduce((sum, b) => {
    if (b.periode === "per_bulan") {
      return sum + b.harga / Math.max(batchPerMonth, 1);
    }
    return sum + b.harga;
  }, 0);

  const totalBiayaProduksi = totalBahanBaku + totalBiayaPengolahan;

  const totalPotensiPenjualan = produkTurunan.reduce(
    (sum, p) => sum + p.qty * p.hargaJual,
    0
  );

  const proyeksiLaba = totalPotensiPenjualan - totalBiayaProduksi;

  const hppPerProduk: HPPPerProduk[] = [];

  if (totalPotensiPenjualan > 0) {
    produkTurunan.forEach((p) => {
      const nilaiJual = p.qty * p.hargaJual;
      const proporsi = nilaiJual / totalPotensiPenjualan;
      const alokasiBiaya = proporsi * totalBiayaProduksi;
      const hppPerUnit = p.qty > 0 ? alokasiBiaya / p.qty : 0;
      hppPerProduk.push({
        nama: p.nama,
        qty: p.qty,
        alokasiBiaya,
        hppPerUnit,
        proporsi,
      });
    });
  } else {
    const n = produkTurunan.length;
    produkTurunan.forEach((p) => {
      const alokasiBiaya = n > 0 ? totalBiayaProduksi / n : 0;
      const hppPerUnit = p.qty > 0 ? alokasiBiaya / p.qty : 0;
      hppPerProduk.push({
        nama: p.nama,
        qty: p.qty,
        alokasiBiaya,
        hppPerUnit,
        proporsi: n > 0 ? 1 / n : 0,
      });
    });
  }

  return {
    totalBiayaProduksi,
    totalPotensiPenjualan,
    proyeksiLaba,
    hppPerProduk,
  };
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function parseNumber(value: string): number {
  const cleaned = value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}
