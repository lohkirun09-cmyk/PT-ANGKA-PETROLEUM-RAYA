import React from 'react';
import { ArrowDownRight, ArrowUpRight, ArrowLeftRight, Scale, Gauge, Ship } from 'lucide-react';
import { DashboardMetrics, formatLiter, formatNumber } from '../utils/bunkeringData';

interface KPICardsProps {
  metrics: DashboardMetrics;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. TOTAL MASUK */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">Total Masuk</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          {formatLiter(metrics.totalMasuk)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Inflow Tangki Penerimaan</span>
          <span className="text-emerald-400 font-medium">{metrics.transaksiMasukCount} Pengisian</span>
        </div>
      </div>

      {/* 2. TOTAL KELUAR */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">Total Keluar</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          {formatLiter(metrics.totalKeluar)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Bunkering ke Kapal & Mobil</span>
          <span className="text-amber-400 font-medium">{metrics.transaksiKeluarCount} Distribusi</span>
        </div>
      </div>

      {/* 3. TOTAL KESELURUHAN (MASUK + KELUAR) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-400">Total Keseluruhan</span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          {formatLiter(metrics.totalKeseluruhan)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Total Aliran Masuk + Keluar</span>
          <span className="text-blue-400 font-medium">{metrics.totalTransaksi} Total Transaksi</span>
        </div>
      </div>

      {/* 4. NERACA PERUBAHAN STOK */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-purple-400">Neraca Saldo Stok</span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${metrics.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {metrics.netBalance >= 0 ? '+' : ''}{formatLiter(metrics.netBalance)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Selisih (Masuk - Keluar)</span>
          <span className={`font-semibold ${metrics.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {metrics.netBalance >= 0 ? 'Surplus Masuk' : 'Net Pengeluaran'}
          </span>
        </div>
      </div>
    </div>
  );
};
