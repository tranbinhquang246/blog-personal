import { Table } from '@tanstack/react-table';
import React from 'react';
import Button from './Button';

type Props<T> = {
  table: Table<T>;
};

// const itemToShow = [10, 20, 30, 40, 50];
const Pagination = <T,>({ table }: Props<T>) => {
  return (
    <div className="flex items-center gap-2">
      {/* <Button
        className="border rounded p-1"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}>
        {'First page'}
      </Button> */}
      <Button
        className="border rounded p-1 w-20 h-8"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}>
        {'Previous'}
      </Button>
      <Button className="border rounded p-1 w-8 h-8">
        {table.getState().pagination.pageIndex + 1}
      </Button>
      <Button
        className="border rounded p-1 w-20 h-8"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}>
        {'Next'}
      </Button>
      {/* <Button
        className="border rounded p-1"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}>
        {'Last page'}
      </Button> */}
      {/* <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span> */}
      <span className="flex items-center gap-1">
        | Go to page:
        <input
          type="number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className="border p-1 rounded w-16"
        />
      </span>
      {/* <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}>
        {itemToShow.map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select> */}
    </div>
  );
};

export default Pagination;
