'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { useSession } from 'next-auth/react';
import TableLoader from './TableLoader';
import {fetchTasks } from '@/services/task';

interface TodoItem {
    workDone: boolean;
    todoName: string;
}

interface Task {
    _id: string;
    taskName: string;
    description: string;
    dueDate: string;
    priority: string;
    taskCategory: [];
    todoList: TodoItem[];
}

const ShortTaskTable = () => {
    const { data } = useSession();
    const userEmail = data?.user?.email;
    const [isLoading, seIsLoading] = useState<boolean>(false);
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [first, setFirst] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 5;

    useEffect(() => {
        setFirst((currentPage - 1) * rowsPerPage);
    }, [currentPage]);

    const fetchUserTasks = async () => {
        seIsLoading(true);
        if (!userEmail) return;
        try {
            const data = await fetchTasks(userEmail);
            setTaskList(data || []);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            seIsLoading(false);
        }
    };

    useEffect(() => {
        if (userEmail) {
            fetchUserTasks();
        }
    }, [userEmail]);

    return (
        <div className="table-scrollbar overflow-x-auto rounded-xl dark:bg-[#1f1f1f]">
            {isLoading ? (
                <TableLoader className="w-full" columnNames={['Name', 'Due Date','Status']} />
            ) : (
                <>
                    <DataTable
                        value={taskList.slice(first, first + rowsPerPage)}
                        dataKey="_id"
                        tableStyle={{ minWidth: '50rem' }}
                        className="tu-data-table-wrapper"
                    >
                        <Column
                            header="Name"
                            className="tu-table-column w-[250px]"
                            body={(item: Task) => (
                                <p className="text-sm font-medium text-gray-800 dark:text-white dark:font-normal">{item?.taskName ?? '-'}</p>
                            )}
                        />
                        <Column
                            header="Due Date"
                            className="tu-table-column w-[130px]"
                            body={(item: Task) => (
                                <p className="text-sm text-gray-700 dark:text-white">
                                    {item?.dueDate
                                        ? new Date(item.dueDate).toLocaleDateString('en-US').replace(/\//g, '/')
                                        : 'N/A'
                                    }
                                </p>
                            )}
                        />
                        <Column
                            header="Status"
                            className="tu-table-column w-[130px]"
                            body={(item: Task) => {
                                const isCompleted = item?.todoList?.every(todo => todo.workDone);

                                const status = isCompleted ? "Completed" : "In Progress";

                                return (
                                    <span className={`text-xs font-medium py-1 px-2 rounded-md border ${status === 'Completed' ? 'text-green-500 dark:text-[#46AB7A] bg-green-100 dark:bg-[#1B3C48] border-green-300 dark:border-[#347e5a]' : 'text-[#ce8e3b] dark:text-[#CD9E63] bg-[#fff5df] dark:bg-[#4D3A2A] border-[#f8e197] dark:border-[#8a6a4f]'}`}>
                                        {status}
                                    </span>
                                );
                            }}
                        />
                    </DataTable>
                    <Paginator
                        className="w-full text-sm bg-gray-200 dark:bg-[#181818] rounded-none text-gray-700 dark:text-white"
                        first={first}
                        rows={rowsPerPage}
                        totalRecords={taskList.length}
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        onPageChange={(e) => setCurrentPage(e.page + 1)}
                    />
                </>
            )}
        </div>
    );
};

export default ShortTaskTable;
