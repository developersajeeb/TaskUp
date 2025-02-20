'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import Link from 'next/link';
import { IoEyeOutline } from 'react-icons/io5';
import TaskDetails from '@/components/TaskDetails';
import { toast } from 'react-toastify';
import { Button } from 'primereact/button';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import EditTaskPopup from '@/components/EditTaskPopup';
import { useSession } from 'next-auth/react';
import TableLoader from './TableLoader';

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

interface TaskDetailsProps {
    _id: string;
    taskName: string;
    description: string;
    dueDate: any;
    priority: string;
    taskCategory: [];
    todoList: TodoItem[];
}

interface Props {
    tasks: Task[];
}

const TaskTable = () => {
    const { data } = useSession();
    const userEmail = data?.user?.email;
    const [isLoading, seIsLoading] = useState<boolean>(false);
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [first, setFirst] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 5;
    const [taskDetailsPopup, setTaskDetailsPopup] = useState<boolean>(false);
    const [taskIdForDetails, setTaskIdForDetails] = useState<string | null>(null);
    const [taskDetails, setTaskDetails] = useState<TaskDetailsProps | null>(null);
    const [isDeleteIconLoading, setDeleteIconLoading] = useState<boolean>(false);
    const [taskEditForm, setTaskEditForm] = useState<{ isOpen: boolean; task: any }>({
        isOpen: false,
        task: null,
    });

    useEffect(() => {
        setFirst((currentPage - 1) * rowsPerPage);
    }, [currentPage]);

    const fetchTasks = async () => {
        seIsLoading(true);
        if (!userEmail) return;
        try {
            const res = await fetch(`/api/tasks?userEmail=${encodeURIComponent(userEmail)}`);
            const data = await res.json();
            setTaskList(data?.data);
            seIsLoading(false);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        if (userEmail) {
            fetchTasks();
        }
    }, [userEmail]);

    const handleDeleteTask = async (taskId: string) => {
        setDeleteIconLoading(true);
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: taskId }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setDeleteIconLoading(false);
                setTaskList(prevTasks => prevTasks.filter(task => task._id !== taskId));
            } else {
                console.error("Error deleting task:", data.message);
                toast.error(data.message);
            }
        } catch (error: any) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
        }
    };

    const handleEditClick = (task: any) => {
        setTaskEditForm({ isOpen: true, task });
    };

    return (
        <div className="table-scrollbar overflow-x-auto rounded-xl dark:bg-[#1f1f1f]">
            {isLoading ? (
                <TableLoader className="w-full" columnNames={['No.', 'Name', 'Due Date', 'Priority', 'Category', 'Status', 'Actions']} />
            ) : (
                <>
                    <DataTable
                        value={taskList.slice(first, first + rowsPerPage)}
                        dataKey="_id"
                        tableStyle={{ minWidth: '75rem' }}
                        className="tu-data-table-wrapper"
                    >
                        <Column
                            header="No."
                            body={(rowData, { rowIndex }) => (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {first + rowIndex + 1}
                                </p>
                            )}
                            className="tu-table-column w-[60px]"
                        />
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
                            header="Priority"
                            className="tu-table-column w-[130px]"
                            body={(item: Task) => (
                                <p className="text-xs text-gray-700 dark:text-white font-medium">
                                    {item?.priority ? (
                                        <span className={`${item.priority === 'Low' ? 'bg-gray-200 dark:bg-[#64646454] px-2 py-1 rounded-md text-gray-500 dark:text-gray-100 border border-gray-300 dark:border-gray-600' :
                                            item.priority === 'Medium' ? 'bg-yellow-100 dark:bg-[#4d4b2a] px-2 py-1 rounded-md text-yellow-700 dark:text-[#cdbd63] border border-yellow-300 dark:border-[#cdb463]' :
                                                item.priority === 'High' ? 'bg-red-200 dark:bg-[#f8285942] px-2 py-1 rounded-md text-red-500 dark:text-[#F8285A] border border-[#f8285a33]' : ''
                                            }`}>
                                            {item.priority}
                                        </span>
                                    ) : (
                                        <span className='text-sm'>N/A</span>
                                    )}
                                </p>
                            )}
                        />
                        <Column
                            header="Category"
                            className="tu-table-column w-[300px]"
                            body={(item: Task) => (
                                item?.taskCategory && Array.isArray(item.taskCategory) && item.taskCategory.length > 0 ? (
                                    <p className="text-sm text-gray-700 dark:text-white w-[300px] truncate">
                                        {item.taskCategory.map((taskCtg: any, index: number) => (
                                            <span
                                                key={`${item._id}-${index}`}
                                                className="inline-block rounded-lg px-2 py-1 bg-[#9C82F8] text-xs font-medium text-white mr-2"
                                            >
                                                {taskCtg}
                                            </span>
                                        ))}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-700 dark:text-white">N/A</p>
                                )
                            )}
                        />
                        <Column
                            header="Status"
                            className="tu-table-column w-[130px]"
                            body={(item: Task) => {
                                const isCompleted = item?.todoList?.length > 0 && item.todoList.every(todo => todo.workDone);
                                const status = isCompleted ? "Completed" : "In Progress";

                                return (
                                    <span className={`text-xs font-medium py-1 px-2 rounded-md border ${status === 'Completed' ? 'text-green-500 dark:text-[#46AB7A] bg-green-100 dark:bg-[#1B3C48] border-green-300 dark:border-[#347e5a]' : 'text-[#ce8e3b] dark:text-[#CD9E63] bg-[#fff5df] dark:bg-[#4D3A2A] border-[#f8e197] dark:border-[#8a6a4f]'}`}>
                                        {status}
                                    </span>
                                );
                            }}
                        />
                        <Column
                            header="Actions"
                            className="tu-table-column w-[150px]"
                            body={(item: Task) => (
                                <div className='flex items-center gap-3'>
                                    <span onClick={() => { setTaskDetailsPopup(true), setTaskIdForDetails(item._id) }} className="text-blue-500 hover:text-[#004A95] duration-300 cursor-pointer inline-block">
                                        <IoEyeOutline size={20} />
                                    </span>
                                    <Button onClick={() => handleDeleteTask(item?._id)} className={`text-red-500 hover:text-red-600 dark:hover:text-red-600 duration-300 cursor-pointer inline-block ${isDeleteIconLoading && 'cursor-wait opacity-50'}`} disabled={isDeleteIconLoading}>
                                        <FiTrash2 size={18} />
                                    </Button>
                                    <span onClick={() => handleEditClick(item)} className="text-blue-500 hover:text-[#004A95] duration-300 cursor-pointer inline-block">
                                        <FiEdit3 size={18} />
                                    </span>
                                </div>
                            )}
                        ></Column>
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
            <TaskDetails taskDetailsPopup={taskDetailsPopup} setTaskDetailsPopup={setTaskDetailsPopup} taskIdForDetails={taskIdForDetails} taskDetails={taskDetails} setTaskDetails={setTaskDetails} />
            <EditTaskPopup taskEditForm={taskEditForm.isOpen} setTaskEditForm={(isOpen) => setTaskEditForm({ isOpen, task: null })} fetchTasks={fetchTasks} task={taskEditForm.task} />
        </div>
    );
};

export default TaskTable;
