import { useState } from "react";
import type { ProdukTurunan, HPPPerProduk, BundlingItem } from "@/types";
import { formatRupiah } from "@/lib/calculations";

interface Props {
  produkTurunan: ProdukTurunan[];
  hppPerProduk: HPPPerProduk[];
  onClose: () => void;
}

function generateId() {
  return Math.random().toString(36).slice(2);
}

export default function BundlingCalculator({ produkTurunan, hppPerProduk, onClose }: Props) {
  const [step, setStep] = useState<"select" | "result">("select");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bundlingResult, setBundlingResult] = useState<BundlingItem | null>(null);

  const toggleProduct = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const hitungBundling = () => {
    if (selectedIds.length < 2) return;

    const selectedProduk = produkTurunan.filter((p) => selectedIds.includes(p.id));
    const selectedHPP = hppPerProduk.filter((h) =>
      selectedProduk.some((p) => p.nama === h.nama)
    );

    const totalHPP = selectedHPP.reduce((sum, h) => sum + h.hppPerUnit, 0);
    const hargaNormal = selectedProduk.reduce((sum, p) => sum + p.hargaJual, 0);

    const result: BundlingItem = {
      id: generateId(),
      produkIds: selectedIds,
      totalHPP,
      hargaNormal,
      hargaHemat: Math.ceil(hargaNormal * 0.8 / 100) * 100,
      hargaSeimbang: Math.ceil((totalHPP + hargaNormal) / 2 / 100) * 100,
      hargaMaksimal: Math.ceil(hargaNormal * 0.935 / 100) * 100,
    };

    setBundlingResult(result);
    setStep("result");
  };

  const selectedProduk = produkTurunan.filter((p) => selectedIds.includes(p.id));
  const selectedHPP = hppPerProduk.filter((h) =>
    selectedProduk.some((p) => p.nama === h.nama)
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span>🎁</span>
            <h2 className="text-base font-semibold text-gray-800">Buat Harga Bundling Cerdas</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {step === "select" && (
          <div className="p-5 space-y-4">
            <button
              onClick={() => setStep("result")}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
            >
              ← Kembali
            </button>
            <h3 className="text-sm font-medium text-gray-700">Pilih produk untuk dibundling (min. 2):</h3>
            <div className="space-y-2">
              {produkTurunan.map((p) => {
                const hpp = hppPerProduk.find((h) => h.nama === p.nama);
                return (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedIds.includes(p.id)
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(p.id)}
                      onChange={() => toggleProduct(p.id)}
                      className="accent-indigo-600"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700">{p.nama}</p>
                      <p className="text-xs text-gray-400">
                        Harga Jual: {formatRupiah(p.hargaJual)}
                        {hpp ? ` · HPP: ${formatRupiah(hpp.hppPerUnit)}` : ""}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
            <button
              disabled={selectedIds.length < 2}
              onClick={hitungBundling}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              Hitung Bundling ({selectedIds.length} produk dipilih)
            </button>
          </div>
        )}

        {step === "result" && bundlingResult && (
          <div className="p-5 space-y-5">
            <button
              onClick={() => { setStep("select"); setBundlingResult(null); }}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
            >
              ← Kembali
            </button>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Rincian Paket Bundling</h3>
              <div className="space-y-2">
                {selectedProduk.map((p) => {
                  const hpp = hppPerProduk.find((h) => h.nama === p.nama);
                  return (
                    <div key={p.id} className="flex justify-between items-start py-2 border-b border-gray-200 last:border-0">
                      <span className="text-sm text-gray-700">{p.nama}</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">{formatRupiah(p.hargaJual)}</p>
                        {hpp && <p className="text-xs text-gray-400">HPP: {formatRupiah(hpp.hppPerUnit)}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total HPP Gabungan:</span>
                  <span className="text-sm font-bold text-red-500">{formatRupiah(bundlingResult.totalHPP)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Harga Jual Normal:</span>
                  <span className="text-sm font-bold text-gray-700">{formatRupiah(bundlingResult.hargaNormal)}</span>
                </div>
              </div>
            </div>

            <h3 className="text-sm font-semibold text-gray-700 text-center">Saran Harga Bundling</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Paket Hemat",
                  harga: bundlingResult.hargaHemat,
                  color: "purple",
                  diskon: bundlingResult.hargaNormal - bundlingResult.hargaHemat,
                  margin: ((bundlingResult.hargaHemat - bundlingResult.totalHPP) / bundlingResult.hargaHemat * 100),
                  desc: "Menarik pelanggan baru & mendorong volume penjualan tinggi dengan diskon besar.",
                },
                {
                  label: "Paling Seimbang",
                  harga: bundlingResult.hargaSeimbang,
                  color: "indigo",
                  diskon: bundlingResult.hargaNormal - bundlingResult.hargaSeimbang,
                  margin: ((bundlingResult.hargaSeimbang - bundlingResult.totalHPP) / bundlingResult.hargaSeimbang * 100),
                  desc: "Keseimbangan optimal antara daya tarik harga dan profitabilitas yang sehat.",
                },
                {
                  label: "Profit Maksimal",
                  harga: bundlingResult.hargaMaksimal,
                  color: "blue",
                  diskon: bundlingResult.hargaNormal - bundlingResult.hargaMaksimal,
                  margin: ((bundlingResult.hargaMaksimal - bundlingResult.totalHPP) / bundlingResult.hargaMaksimal * 100),
                  desc: "Memaksimalkan profit per transaksi, cocok untuk pelanggan yang tidak terlalu sensitif harga.",
                },
              ].map((option) => {
                const profit = option.harga - bundlingResult.totalHPP;
                const colorMap: Record<string, string> = {
                  purple: "text-purple-600",
                  indigo: "text-indigo-600",
                  blue: "text-blue-600",
                };
                return (
                  <div key={option.label} className="border border-gray-200 rounded-xl p-3 text-center">
                    <p className="text-xs font-semibold text-gray-700 mb-1">{option.label}</p>
                    <p className={`text-lg font-bold ${colorMap[option.color]} mb-2`}>
                      {formatRupiah(option.harga)}
                    </p>
                    <p className="text-xs text-gray-400 line-through">{formatRupiah(bundlingResult.hargaNormal)}</p>
                    <div className="mt-2 space-y-0.5 text-xs text-left">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Diskon:</span>
                        <span className="font-medium text-gray-600">{formatRupiah(option.diskon)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Profit:</span>
                        <span className="font-medium text-emerald-600">{formatRupiah(profit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Margin:</span>
                        <span className="font-medium text-gray-700">{option.margin.toFixed(1)}%</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-400 text-left italic leading-tight">
                      "{option.desc}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === "result" && !bundlingResult && (
          <div className="p-5">
            <button
              onClick={() => setStep("select")}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-4"
            >
              ← Kembali
            </button>
            <p className="text-sm text-gray-500">Pilih produk terlebih dahulu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
