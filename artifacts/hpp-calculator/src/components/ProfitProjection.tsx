import { useState } from "react";
import type { HasilPerhitungan } from "@/types";
import { formatRupiah } from "@/lib/calculations";

interface Props {
  hasil: HasilPerhitungan;
  batchPerMonth: number;
  targetLaba: number;
  hargaJual: number;
  onTargetLabaChange: (v: number) => void;
  onHargaJualChange: (v: number) => void;
}

export default function ProfitProjection({
  hasil,
  batchPerMonth,
  targetLaba,
  hargaJual,
  onTargetLabaChange,
  onHargaJualChange,
}: Props) {
  const totalBiayaBulanan = hasil.totalBiayaProduksi * batchPerMonth;
  const omzetBulanan =
    hargaJual > 0
      ? hargaJual * batchPerMonth
      : hasil.totalPotensiPenjualan * batchPerMonth;
  const labaProyeksi = omzetBulanan - totalBiayaBulanan;
  const selisih = labaProyeksi - targetLaba;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span>🎯</span>
          <h3 className="text-sm font-semibold text-gray-700">Target & Proyeksi Penjualan</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Target Laba Bersih / Bulan</label>
            <input
              type="text"
              placeholder="Contoh: 10.000.000"
              value={targetLaba > 0 ? targetLaba.toLocaleString("id-ID") : ""}
              onChange={(e) => {
                const num = parseFloat(e.target.value.replace(/\./g, "").replace(",", ".")) || 0;
                onTargetLabaChange(num);
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Harga Jual Pilihan (Rp)</label>
            <input
              type="text"
              placeholder="Opsional"
              value={hargaJual > 0 ? hargaJual.toLocaleString("id-ID") : ""}
              onChange={(e) => {
                const num = parseFloat(e.target.value.replace(/\./g, "").replace(",", ".")) || 0;
                onHargaJualChange(num);
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">📊 Proyeksi Laba Bulanan</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xs text-blue-500 mb-1">Potensi Omzet / Bulan</p>
            <p className="text-sm font-bold text-blue-700">{formatRupiah(omzetBulanan)}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <p className="text-xs text-orange-500 mb-1">Total Biaya Produksi / Bulan</p>
            <p className="text-sm font-bold text-orange-700">{formatRupiah(totalBiayaBulanan)}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-xs text-purple-500 mb-1">Total Biaya Tetap</p>
            <p className="text-sm font-bold text-purple-700">
              {formatRupiah(totalBiayaBulanan)}
            </p>
          </div>
          <div className={`rounded-xl p-3 text-center ${labaProyeksi >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
            <p className={`text-xs mb-1 ${labaProyeksi >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              Proyeksi Laba Bersih / Bulan
            </p>
            <p className={`text-sm font-bold ${labaProyeksi >= 0 ? "text-emerald-700" : "text-red-700"}`}>
              {formatRupiah(labaProyeksi)}
            </p>
          </div>
        </div>
        {targetLaba > 0 && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${selisih >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {selisih >= 0
              ? `✅ Proyeksi laba melebihi target sebesar ${formatRupiah(selisih)}`
              : `⚠️ Proyeksi laba kurang dari target sebesar ${formatRupiah(Math.abs(selisih))}`}
          </div>
        )}
      </div>
    </div>
  );
}
