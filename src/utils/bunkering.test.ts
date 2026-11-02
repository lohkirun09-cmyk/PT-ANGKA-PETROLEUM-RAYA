import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseBunkeringCSV,
  calculateDashboardMetrics,
  filterRecords,
  convertGoogleSheetUrlToCsvUrl,
  INITIAL_CSV_RAW,
  FilterState
} from './bunkeringData';

test('parseBunkeringCSV correctly parses the user dataset', () => {
  const records = parseBunkeringCSV(INITIAL_CSV_RAW);
  assert.ok(records.length > 50, `Expected > 50 records, got ${records.length}`);

  // Test first record
  const r1 = records[0];
  assert.equal(r1.tanggal, '10/26/2026');
  assert.equal(r1.keterangan, 'BUNKERING A');
  assert.equal(r1.keluar, 6000);
  assert.equal(r1.masuk, 0);
  assert.equal(r1.nomorDn, '16155');
  assert.equal(r1.pt, 'KBT');
  assert.equal(r1.tangki, '3P');
  assert.equal(r1.pengawas, 'DAYAT');
  assert.equal(r1.keteranganKotakan, 'TIDAK KASIH');

  // Test record with masuk (e.g. APR row)
  const aprRecord = records.find(r => r.masuk > 0 && r.pt.includes('APR'));
  assert.ok(aprRecord, 'Should find at least one MASUK record for APR');
  assert.equal(aprRecord.masuk, 16000);
});

test('calculateDashboardMetrics computes accurate totals and Top 5 PT', () => {
  const records = parseBunkeringCSV(INITIAL_CSV_RAW);
  const metrics = calculateDashboardMetrics(records);

  // Check that Masuk and Keluar are positive and greater than 0
  assert.ok(metrics.totalMasuk > 0, `Total Masuk should be > 0, got ${metrics.totalMasuk}`);
  assert.ok(metrics.totalKeluar > 0, `Total Keluar should be > 0, got ${metrics.totalKeluar}`);
  assert.equal(metrics.totalKeseluruhan, metrics.totalMasuk + metrics.totalKeluar);
  assert.equal(metrics.netBalance, metrics.totalMasuk - metrics.totalKeluar);

  // Check Top 5 PT exists and has up to 5 items
  assert.ok(metrics.top5PT.length > 0 && metrics.top5PT.length <= 5);
  // First top PT should have the highest volume keluar
  assert.ok(metrics.top5PT[0].volumeKeluar >= metrics.top5PT[1].volumeKeluar);
  assert.equal(metrics.top5PT[0].pt, 'KBT');

  // Check Top 5 Kotakan
  assert.ok(metrics.top5Kotakan.length > 0 && metrics.top5Kotakan.length <= 5);
  const kotakanLabels = metrics.top5Kotakan.map(k => k.kotakan);
  assert.ok(kotakanLabels.includes('50') || kotakanLabels.includes('25'));

  // Check Kotakan status counts
  const totalKotakanStatus =
    metrics.kotakanStatusSummary.kasih +
    metrics.kotakanStatusSummary.tidakKasih +
    metrics.kotakanStatusSummary.nextTrip +
    metrics.kotakanStatusSummary.unspecified;
  assert.equal(totalKotakanStatus, records.length);
});

test('filterRecords filters accurately by date and supervisor', () => {
  const records = parseBunkeringCSV(INITIAL_CSV_RAW);

  // Filter single date 10/26/2026
  const singleDateFilter: FilterState = {
    startDate: '10/26/2026',
    endDate: '10/26/2026',
    selectedPT: 'ALL',
    selectedPengawas: 'ALL',
    selectedTangki: 'ALL',
    selectedKeterangan: 'ALL',
    selectedKotakan: 'ALL',
    searchQuery: ''
  };

  const filtered = filterRecords(records, singleDateFilter);
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every(r => r.tanggal === '10/26/2026'));

  // Filter by supervisor DAYAT
  const dayatFilter: FilterState = {
    ...singleDateFilter,
    startDate: '',
    endDate: '',
    selectedPengawas: 'DAYAT'
  };
  const dayatRecords = filterRecords(records, dayatFilter);
  assert.ok(dayatRecords.length > 0);
  assert.ok(dayatRecords.every(r => r.pengawas === 'DAYAT'));
});

test('convertGoogleSheetUrlToCsvUrl extracts correct export link', () => {
  const normalUrl = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0';
  const csvUrl = convertGoogleSheetUrlToCsvUrl(normalUrl);
  assert.equal(csvUrl, 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/export?format=csv&gid=0');

  const directCsv = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/export?format=csv';
  assert.equal(convertGoogleSheetUrlToCsvUrl(directCsv), directCsv);
});
