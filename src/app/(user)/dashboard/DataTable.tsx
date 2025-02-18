'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import Link from 'next/link';
import { IoEyeOutline } from 'react-icons/io5';

interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    taskCategory: string;
    status: 'complete' | 'incomplete';
    assignedTo?: string;
}

interface Props {
    tasks: Task[];
    completeTasks: Task[];
    incompleteTasks: Task[];
}

const TaskTable: React.FC<Props> = ({ tasks }) => {
    const [first, setFirst] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 5;

    useEffect(() => {
        setFirst((currentPage - 1) * rowsPerPage);
    }, [currentPage]);

    return (
        <div className="table-scrollbar overflow-x-auto rounded-xl border-x border-b border-gray-200 bg-gray-50 dark:bg-[#1f1f1f]">
            <DataTable 
                value={tasks.slice(first, first + rowsPerPage)}
                dataKey="_id"
                tableStyle={{ minWidth: '75rem' }}
                className="tu-data-table-wrapper"
            >
                <Column field="id" header="ID" className="tu-table-column"></Column>
                <Column field="taskName" header="Name" className="tu-table-column"></Column>
                <Column field="description" header="Description" className="tu-table-column"></Column>
                <Column field="dueDate" header="Due Date" className="tu-table-column"></Column>
                <Column field="priority" header="Priority" className="tu-table-column"></Column>
                <Column field="taskCategory" header="Category" className="tu-table-column"></Column>
                <Column 
                    header="Actions" 
                    className="tu-table-column w-[150px]"
                    body={(rowData: Task) => (
                        <Link href={`#`} className="text-blue-500">
                            <IoEyeOutline size={20} />
                        </Link>
                    )}
                ></Column>
            </DataTable>
            <Paginator
                className="mt-5 w-full text-sm"
                first={first}
                rows={rowsPerPage}
                totalRecords={tasks.length}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                onPageChange={(e) => setCurrentPage(e.page + 1)}
            />
        </div>
    );
};

export default TaskTable;
