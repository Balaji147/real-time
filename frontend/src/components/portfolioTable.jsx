import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table';

export default function PortfolioTable({ data }) {
  const columns = React.useMemo(() => [
    { accessorKey: 'particulars', header: 'Company' },
    { accessorKey: 'purchasePrice', header: 'Purchase Price' },
    { accessorKey: 'quantity', header: 'Quantity' },
    { accessorKey: 'investment', header: 'Investment' },
    { accessorKey: 'portfolioPercent', header: 'Portfolio %' },
    { accessorKey: 'nseBse', header: 'NSE/BSE Code' },
    { accessorKey: 'cmp', header: 'CMP' },
    { accessorKey: 'presentValue', header: 'Present Value' },
    { accessorKey: 'gainLoss', header: 'Gain/Loss' },
    { accessorKey: 'peRatio', header: 'PE Ratio' },
    { accessorKey: 'latestEarnings', header: 'Latest Earnings' },
  ], []);

  const formattedRows = [];

  Object.entries(data[0]).forEach(([sector, items]) => {
    // Push sector header row
    formattedRows.push({ isSectorHeader: true, sector });

    // Push total row
    formattedRows.push({ isSummary: true, ...items[0] });

    // Push individual company rows
    items.slice(1).forEach(company => {
      formattedRows.push(company);
    });
  });

  const table = useReactTable({
    data: formattedRows,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const formatNumber = (num) => {
    if (typeof num !== 'number') return num;
    return num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 sticky top-0 z-10">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left font-semibold border-b border-gray-300 whitespace-nowrap"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => {
            const original = row.original;

            if (original.isSectorHeader) {
              return (
                <tr key={`sector-${index}`}>
                  <td colSpan={columns.length} className="bg-teal-100 text-teal-800 font-bold px-4 py-2">
                    {original.sector}
                  </td>
                </tr>
              );
            }

            return (
              <tr
                key={row.id}
                className={`${original.isSummary ? 'bg-purple-100 font-bold' : 'hover:bg-gray-50'}`}
              >
                {row.getVisibleCells().map(cell => {
                  const value = cell.getValue();
                  const isGainLossColumn = cell.column.id === 'gainLoss';
                  const isPositive = typeof value === 'number' && value > 0;
                  const isNegative = typeof value === 'number' && value < 0;

                  return (
                    <td
                      key={cell.id}
                      className={`px-4 py-2 border-b border-gray-200 whitespace-nowrap ${
                        original.isSummary ? 'text-purple-800' : ''
                      } ${
                        isGainLossColumn
                          ? isPositive
                            ? 'text-green-600'
                            : isNegative
                              ? 'text-red-600'
                              : ''
                          : ''
                      }`}
                    >
                      {(typeof value === 'number' && cell.column.id !== 'nseBse')
                        ? formatNumber(value)
                        : flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
