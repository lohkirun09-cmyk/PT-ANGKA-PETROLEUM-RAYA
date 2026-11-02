import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Link2,
  Upload,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Download,
  Copy
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { convertGoogleSheetUrlToCsvUrl, parseBunkeringCSV, BunkeringRecord } from '../utils/bunkeringData';

interface SpreadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (records: BunkeringRecord[], source: 'googlesheets' | 'custom_csv', sourceUrl?: string) => void;
  currentSourceUrl?: string;
}

export const SpreadsheetModal: React.FC<SpreadsheetModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  currentSourceUrl = ''
}) => {
  const [sheetUrl, setSheetUrl] = useState<string>(currentSourceUrl);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [autoSync, setAutoSync] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFetchGoogleSheet = async () => {
    if (!sheetUrl.trim()) {
      setErrorMsg('Silakan masukkan URL Google Spreadsheet.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const csvUrl = convertGoogleSheetUrlToCsvUrl(sheetUrl);
      const res = await fetch(csvUrl);
      if (!res.ok) {
        throw new Error(
          `Gagal mengambil data dari Google Spreadsheet (${res.status} ${res.statusText}). Pastikan link Google Sheet disetel: Siapa saja yang memiliki link dapat melihat (Anyone with link can view).`
        );
      }
      const csvText = await res.text();
      const records = parseBunkeringCSV(csvText);

      if (records.length === 0) {
        throw new Error('Data berhasil diambil, tetapi tidak ada baris transaksi valid yang terbaca.');
      }

      setSuccessMsg(`Berhasil menghubungkan dan memuat ${records.length} transaksi dari Google Spreadsheet!`);
      setTimeout(() => {
        onDataLoaded(records, 'googlesheets', sheetUrl);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message ||
        'Gagal menyinkronkan Google Spreadsheet. Pastikan Spreadsheet dapat diakses publik (Share -> Anyone with the link).'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const reader = new FileReader();

    if (file.name.endsWith('.csv')) {
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const records = parseBunkeringCSV(text);
          if (records.length === 0) throw new Error('Tidak ada baris valid pada file CSV.');
          setSuccessMsg(`Berhasil mengimpor ${records.length} baris dari file ${file.name}!`);
          setTimeout(() => {
            onDataLoaded(records, 'custom_csv');
            onClose();
          }, 800);
        } catch (err: any) {
          setErrorMsg(err.message || 'Gagal membaca file CSV.');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    } else {
      // Excel file .xlsx
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const csvText = XLSX.utils.sheet_to_csv(worksheet);
          const records = parseBunkeringCSV(csvText);
          if (records.length === 0) throw new Error('Tidak ada baris transaksi valid pada file Excel.');
          setSuccessMsg(`Berhasil mengimpor ${records.length} baris dari sheet "${firstSheetName}"!`);
          setTimeout(() => {
            onDataLoaded(records, 'custom_csv');
            onClose();
          }, 800);
        } catch (err: any) {
          setErrorMsg(err.message || 'Gagal membaca file Excel.');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const sampleSheetTemplate =
    'https://docs.google.com/spreadsheets/d/1gC-Ue2mZ5y5690bJgD6Q0ZkQjE016n4f8zR_Example/edit#gid=0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Koneksi Google Spreadsheet & File Excel</h3>
            <p className="text-xs text-slate-400">
              Sinkronkan data operasional bunkering langsung dari Google Sheets atau upload file
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <div>{successMsg}</div>
          </div>
        )}

        {/* Option A: Google Spreadsheet Direct Link */}
        <div className="space-y-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-emerald-400" />
              Tautkan URL Google Spreadsheet
            </label>
            <p className="text-[11px] text-slate-400 mb-3">
              Salin link Google Sheet Anda. Pastikan hak akses diatur ke{' '}
              <strong className="text-slate-200">"Siapa saja yang memiliki link"</strong> (General Access: Anyone with the link).
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={sheetUrl}
                onChange={e => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../edit#gid=0"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleFetchGoogleSheet}
                disabled={isLoading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-emerald-950"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>Sinkronkan</span>
              </button>
            </div>
          </div>

          {/* Option B: Local File Upload (Excel .xlsx / .csv) */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              Unggah File Spreadsheet (.xlsx / .csv)
            </label>
            <p className="text-[11px] text-slate-400 mb-3">
              Impor langsung file spreadsheet dari komputer Anda untuk memperbarui data dashboard.
            </p>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-4 cursor-pointer transition-colors bg-slate-900/40">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-medium text-slate-300">Pilih file Excel (.xlsx) atau CSV (.csv)</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Mendukung format kolom standar PT ANGKA PETROLEUM RAYA</span>
              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Format Guide */}
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300 block mb-1">
              Struktur Kolom Spreadsheet yang Didukung:
            </span>
            <div className="text-[10px] font-mono text-slate-400 bg-slate-900/90 p-2 rounded-lg overflow-x-auto whitespace-nowrap border border-slate-800">
              TANGGAL | KETERANGAN | MASUK | KELUAR | NOMOR DN | PT | NAMA KAPAL / MOBIL | TANGKI | TIME START | TIME STOP | FLOW START | FLOW STOP | PENGAWAS | KOTAKAN | KETERANGAN
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
