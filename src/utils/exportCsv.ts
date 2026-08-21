/**
 * Utility to export tabular data to CSV with UTF-8 BOM support for Arabic/multilingual characters.
 */
export function exportToCsv<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  columns: { key: keyof T | string; header: string; format?: (val: unknown, row: T) => string | number }[]
) {
  if (!rows || rows.length === 0) {
    alert('No data available to export.');
    return;
  }

  // Header row
  const headerLine = columns.map((col) => `"${col.header.replace(/"/g, '""')}"`).join(',');

  // Data rows
  const dataLines = rows.map((row) => {
    return columns
      .map((col) => {
        let value: unknown;
        if (typeof col.key === 'string' && col.key.includes('.')) {
          // Nested key support
          const keys = col.key.split('.');
          value = keys.reduce<unknown>((obj, k) => (obj && typeof obj === 'object' ? (obj as Record<string, unknown>)[k] : undefined), row);
        } else {
          value = row[col.key as keyof T];
        }

        if (col.format) {
          value = col.format(value, row);
        }

        if (value === null || value === undefined) {
          return '""';
        }

        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      })
      .join(',');
  });

  // UTF-8 BOM (\uFEFF) ensures Excel properly decodes Arabic characters
  const csvContent = '\uFEFF' + [headerLine, ...dataLines].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
