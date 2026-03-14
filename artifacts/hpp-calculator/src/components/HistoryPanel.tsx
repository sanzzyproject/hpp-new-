import { useEffect, useState } from "react";
import type { Calculation } from "@/types";
import { getAllCalculations, deleteCalculation } from "@/lib/db";
import { formatRupiah } from "@/lib/calculations";

interface Props {
  onLoad: (calc: Calculation) => void;
  onClose: () => void;
}

export default function HistoryPanel({ onLoad, onClose }: Props) {
  const [history, setHistory] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getAllCalculations();
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus perhitungan ini?")) return;
    await deleteCalculation(id);
    await loadHistory();
  };

  const businessModeLabel: Record<string, string> = {
    iklan_cod: "Iklan & COD",
    marketplace: "Marketplace",
    ritel_fnb: "Bisnis Ritel/F&B",
    manufaktur: "Manufaktur / Pabrik",
    produksi_turunan: "Produksi Turunan",
    produk_jasa: "Produk Jasa",
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span>🕒</span>
            <h2 className="text-base font-semibold text-gray-800">Riwayat Perhitungan</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <div className="p-5">
          {loading && (
            <div className="text-center py-8 text-gray-400 text-sm">Memuat riwayat...</div>
          )}
          {!loading && history.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">Belum ada riwayat perhitungan.</p>
              <p className="text-gray-300 text-xs mt-1">Simpan perhitungan setelah menghitung HPP.</p>
            </div>
          )}
          <div className="space-y-3">
            {history.map((calc) => (
              <div key={calc.id} className="border border-gray-200 rounded-xl p-4 hover:border-indigo-200 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{calc.businessName || "(Tanpa Nama)"}</h3>
                    <p className="text-xs text-gray-400">
                      {businessModeLabel[calc.businessMode] || calc.businessMode} · {calc.batchPerMonth} batch/bulan
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(calc.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                  {calc.hasilPerhitungan && (
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Laba / Rugi</p>
                      <p
                        className={`text-sm font-bold ${
                          calc.hasilPerhitungan.proyeksiLaba >= 0
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {formatRupiah(calc.hasilPerhitungan.proyeksiLaba)}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { onLoad(calc); onClose(); }}
                    className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium py-2 rounded-lg transition-colors"
                  >
                    Buka
                  </button>
                  <button
                    onClick={() => calc.id && handleDelete(calc.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium py-2 rounded-lg transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
