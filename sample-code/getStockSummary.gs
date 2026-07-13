# Inventory Summary

## Overview

The Inventory Summary module provides a real-time overview of product stock levels by aggregating inventory transactions from multiple production batches.

Instead of manually calculating stock balances, the system automatically summarizes incoming and outgoing quantities for each product, ensuring accurate inventory visibility.

---

## Problem

Managing inventory manually often results in:

- Incorrect stock balances
- Duplicate calculations
- Slow reporting
- Difficulty tracking available stock

As the number of transactions increases, generating an accurate inventory report becomes increasingly time-consuming.
---

## Solution

The Inventory Summary module automatically calculates current inventory by processing all inventory transactions and grouping them by product.

The calculation includes:

- Total Incoming Quantity
- Total Outgoing Quantity
- Remaining Stock
- Batch Availability

The result is displayed in a summary table that can be used by other ERP modules.

---

## Implementation

The implementation follows these steps:

1. Read inventory transaction data.
2. Group transactions by product.
3. Sum incoming quantities.
4. Sum outgoing quantities.
5. Calculate remaining stock.
6. Generate summary data.

---

## Example Code

```javascript
function getInventorySummary(transactions) {
  const summary = {};

  transactions.forEach(item => {
    if (!summary[item.product]) {
      summary[item.product] = {
        incoming: 0,
        outgoing: 0
      };
    }

    summary[item.product].incoming += item.incoming;
    summary[item.product].outgoing += item.outgoing;
  });

  Object.keys(summary).forEach(product => {
    summary[product].remaining =
      summary[product].incoming -
      summary[product].outgoing;
  });

  return summary;
}
```
