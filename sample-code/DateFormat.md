# Date Formatting Utility

## Overview

Consistent date formatting is essential for ERP systems because multiple modules exchange information using dates and timestamps.

This utility standardizes how dates are displayed and stored throughout the application.

---

## Problem

Different users and systems often use different date formats.

Examples include:

- DD/MM/YYYY
- MM/DD/YYYY
- YYYY-MM-DD

Inconsistent formats can lead to:

- Incorrect sorting
- Invalid comparisons
- Import/export issues
- User confusion

---

## Solution

A centralized date formatting utility converts JavaScript Date objects into a consistent format before storing or displaying them.

This ensures that every ERP module uses the same date representation.

---

## Implementation

The utility:

1. Accepts a Date object.
2. Extracts year, month, day, hour, minute, and second.
3. Adds leading zeros when necessary.
4. Returns a standardized string.

---

## Example Code

```javascript
function formatDate(date) {
  const pad = value => String(value).padStart(2, "0");

  return (
    date.getFullYear() + "-" +
    pad(date.getMonth() + 1) + "-" +
    pad(date.getDate()) + " " +
    pad(date.getHours()) + ":" +
    pad(date.getMinutes()) + ":" +
    pad(date.getSeconds())
  );
}
```

---

## Benefits

- Consistent data formatting
- Easier data comparison
- Reliable sorting
- Better interoperability
- Improved reporting

---

## Future Improvements

- Timezone support
- Localization
- ISO-8601 formatting
- Relative date formatting
