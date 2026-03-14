import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import type { HasilPerhitungan } from "@/types";
import { formatRupiah } from "@/lib/calculations";

Chart.register(...registerables);

interface Props {
  hasil: HasilPerhitungan;
  hargaJual: number;
  targetLaba: number;
  batchPerMonth: number;
}

export default function ChartProfit({ hasil, hargaJual, batchPerMonth }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = ["Hari 1", "Hari 5", "Hari 10", "Hari 15", "Hari 20", "Hari 25", "Hari 30"];
    const days = [1, 5, 10, 15, 20, 25, 30];

    const biayaPerHari = (hasil.totalBiayaProduksi * batchPerMonth) / 30;

    const omzetPerHari =
      hargaJual > 0
        ? hargaJual
        : hasil.totalPotensiPenjualan * batchPerMonth / 30;

    const kondisiRame = days.map((d) => Math.round(omzetPerHari * d * 1.3 - biayaPerHari * d));
    const kondisiTarget = days.map((d) => Math.round(omzetPerHari * d - biayaPerHari * d));
    const kondisiSepi = days.map((d) => Math.round(omzetPerHari * d * 0.6 - biayaPerHari * d));

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Kondisi Rame",
            data: kondisiRame,
            borderColor: "#10b981",
            backgroundColor: "rgba(16,185,129,0.08)",
            tension: 0.4,
            fill: false,
            pointRadius: 4,
            borderWidth: 2,
          },
          {
            label: "Target",
            data: kondisiTarget,
            borderColor: "#6366f1",
            backgroundColor: "rgba(99,102,241,0.08)",
            tension: 0.4,
            fill: false,
            borderDash: [5, 5],
            pointRadius: 4,
            borderWidth: 2,
          },
          {
            label: "Kondisi Sepi",
            data: kondisiSepi,
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245,158,11,0.08)",
            tension: 0.4,
            fill: false,
            pointRadius: 4,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: { font: { size: 12 }, padding: 12 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${formatRupiah(ctx.parsed.y ?? 0)}`,
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => {
                const v = Number(value);
                if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}jt`;
                if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(0)}rb`;
                return String(v);
              },
              font: { size: 11 },
            },
            grid: { color: "rgba(0,0,0,0.05)" },
          },
          x: {
            ticks: { font: { size: 11 } },
            grid: { display: false },
          },
        },
      },
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [hasil, hargaJual, batchPerMonth]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">📈 Grafik Proyeksi Laba 30 Hari</h3>
      <div style={{ height: 260 }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
