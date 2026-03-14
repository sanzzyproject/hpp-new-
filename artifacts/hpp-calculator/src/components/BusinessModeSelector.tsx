import type { BusinessMode, BusinessModeOption } from "@/types";

const BUSINESS_MODES: BusinessModeOption[] = [
  { id: "iklan_cod", label: "Iklan & COD", icon: "🚚" },
  { id: "marketplace", label: "Marketplace", icon: "🛒" },
  { id: "ritel_fnb", label: "Bisnis Ritel/F&B", icon: "🍳" },
  { id: "manufaktur", label: "Manufaktur / Pabrik", icon: "🏭" },
  { id: "produksi_turunan", label: "Produksi Turunan", icon: "♻️" },
  { id: "produk_jasa", label: "Produk Jasa", icon: "💼" },
];

interface Props {
  selected: BusinessMode | null;
  onSelect: (mode: BusinessMode) => void;
}

export default function BusinessModeSelector({ selected, onSelect }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Pilih Mode Bisnis</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {BUSINESS_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
              selected === mode.id
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:bg-indigo-50/40"
            }`}
          >
            <span className="text-2xl">{mode.icon}</span>
            <span className="text-xs font-medium leading-tight">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
