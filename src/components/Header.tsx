import React from 'react';
import { Database, Plus, FileSpreadsheet, RefreshCw, Fuel, CheckCircle2, AlertCircle, Code2 } from 'lucide-react';

interface HeaderProps {
  companyName: string;
  totalRecords: number;
  lastSyncTime: string | null;
  sheetSource: 'default' | 'googlesheets' | 'custom_csv';
  onOpenSpreadsheetModal: () => void;
  onOpenAppsScriptModal: () => void;
  onOpenAddModal: () => void;
  onExportExcel: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  companyName,
  totalRecords,
  lastSyncTime,
  sheetSource,
  onOpenSpreadsheetModal,
  onOpenAppsScriptModal,
  onOpenAddModal,
  onExportExcel,
  onResetData,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 ring-2 ring-amber-400/30">
              <Fuel className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-white">{companyName}</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  BUNKERING OPS
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Dashboard Aliran BBM & Terkoneksi Spreadsheet</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {sheetSource === 'googlesheets' ? 'Terkoneksi Google Sheets' : 'Dataset Aktif'} ({totalRecords} Baris)
                </span>
                {lastSyncTime && (
                  <>
                    <span>•</span>
                    <span className="text-slate-400">Sinkron: {lastSyncTime}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAppsScriptModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 transition-all shadow-sm cursor-pointer"
              title="Konversi aplikasi ke Google Apps Script (Code.gs & Index.html)"
            >
              <Code2 className="w-4 h-4 text-purple-400" />
              <span>Apps Script (.gs)</span>
            </button>

            <button
              onClick={onOpenSpreadsheetModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 transition-all shadow-sm cursor-pointer"
              title="Koneksikan dengan URL Google Spreadsheet atau upload file"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Koneksi Spreadsheet</span>
            </button>

            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md shadow-blue-900/30 cursor-pointer active:scale-95"
              title="Unduh Laporan Excel otomatis dengan multi-tab"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Excel (.xlsx)</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Transaksi</span>
            </button>

            <button
              onClick={onResetData}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              title="Reset kembali ke data awal bawaan"
              aria-label="Reset Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
