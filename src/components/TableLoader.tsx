'use client';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';

import React from 'react';
interface Props {
  columnNames: string[];
  className?: string;
}
export default function TableLoader({ columnNames, className = 'my-2' }: Props) {
  const items = [{ id: 'value' }];
  return (
    <DataTable className="tu-data-table-wrapper" value={items} dataKey="id">
      {columnNames.map((columnName) => (
        <Column
          header={columnName}
          className="tu-table-column w-[220px] max-w-[220px]"
          body={<Skeleton className='dark:bg-[#1a1a1a]'></Skeleton>}
          key={columnName}
        ></Column>
      ))}
    </DataTable>
  );
}
