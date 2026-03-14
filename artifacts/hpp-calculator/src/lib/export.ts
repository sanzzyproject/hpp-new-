import * as XLSX from "xlsx";
import type { Calculation } from "@/types";
import { formatRupiah } from "./calculations";

export function exportToExcel(calc: Calculation) {
  const wb = XLSX.utils.book_new();

  const infoData = [
    ["Kalkulator HPP Bisnis"],
    [],
    ["Nama Bisnis", calc.businessName],
    ["Mode Bisnis", calc.businessMode],
    ["Batch per Bulan", calc.batchPerMonth],
    ["Tanggal", new Date(calc.createdAt).toLocaleString("id-ID")],
  ];
  const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
  XLSX.utils.book_append_sheet(wb, wsInfo, "Info");

  const bbHeader = [["Nama Bahan", "Harga Total", "Jumlah", "Satuan"]];
  const bbData = calc.bahanBaku.map((b) => [b.nama, b.hargaTotal, b.jumlah, b.satuan]);
  const wsBB = XLSX.utils.aoa_to_sheet([...bbHeader, ...bbData]);
  XLSX.utils.book_append_sheet(wb, wsBB, "Bahan Baku");

  const bpHeader = [["Nama Biaya", "Harga", "Periode"]];
  const bpData = calc.biayaPengolahan.map((b) => [b.nama, b.harga, b.periode]);
  const wsBP = XLSX.utils.aoa_to_sheet([...bpHeader, ...bpData]);
  XLSX.utils.book_append_sheet(wb, wsBP, "Biaya Pengolahan");

  const ptHeader = [["Nama Produk", "Qty", "Satuan", "Harga Jual / Satuan"]];
  const ptData = calc.produkTurunan.map((p) => [p.nama, p.qty, p.satuan, p.hargaJual]);
  const wsPT = XLSX.utils.aoa_to_sheet([...ptHeader, ...ptData]);
  XLSX.utils.book_append_sheet(wb, wsPT, "Produk Turunan");

  if (calc.hasilPerhitungan) {
    const h = calc.hasilPerhitungan;
    const hasilData = [
      ["Hasil Perhitungan HPP"],
      [],
      ["Total Biaya Produksi", formatRupiah(h.totalBiayaProduksi)],
      ["Total Potensi Penjualan", formatRupiah(h.totalPotensiPenjualan)],
      ["Proyeksi Laba / Rugi", formatRupiah(h.proyeksiLaba)],
      [],
      ["Detail HPP per Produk"],
      ["Nama Produk", "Qty", "Alokasi Biaya", "HPP per Satuan", "Proporsi (%)"],
      ...h.hppPerProduk.map((p) => [
        p.nama,
        p.qty,
        formatRupiah(p.alokasiBiaya),
        formatRupiah(p.hppPerUnit),
        `${(p.proporsi * 100).toFixed(1)}%`,
      ]),
    ];
    const wsHasil = XLSX.utils.aoa_to_sheet(hasilData);
    XLSX.utils.book_append_sheet(wb, wsHasil, "Hasil HPP");
  }

  const filename = `HPP_${calc.businessName.replace(/\s+/g, "_")}_${new Date(calc.createdAt).toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, filename);
}
