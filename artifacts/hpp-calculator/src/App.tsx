import { useState } from "react";
import type { BusinessMode, BahanBaku, BiayaPengolahan, ProdukTurunan, HasilPerhitungan, Calculation } from "@/types";
import BusinessModeSelector from "@/components/BusinessModeSelector";
import InputBahanBaku from "@/components/InputBahanBaku";
import InputBiaya from "@/components/InputBiaya";
import InputProduk from "@/components/InputProduk";
import HPPResult from "@/components/HPPResult";
import ProfitProjection from "@/components/ProfitProjection";
import ChartProfit from "@/components/ChartProfit";
import BundlingCalculator from "@/components/BundlingCalculator";
import HistoryPanel from "@/components/HistoryPanel";
import { hitungHPP } from "@/lib/calculations";
import { saveCalculation } from "@/lib/db";
import { exportToExcel } from "@/lib/export";

function generateId() {
  return Math.random().toString(36).slice(2);
}

const DEFAULT_BAHAN_BAKU: BahanBaku[] = [
  { id: generateId(), nama: "Kelapa Utuh", hargaTotal: 15000000, jumlah: 1000, satuan: "kg" },
];

const DEFAULT_BIAYA: BiayaPengolahan[] = [
  { id: generateId(), nama: "Upah Tenaga Pengupasan", harga: 150000, periode: "per_batch" },
  { id: generateId(), nama: "Biaya Operasional Mesin", harga: 200000, periode: "per_batch" },
  { id: generateId(), nama: "Biaya Pengemasan", harga: 100000, periode: "per_batch" },
];

const DEFAULT_PRODUK: ProdukTurunan[] = [
  { id: generateId(), nama: "Santan Kelapa", qty: 300, satuan: "kg", hargaJual: 20000 },
  { id: generateId(), nama: "Daging Kelapa Parut", qty: 300, satuan: "kg", hargaJual: 25000 },
  { id: generateId(), nama: "Minyak Kelapa Murni (VCO)", qty: 150, satuan: "kg", hargaJual: 50000 },
  { id: generateId(), nama: "Air Kelapa Kemasan", qty: 250, satuan: "kg", hargaJual: 10000 },
  { id: generateId(), nama: "Sabut Kelapa Kering", qty: 100, satuan: "kg", hargaJual: 5000 },
];

export default function App() {
  const [businessMode, setBusinessMode] = useState<BusinessMode | null>("produksi_turunan");
  const [businessName, setBusinessName] = useState("Pengolahan Kelapa");
  const [batchPerMonth, setBatchPerMonth] = useState(1);
  const [bahanBaku, setBahanBaku] = useState<BahanBaku[]>(DEFAULT_BAHAN_BAKU);
  const [biayaPengolahan, setBiayaPengolahan] = useState<BiayaPengolahan[]>(DEFAULT_BIAYA);
  const [produkTurunan, setProdukTurunan] = useState<ProdukTurunan[]>(DEFAULT_PRODUK);
  const [hasil, setHasil] = useState<HasilPerhitungan | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showBundling, setShowBundling] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [targetLaba, setTargetLaba] = useState(0);
  const [hargaJual, setHargaJual] = useState(0);

  const handleHitung = () => {
    if (produkTurunan.length === 0) {
      alert("Tambahkan minimal 1 produk turunan.");
      return;
    }
    const h = hitungHPP(bahanBaku, biayaPengolahan, produkTurunan, batchPerMonth);
    setHasil(h);
    setTimeout(() => {
      document.getElementById("hasil-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSave = async () => {
    if (!hasil) { alert("Hitung HPP terlebih dahulu."); return; }
    setSaving(true);
    try {
      await saveCalculation({
        businessName,
        businessMode: businessMode || "produksi_turunan",
        batchPerMonth,
        bahanBaku,
        biayaPengolahan,
        produkTurunan,
        hasilPerhitungan: hasil,
        bundling: [],
        createdAt: Date.now(),
      });
      setSaveMsg("✅ Perhitungan berhasil disimpan!");
    } catch (e) {
      setSaveMsg("❌ Gagal menyimpan. Coba lagi.");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleExport = () => {
    if (!hasil) { alert("Hitung HPP terlebih dahulu."); return; }
    exportToExcel({
      businessName,
      businessMode: businessMode || "produksi_turunan",
      batchPerMonth,
      bahanBaku,
      biayaPengolahan,
      produkTurunan,
      hasilPerhitungan: hasil,
      bundling: [],
      createdAt: Date.now(),
    });
  };

  const handleLoadHistory = (calc: Calculation) => {
    setBusinessName(calc.businessName);
    setBusinessMode(calc.businessMode as BusinessMode);
    setBatchPerMonth(calc.batchPerMonth);
    setBahanBaku(calc.bahanBaku.map((b) => ({ ...b, id: b.id || generateId() })));
    setBiayaPengolahan(calc.biayaPengolahan.map((b) => ({ ...b, id: (b as any).id || generateId() })));
    setProdukTurunan(calc.produkTurunan.map((p) => ({ ...p, id: (p as any).id || generateId() })));
    setHasil(calc.hasilPerhitungan);
  };

  const handleReset = () => {
    if (!confirm("Reset semua data?")) return;
    setBusinessMode(null);
    setBusinessName("");
    setBatchPerMonth(1);
    setBahanBaku([]);
    setBiayaPengolahan([]);
    setProdukTurunan([]);
    setHasil(null);
    setTargetLaba(0);
    setHargaJual(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <div>
              <h1 className="text-base font-bold text-gray-800 leading-tight">Kalkulator HPP Bisnis</h1>
              <p className="text-xs text-gray-400 hidden sm:block">Hitung Harga Pokok Produksi secara otomatis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBundling(true)}
              className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-lg transition-colors"
            >
              <span>🎁</span>
              <span className="hidden sm:inline">Bundling Cerdas</span>
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
            >
              <span>🕒</span>
              <span className="hidden sm:inline">Riwayat</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <BusinessModeSelector selected={businessMode} onSelect={setBusinessMode} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-semibold text-gray-800">Input Data</h2>
                <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600">Reset</button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Bisnis / Produk Utama
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Contoh: Pengolahan Kelapa"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Batch Produksi per Bulan{" "}
                  <span className="text-xs text-gray-400 font-normal ml-1">ⓘ</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={batchPerMonth}
                  onChange={(e) => setBatchPerMonth(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Digunakan untuk mengalokasikan biaya bulanan ke setiap batch produksi.
                </p>
              </div>

              <hr className="border-gray-100" />

              <InputBahanBaku items={bahanBaku} onChange={setBahanBaku} />

              <hr className="border-gray-100" />

              <InputBiaya items={biayaPengolahan} onChange={setBiayaPengolahan} />

              <hr className="border-gray-100" />

              <InputProduk items={produkTurunan} onChange={setProdukTurunan} />

              <button
                onClick={handleHitung}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2"
              >
                📐 Hitung HPP
              </button>
            </div>
          </div>

          <div id="hasil-section" className="space-y-5">
            {!hasil ? (
              <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-200 p-8 text-center">
                <div className="text-5xl mb-3">🧮</div>
                <h3 className="text-base font-semibold text-gray-600 mb-1">Belum ada hasil perhitungan</h3>
                <p className="text-sm text-gray-400">
                  Lengkapi form di sebelah kiri, lalu klik <strong>Hitung HPP</strong>.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-800">Hasil Perhitungan</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowBundling(true)}
                      className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                    >
                      <span>🎁</span> Bundling Cerdas
                    </button>
                    <button
                      onClick={() => setShowHistory(true)}
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
                    >
                      <span>🕒</span> Riwayat
                    </button>
                  </div>
                </div>

                <HPPResult hasil={hasil} produkTurunan={produkTurunan} />

                <ProfitProjection
                  hasil={hasil}
                  batchPerMonth={batchPerMonth}
                  targetLaba={targetLaba}
                  hargaJual={hargaJual}
                  onTargetLabaChange={setTargetLaba}
                  onHargaJualChange={setHargaJual}
                />

                <ChartProfit
                  hasil={hasil}
                  hargaJual={hargaJual}
                  targetLaba={targetLaba}
                  batchPerMonth={batchPerMonth}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    💾 {saving ? "Menyimpan..." : "Simpan Perhitungan"}
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    📥 Export Excel
                  </button>
                </div>

                {saveMsg && (
                  <div className={`text-sm text-center py-2 rounded-lg ${saveMsg.startsWith("✅") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                    {saveMsg}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {showBundling && hasil && (
        <BundlingCalculator
          produkTurunan={produkTurunan}
          hppPerProduk={hasil.hppPerProduk}
          onClose={() => setShowBundling(false)}
        />
      )}

      {showBundling && !hasil && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <p className="text-gray-600 mb-4">Hitung HPP terlebih dahulu sebelum membuat bundling.</p>
            <button onClick={() => setShowBundling(false)} className="bg-indigo-600 text-white px-5 py-2 rounded-lg">OK</button>
          </div>
        </div>
      )}

      {showHistory && (
        <HistoryPanel
          onLoad={handleLoadHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      <footer className="border-t border-gray-100 py-4 text-center text-xs text-gray-400 mt-8">
        Kalkulator HPP Bisnis · Data disimpan secara lokal di perangkat Anda
      </footer>
    </div>
  );
}
