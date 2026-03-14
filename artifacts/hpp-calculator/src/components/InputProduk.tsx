import type { ProdukTurunan } from "@/types";
import { formatNumber } from "@/lib/calculations";

interface Props {
  items: ProdukTurunan[];
  onChange: (items: ProdukTurunan[]) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2);
}

export default function InputProduk({ items, onChange }: Props) {
  const addItem = () => {
    onChange([
      ...items,
      { id: generateId(), nama: "", qty: 0, satuan: "kg", hargaJual: 0 },
    ]);
  };

  const updateItem = (id: string, field: keyof ProdukTurunan, value: string | number) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Produk Turunan</h3>
      <p className="text-xs text-gray-400 mb-3">
        Input produk jadi dan harga jualnya. Alokasi biaya akan dihitung otomatis.
      </p>

      {items.length > 0 && (
        <div className="hidden sm:grid grid-cols-12 gap-2 mb-1 px-1">
          <span className="col-span-4 text-xs text-gray-400">Nama Produk Jadi</span>
          <span className="col-span-2 text-xs text-gray-400">Qty</span>
          <span className="col-span-2 text-xs text-gray-400">Satuan</span>
          <span className="col-span-3 text-xs text-gray-400">Harga Jual / Satuan</span>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
            <input
              type="text"
              placeholder="Nama produk"
              value={item.nama}
              onChange={(e) => updateItem(item.id, "nama", e.target.value)}
              className="col-span-12 sm:col-span-4 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="number"
              placeholder="Qty"
              value={item.qty || ""}
              onChange={(e) => updateItem(item.id, "qty", parseFloat(e.target.value) || 0)}
              className="col-span-4 sm:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="text"
              placeholder="Satuan"
              value={item.satuan}
              onChange={(e) => updateItem(item.id, "satuan", e.target.value)}
              className="col-span-4 sm:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="text"
              placeholder="Harga jual"
              defaultValue={item.hargaJual > 0 ? formatNumber(item.hargaJual) : ""}
              key={`harga-${item.id}`}
              onBlur={(e) => {
                const num = parseFloat(e.target.value.replace(/\./g, "").replace(",", ".")) || 0;
                updateItem(item.id, "hargaJual", num);
              }}
              className="col-span-3 sm:col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
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
        <span className="text-lg leading-none">+</span> Tambah Produk
      </button>
    </div>
  );
}
