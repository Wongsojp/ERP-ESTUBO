function getStockSummary() {
  const products = getProducts();
  const batches = getBatches();
  return products.map(p => {
    const total = batches.filter(b => b.ProductID === p.ID && b.Status === 'Aktif').reduce((sum, b) => sum + Number(b.SisaStok), 0);
    const stokMinimum = Number(p.StokMinimum || 0);
    return {
      productId: p.ID, nama: p.NamaProduk, satuan: p.Satuan, totalStok: total,
      stokMinimum, menipis: stokMinimum > 0 && total <= stokMinimum
    };
  });
}
