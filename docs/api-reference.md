# API Reference

This document outlines the core modules of the dashboard application and their API specifications.

## `src/dashboard/metrics`

This module provides functions for calculating core dashboard metrics.

### `calculateTotal(data: Array<Object>, key: string): number`

Sums the values of a specified key across an array of objects.

**Usage:**

```javascript
const { calculateTotal } = require('./src/dashboard/metrics');

const data = [{ revenue: 100 }, { revenue: 250 }, { revenue: 50 }];
const totalRevenue = calculateTotal(data, 'revenue'); // Returns 400

const emptyTotal = calculateTotal([], 'revenue'); // Returns 0
```

### `calculateGrowth(current: number, previous: number): number`

Calculates the percentage growth between a current and previous value. Handles edge cases like zero previous value.

**Usage:**

```javascript
const { calculateGrowth } = require('./src/dashboard/metrics');

const positiveGrowth = calculateGrowth(150, 100); // Returns 50
const negativeGrowth = calculateGrowth(80, 100); // Returns -20

// Handles zero previous value (returns 100% if current is > 0)
const newGrowth = calculateGrowth(50, 0); // Returns 100
const flatGrowth = calculateGrowth(0, 0); // Returns 0
```

### `fetchMetrics(): Promise<void>`

Fetches the dashboard metrics from the API. The API is expected to respond within 50ms under normal load.

**Usage:**

```javascript
const { fetchMetrics } = require('./src/dashboard/metrics');

await fetchMetrics();
```

## `src/dashboard/layouts`

This module provides utilities for managing dashboard card layouts and responsiveness.

### `getCardDimensions(size: 'small' | 'medium' | 'large' | string): { width: number, height: number }`

Returns the width and height for a given card size.

**Usage:**

```javascript
const { getCardDimensions } = require('./src/dashboard/layouts');

const smallDimensions = getCardDimensions('small'); // { width: 200, height: 150 }
const mediumDimensions = getCardDimensions('medium'); // { width: 400, height: 300 }
const largeDimensions = getCardDimensions('large'); // { width: 800, height: 600 }
const unknownDimensions = getCardDimensions('unknown'); // defaults to { width: 400, height: 300 }
```

### `getResponsiveColumns(width: number): number`

Calculates the number of columns to display based on the available width.

**Usage:**

```javascript
const { getResponsiveColumns } = require('./src/dashboard/layouts');

const cols500 = getResponsiveColumns(500); // Returns 1
const cols800 = getResponsiveColumns(800); // Returns 2
const cols1000 = getResponsiveColumns(1000); // Returns 3
const cols1500 = getResponsiveColumns(1500); // Returns 4
```

## `src/utils/formatters`

This module contains utilities for formatting data for display.

### `formatChartData(data: Array<Object>, xKey: string, yKey: string): Array<{x: any, y: any}>`

Transforms an array of raw data objects into the `{x, y}` format required by charting libraries.

**Usage:**

```javascript
const { formatChartData } = require('./src/utils/formatters');

const rawData = [
    { date: '2023-01', sales: 50, expenses: 30 },
    { date: '2023-02', sales: 70, expenses: 40 }
];

const chartData = formatChartData(rawData, 'date', 'sales');
// Returns:
// [
//     { x: '2023-01', y: 50 },
//     { x: '2023-02', y: 70 }
// ]

// Handles missing keys gracefully
const missingData = formatChartData([{ a: '1' }], 'x', 'y'); // Returns: [{ x: '', y: 0 }]
```

### `formatCurrency(value: number | any, currencyCode: string, locale: string): string`

Formats a number as a currency string according to the specified locale and currency code.

**Usage:**

```javascript
const { formatCurrency } = require('./src/utils/formatters');

const formattedUSD = formatCurrency(1234.56, 'USD', 'en-US'); // Returns '$1,234.56'

// Handles non-numbers gracefully
const formattedInvalid = formatCurrency('abc', 'USD', 'en-US'); // Returns '$0.00'
```
