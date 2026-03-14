import { useState } from "react";
import type { BahanBaku } from "@/types";
import { formatNumber } from "@/lib/calculations";

interface Props {
  items: BahanBaku[];
  onChange: (items: BahanBaku[]) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2);
}

export default function InputBahanBaku({ items, onChange }: Props) {
  const addItem = () => {
    onChange([
      ...items,
      { id: generateId(), nama: "", hargaTotal: 0, jumlah: 0, satuan: "kg" },
    ]);
  };

  const updateItem = (id: string, field: keyof BahanBaku, value: string | number) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleNumberInput = (id: string, field: "hargaTotal" | "jumlah", raw: string) => {
    const num = parseFloat(raw.replace(/\./g, "").replace(",", ".")) || 0;
    updateItem(id, field, num);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Bahan Baku Utama</h3>
      <p className="text-xs text-gray-400 mb-3">Input bahan baku utama yang akan diolah.</p>

      {items.length === 0 && (
        <p className="text-xs text-gray-400 italic mb-3">Belum ada bahan baku.</p>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
            <input
              type="text"
              placeholder="Nama bahan"
              value={item.nama}
              onChange={(e) => updateItem(item.id, "nama", e.target.value)}
              className="col-span-12 sm:col-span-4 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="text"
              placeholder="Harga total"
              defaultValue={item.hargaTotal > 0 ? formatNumber(item.hargaTotal) : ""}
              onBlur={(e) => handleNumberInput(item.id, "hargaTotal", e.target.value)}
              key={`harga-${item.id}`}
              className="col-span-5 sm:col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="number"
              placeholder="Jumlah"
              value={item.jumlah || ""}
              onChange={(e) => updateItem(item.id, "jumlah", parseFloat(e.target.value) || 0)}
              className="col-span-4 sm:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <input
              type="text"
              placeholder="Satuan"
              value={item.satuan}
              onChange={(e) => updateItem(item.id, "satuan", e.target.value)}
              className="col-span-6 sm:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={() => removeItem(item.id)}
              className="col-span-1 sm:col-span-1 text-red-400 hover:text-red-600 flex items-center justify-center text-lg leading-none"
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
        <span className="text-lg leading-none">+</span> Tambah Bahan
      </button>
    </div>
  );
}
