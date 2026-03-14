import type { HasilPerhitungan, ProdukTurunan } from "@/types";
import { formatRupiah } from "@/lib/calculations";

interface Props {
  hasil: HasilPerhitungan;
  produkTurunan: ProdukTurunan[];
}

export default function HPPResult({ hasil }: Props) {
  const isProfit = hasil.proyeksiLaba >= 0;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">📋</span>
          <h3 className="text-sm font-semibold text-gray-700">Ringkasan Biaya & Proyeksi Laba per Batch</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-sm text-gray-600">Total Biaya Produksi</span>
            <span className="text-sm font-semibold text-gray-800">
              {formatRupiah(hasil.totalBiayaProduksi)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-sm text-gray-600">Total Potensi Penjualan</span>
            <span className="text-sm font-semibold text-gray-800">
              {formatRupiah(hasil.totalPotensiPenjualan)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-semibold text-gray-700">Proyeksi Laba / (Rugi)</span>
            <span className={`text-sm font-bold ${isProfit ? "text-emerald-600" : "text-red-500"}`}>
              {formatRupiah(hasil.proyeksiLaba)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">Detail HPP per Produk Turunan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Nama Produk</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Qty</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Alokasi Biaya</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">HPP per Satuan</th>
              </tr>
            </thead>
            <tbody>
              {hasil.hppPerProduk.map((item, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-700 font-medium">{item.nama}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{item.qty}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatRupiah(item.alokasiBiaya)}{" "}
                    <span className="text-xs text-gray-400">({(item.proporsi * 100).toFixed(1)}%)</span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-indigo-600">
                    {formatRupiah(item.hppPerUnit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
