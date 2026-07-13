# FIFO Allocation Algorithm

## Problem

When a customer purchases ice, the oldest stock must be deducted first.

## Solution

The algorithm sorts all active batches by production date and deducts quantities sequentially until the requested quantity is fulfilled.

```javascript
// 60–80 lines of simplified FIFO code
```

## Result

- Automatic stock allocation
- No manual batch selection
- Accurate inventory tracking


function fifoDeductInMemory_(state, productId, jumlah) {
  const { data, idx } = state;
  let rows = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][idx.ProductID] === productId && Number(data[i][idx.SisaStok]) > 0) {
      rows.push({ i, tgl: data[i][idx.TanggalProduksi], batchId: data[i][idx.BatchID] });
    }
  }
  rows.sort((a, b) => parseTglJam_(a.tgl) - parseTglJam_(b.tgl));

  let sisaDiambil = jumlah;
  const detail = [];
  for (const r of rows) {
    if (sisaDiambil <= 0) break;
    const cur = Number(data[r.i][idx.SisaStok]);
    const ambil = Math.min(cur, sisaDiambil);
    const sisaBaru = cur - ambil;
    data[r.i][idx.SisaStok] = sisaBaru;
    data[r.i][idx.Status] = sisaBaru === 0 ? 'Habis' : 'Aktif';
    state.dirty = true;
    detail.push({ batchId: r.batchId, diambil: ambil });
    sisaDiambil -= ambil;
  }
  if (sisaDiambil > 0) return { success: false, error: `Stok tidak cukup untuk ${productId}. Kurang ${sisaDiambil} unit.`, detail };
  return { success: true, detail };
}

function fifoRestoreInMemory_(state, logs, alreadyReturned, jumlahRetur) {
  const { data, idx } = state;
  const reversed = logs.slice().reverse();
  let toSkip = alreadyReturned;
  let toRestore = jumlahRetur;
  const detail = [];

  for (const entry of reversed) {
    if (toRestore <= 0) break;
    const qty = Number(entry.JumlahDiambil);
    if (toSkip >= qty) { toSkip -= qty; continue; }
    const available = qty - toSkip;
    toSkip = 0;
    const restoreNow = Math.min(available, toRestore);

    for (let i = 1; i < data.length; i++) {
      if (data[i][idx.BatchID] === entry.BatchID) {
        data[i][idx.SisaStok] = Number(data[i][idx.SisaStok]) + restoreNow;
        data[i][idx.Status] = 'Aktif';
        state.dirty = true;
        break;
      }
    }
    detail.push({ batchId: entry.BatchID, dikembalikan: restoreNow });
    toRestore -= restoreNow;
  }
  return { restored: detail.length > 0, detail };
}
