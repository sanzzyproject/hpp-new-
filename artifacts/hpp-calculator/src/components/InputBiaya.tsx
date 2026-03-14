import type { BiayaPengolahan } from "@/types";
import { formatNumber } from "@/lib/calculations";

interface Props {
  items: BiayaPengolahan[];
  onChange: (items: BiayaPengolahan[]) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2);
}

export default function InputBiaya({ items, onChange }: Props) {
  const addItem = () => {
    onChange([
      ...items,
      { id: generateId(), nama: "", harga: 0, periode: "per_batch" },
    ]);
  };

  const updateItem = (id: string, field: keyof BiayaPengolahan, value: string | number) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Biaya Pengolahan</h3>
      <p className="text-xs text-gray-400 mb-3">
        Biaya tambahan untuk mengolah bahan baku (listrik, tenaga kerja, dll).
      </p>

      {items.length > 0 && (
        <div className="hidden sm:grid grid-cols-12 gap-2 mb-1 px-1">
          <span className="col-span-5 text-xs text-gray-400">Nama Biaya</span>
          <span className="col-span-3 text-xs text-gray-400">Harga</span>
          <span className="col-span-3 text-xs text-gray-400">Periode</span>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
            <input
              type="text"
              placeholder="Nama biaya"
              value={item.nama}
              onChange={(e) => updateItem(item.id, "nama", e.target.value)}
              className="col-span-12 sm:col-span-5 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="text"
              placeholder="Harga"
              defaultValue={item.harga > 0 ? formatNumber(item.harga) : ""}
              key={`harga-${item.id}`}
              onBlur={(e) => {
                const num = parseFloat(e.target.value.replace(/\./g, "").replace(",", ".")) || 0;
                updateItem(item.id, "harga", num);
              }}
              className="col-span-6 sm:col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <select
              value={item.periode}
              onChange={(e) => updateItem(item.id, "periode", e.target.value as "per_batch" | "per_bulan")}
              className="col-span-5 sm:col-span-3 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="per_batch">Per Batch</option>
              <option value="per_bulan">Per Bulan</option>
            </select>
            <button
              onClick={() => removeItem(item.id)}
              className="col-span-1 text-red-400 hover:text-red-600 flex items-center justify-center text-lg leading-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="mt-3 flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
      >
        <span className="text-lg leading-none">+</span> Tambah Biaya
      </button>
    </div>
  );
}
