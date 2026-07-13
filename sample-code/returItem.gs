function returItem(fakturDetailId, jumlahRetur, keterangan, tanggal) {
  if (!keterangan || String(keterangan).trim() === '') return { success: false, error: 'Keterangan retur wajib diisi.' };
  if (!jumlahRetur || jumlahRetur <= 0) return { success: false, error: 'Jumlah retur harus lebih dari 0.' };

  const detailSheet = getSheet(SHEET_FAKTUR_DETAIL);
  const headers = getHeaders_(SHEET_FAKTUR_DETAIL);
  const idxId = headers.indexOf('FakturDetailID');
  const idxFakturId = headers.indexOf('FakturID');
  const idxProductId = headers.indexOf('ProductID');
  const idxJumlah = headers.indexOf('Jumlah');
  const idxJumlahRetur = headers.indexOf('JumlahRetur');
  const idxStatusRetur = headers.indexOf('StatusRetur');

  const data = detailSheet.getDataRange().getValues();
  let rowIndex = -1, row;
  for (let i = 1; i < data.length; i++) {
    if (data[i][idxId] === fakturDetailId) { rowIndex = i + 1; row = data[i]; break; }
  }
  if (rowIndex === -1) return { success: false, error: 'Item faktur tidak ditemukan.' };

  const fakturId = row[idxFakturId];
  const fakturHeader = getFakturDetail(fakturId).header;
  if (!fakturHeader) return { success: false, error: 'Faktur tidak ditemukan.' };
  if (fakturHeader.Status !== 'Draft') return { success: false, error: 'Faktur sudah Selesai (terkunci). Retur hanya bisa dilakukan selama faktur masih Draft.' };

  const jumlahAsli = Number(row[idxJumlah]);
  const sudahDiretur = Number(row[idxJumlahRetur] || 0);
  const sisaBisaDiretur = jumlahAsli - sudahDiretur;
  if (jumlahRetur > sisaBisaDiretur) return { success: false, error: `Jumlah retur melebihi sisa yang bisa diretur (maks ${sisaBisaDiretur}).` };

  const productId = row[idxProductId];
  const logs = getRows_(SHEET_LOG).filter(l => String(l.RefID) === String(fakturDetailId));

  const batchState = loadBatchState_();
  const restoreResult = fifoRestoreInMemory_(batchState, logs, sudahDiretur, jumlahRetur);
  commitBatchState_(batchState);

  const jumlahReturBaru = sudahDiretur + jumlahRetur;
  detailSheet.getRange(rowIndex, idxJumlahRetur + 1).setValue(jumlahReturBaru);
  detailSheet.getRange(rowIndex, idxStatusRetur + 1).setValue(jumlahReturBaru >= jumlahAsli ? 'Retur Penuh' : 'Retur Sebagian');
  invalidateSheetCache_(SHEET_FAKTUR_DETAIL);

  const returId = 'RET-' + new Date().getTime();
  const returTanggal = tanggal ? formatTglJam_(tanggal) : formatTglJam_(new Date());
  const detailBatchStr = restoreResult.detail.map(d => `${d.batchId}:${d.dikembalikan}`).join(', ');
  appendRowByHeader_(SHEET_RETUR, { ReturID: returId, Tanggal: returTanggal, FakturID: fakturId, FakturDetailID: fakturDetailId, ProductID: productId, JumlahRetur: jumlahRetur, Keterangan: keterangan, DetailBatch: detailBatchStr });

  const totals = recalcFakturTotals_(fakturId);
  return { success: true, stokDikembalikan: restoreResult.restored, detail: restoreResult.detail, totals };
}
