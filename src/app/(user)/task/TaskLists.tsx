'use client';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { GoTasklist } from 'react-icons/go';
import { TbSubtask } from 'react-icons/tb';
import { BsThreeDots } from 'react-icons/bs';
import { FiEdit3, FiSearch, FiTrash2 } from 'react-icons/fi';
import { ProgressBar } from 'primereact/progressbar';
import { LuChartBarStacked } from 'react-icons/lu';
import AddTaskPopup from '@/components/AddTaskPopup';
import { useSession } from 'next-auth/react';
import { FaEye } from 'react-icons/fa';
import { BlockUI } from 'primereact/blockui';
import CommonLoader from '@/components/CommonLoader';
import { toast } from 'react-toastify';
import NoTask from '../../../../public/images/no-task.svg';
import Image from 'next/image';
import EditTaskPopup from '@/components/EditTaskPopup';
import TaskDetails from '@/components/TaskDetails';
import { deleteTask } from '@/services/task';
import DeletePopup from '@/components/DeletePoup';
import { RxGrid } from 'react-icons/rx';
import { IoIosList } from 'react-icons/io';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import TableLoader from '@/components/TableLoader';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IoEyeOutline } from 'react-icons/io5';
import { Paginator } from 'primereact/paginator';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface TodoItem {
    workDone: boolean;
    todoName: string;
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

const TaskLists = () => {
    const [taskAddForm, setTaskAddForm] = useState<boolean>(false);
    const [taskDetailsPopup, setTaskDetailsPopup] = useState<boolean>(false);
    const { data } = useSession();
    const userEmail = data?.user?.email;
    const [allTasks, setAllTasks] = useState<TaskDetailsProps[]>([]);
    const [isDataLoading, setDataLoading] = useState<boolean>(true);
    const [isDataTableLoading, setDataTableLoading] = useState<boolean>(true);
    const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
    const [isDeleteIconLoading, setDeleteIconLoading] = useState<boolean>(false);
    const [taskIdForDetails, setTaskIdForDetails] = useState<string | null>(null);
    const [deletePopup, setDeletePopup] = useState<boolean>(false);
    const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
    const [taskEditForm, setTaskEditForm] = useState<{ isOpen: boolean; task: any }>({
        isOpen: false,
        task: null,
    });
    const [todoLengthProgress, setTodoLengthProgress] = useState<TaskDetailsProps | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { register, handleSubmit, watch } = useForm();
    const [first, setFirst] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 5;
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const priorityOptions = [
        { name: 'Low' },
        { name: 'Medium' },
        { name: 'High' }
    ];

    useEffect(() => {
        setFirst((currentPage - 1) * rowsPerPage);
    }, [currentPage]);

    const fetchUserTasks = async () => {
        if (!userEmail) return;
        setDataLoading(true);
        setDataTableLoading(true);

        const searchQuery = watch('searchQuery') || '';
        const priority = (watch('priority') || '').trim();

        try {
            const queryParams = new URLSearchParams({
                userEmail,
                ...(searchQuery && { taskName: searchQuery }),
                ...(priority && { priority }),
            }).toString();

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/search?${queryParams}`);
            const data = await response.json();

            if (data.success) {
                setAllTasks(data.data || []);
            } else {
                toast.error(data.message || 'Failed to load tasks.');
            }
        } catch (error) {
            console.error('Failed to load tasks:', error);
        } finally {
            setDataLoading(false);
            setDataTableLoading(false);
        }
    };

    const handleDeleteTodo = (index: string) => {
        setDeleteTaskId(index);
        setDeletePopup(true);
    };

    const onConfirmDeleteTodo = async () => {
        if (!deleteTaskId) return;
        setDeleteIconLoading(true);
        try {
            const success = await deleteTask(deleteTaskId);
            if (success) {
                toast.success("Task deleted successfully!");
                setDeletePopup(false);
                await fetchUserTasks();
            } else {
                toast.error("Failed to delete todo.");
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
        } finally {
            setDeletePopup(false);
            setDeleteTaskId(null);
            setDeleteIconLoading(false);
        }
    };

    useEffect(() => {
        if (userEmail) {
            fetchUserTasks();
        }
    }, [userEmail]);

    const toggleOverlay = (taskId: string) => {
        setActiveOverlay((prev) => (prev === taskId ? null : taskId));
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const overlayPanel = document.querySelector('.overly-panel');
            if (overlayPanel && !overlayPanel.contains(event.target as Node)) {
                setActiveOverlay(null);
            }
        };

        document.body.addEventListener('click', handleOutsideClick);

        return () => {
            document.body.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleEditClick = (task: any) => {
        setTaskEditForm({ isOpen: true, task });
    };

    return (
        <>
            <section className='flex flex-wrap justify-between items-center gap-5'>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-white">
                    <span className="flex h-9 w-9 max-w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-slate-800 dark:text-white">
                        <GoTasklist size={22} />
                    </span>
                    Tasks
                </h2>

                <div className='flex flex-wrap gap-4'>
                    <div>
                        <Dropdown value={selectedPriority} onChange={(e: DropdownChangeEvent) => setSelectedPriority(e.value)} options={priorityOptions} optionLabel="name"
                            showClear placeholder="Select a priority" className="tu-dropdown-borderless w-[160px]" />
                    </div>
                    <form className='relative' onSubmit={handleSubmit(fetchUserTasks)}>
                        <InputText placeholder="Search by name" {...register('searchQuery')} className='tu-input w-full !pr-9' />
                        <button type='submit' className='absolute right-2 top-[9px] cursor-pointer'><FiSearch size={20} /></button>
                    </form>

                    <div className='flex items-center'>
                        <span onClick={() => setViewMode('grid')} className={`text-white bg-[#004B93] cursor-pointer py-[10px] px-3 rounded-l-lg ${viewMode === 'grid' && 'bg-[#004c93cf]'}`}><RxGrid size={22} /></span>
                        <span onClick={() => setViewMode('list')} className={`text-white bg-[#004B93] cursor-pointer py-[10px] px-3 rounded-r-lg ${viewMode === 'list' && 'bg-[#004c93cf]'}`}><IoIosList size={22} /></span>
                    </div>
                    <Button
                        label="Add new task"
                        className="primary-btn"
                        onClick={() => setTaskAddForm(true)}
                    />
                </div>
            </section>

            {allTasks?.length === 0 && !isDataTableLoading ? (
                <div className='flex justify-center items-center h-[calc(100vh-180px)]'>
                    <div>
                        <Image className='w-full max-w-[300px] mx-auto' src={NoTask} height='150' width='50' alt='No task' />
                        <p className='text-gray-600 dark:text-gray-100 text-center font-medium text-xl'>No Task Available!</p>
                    </div>
                </div>
            ) : (
                <>
                    {viewMode === 'list' ? (
                        <section className='mt-10 table-scrollbar overflow-x-auto rounded-xl dark:bg-[#1f1f1f]'>
                            {isDataTableLoading ? (
                                <TableLoader className="w-full" columnNames={['No.', 'Name', 'Due Date', 'Priority', 'Category', 'Status', 'Actions']} />
                            ) : (
                                <>
                                    <DataTable
                                        value={allTasks.slice(first, first + rowsPerPage)}
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
                                            body={(item: TaskDetailsProps) => (
                                                <p className="text-sm font-medium text-gray-800 dark:text-white dark:font-normal">{item?.taskName ?? '-'}</p>
                                            )}
                                        />
                                        <Column
                                            header="Due Date"
                                            className="tu-table-column w-[130px]"
                                            body={(item: TaskDetailsProps) => (
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
                                            body={(item: TaskDetailsProps) => (
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
                                            body={(item: TaskDetailsProps) => (
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
                                            body={(item: TaskDetailsProps) => {
                                                const isCurrentTask = todoLengthProgress?._id === item._id;
                                                const isCompleted = isCurrentTask
                                                    ? todoLengthProgress?.todoList?.every(todo => todo.workDone)
                                                    : item?.todoList?.every(todo => todo.workDone);

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
                                            body={(item: TaskDetailsProps) => (
                                                <div className='flex items-center gap-3'>
                                                    <span onClick={() => { setTaskDetailsPopup(true), setTaskIdForDetails(item._id) }} className="text-blue-500 hover:text-[#004A95] duration-300 cursor-pointer inline-block">
                                                        <IoEyeOutline size={20} />
                                                    </span>
                                                    <Button onClick={() => handleDeleteTodo(item?._id)} className={`text-red-500 hover:text-red-600 dark:hover:text-red-600 duration-300 cursor-pointer inline-block focus:shadow-none ${isDeleteIconLoading && 'cursor-wait opacity-50'}`} disabled={isDeleteIconLoading}>
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
                                        totalRecords={allTasks.length}
                                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                                        onPageChange={(e) => setCurrentPage(e.page + 1)}
                                    />
                                </>
                            )}
                        </section>
                    ) : (
                        <BlockUI className="!bg-[#ffffffca] dark:!bg-[#121212e8] w-full !h-[calc(100vh-162px)] !z-[60]" blocked={isDataLoading} template={<CommonLoader />}>
                            <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-7 mt-10">
                                {allTasks?.map((tasks: any) => {
                                    const isCurrentTask = todoLengthProgress?._id === tasks._id;
                                    const isCompleted = isCurrentTask
                                        ? todoLengthProgress?.todoList?.every(todo => todo.workDone)
                                        : tasks?.todoList?.every((todo: { workDone: boolean; }) => todo.workDone);
                                    const status = isCompleted ? "Completed" : "In Progress";

                                    return (
                                        <div key={tasks._id} className={`bg-[#dbe8f5] dark:bg-[#36516c] p-5 rounded-xl border-2 border-[#cfe2f5] dark:border-[#486480] relative overflow-hidden`}>
                                            {tasks?.priority !== null &&
                                                <div className={`absolute transform -rotate-45 text-center text-white font-medium text-[10px] py-1 left-[-30px] top-[8px] w-[100px] shadow-md shadow-[#46464624] ${tasks?.priority === 'Low' && 'bg-gray-400' || tasks?.priority === 'Medium' && 'bg-yellow-500' || tasks?.priority === 'High' && 'bg-red-500'}`}>{tasks?.priority}</div>
                                            }
                                            <div className="flex gap-2 justify-between">
                                                <div className="flex gap-2">
                                                    <span className="flex h-9 w-[36px] max-w-[36px] items-center justify-center rounded-full bg-[#004B94] dark:bg-[#233e77] text-white">
                                                        <TbSubtask size={20} />
                                                    </span>
                                                    <h5 onClick={() => { setTaskDetailsPopup(true), setTaskIdForDetails(tasks._id) }} className="text-lg font-medium text-gray-800 dark:text-white cursor-pointer mt-1">
                                                        {tasks?.taskName}
                                                    </h5>
                                                </div>
                                                <div>
                                                    <span className="cursor-pointer" onClick={() => toggleOverlay(tasks._id)}>
                                                        <BsThreeDots size={22} />
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-5 mb-8">
                                                <div className="mb-2 flex items-center gap-4 justify-between">
                                                    <p className={`text-xs flex items-center gap-1 font-medium border rounded-md py-1 px-2 ${status === 'Completed' ? 'text-green-500 dark:text-[#46AB7A] bg-green-100 dark:bg-[#1B3C48] border-green-300 dark:border-[#347e5a]' : 'text-[#ce8e3b] dark:text-[#CD9E63] bg-[#fff5df] dark:bg-[#4D3A2A] border-[#f8e197] dark:border-[#8a6a4f]'}`}>
                                                        <span>
                                                            <LuChartBarStacked />
                                                        </span>
                                                        <span>{status}</span>
                                                    </p>
                                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-100">
                                                        {todoLengthProgress?._id === tasks?._id && todoLengthProgress?.todoList
                                                            ? `${todoLengthProgress.todoList.filter((todo: { workDone: boolean }) => todo.workDone).length}/${todoLengthProgress.todoList.length}`
                                                            : tasks?.todoList
                                                                ? `${tasks.todoList.filter((task: { workDone: boolean }) => task.workDone).length}/${tasks.todoList.length}`
                                                                : "0/0"}
                                                    </p>
                                                </div>
                                                <ProgressBar
                                                    className="text-xs bg-white dark:bg-gray-200 h-3"
                                                    value={Math.round(
                                                        ((todoLengthProgress?.todoList && todoLengthProgress?._id === tasks?._id
                                                            ? todoLengthProgress.todoList.filter((todo: { workDone: boolean }) => todo.workDone).length
                                                            : tasks?.todoList?.filter((task: { workDone: boolean }) => task.workDone).length || 0
                                                        ) /
                                                            ((todoLengthProgress?.todoList && todoLengthProgress?._id === tasks?._id
                                                                ? todoLengthProgress.todoList.length
                                                                : tasks?.todoList?.length) || 1)) * 100
                                                    )}
                                                >
                                                </ProgressBar>

                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {tasks?.taskCategory?.map((taskCtg: any, index: number) => (
                                                    <span key={`${tasks?._id}-${index}`} className="inline-block rounded-lg px-3 py-2 bg-[#9C82F8] text-xs font-medium text-white">
                                                        {taskCtg}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className={`bg-gray-50 dark:bg-[#323232] absolute right-4 top-12 px-4 pt-3 pb-4 rounded-md shadow transition-opacity duration-300 overly-panel ${activeOverlay === tasks._id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                                <span onClick={() => { setTaskDetailsPopup(true), setTaskIdForDetails(tasks._id) }} className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 duration-300 cursor-pointer block">
                                                    <FaEye size={20} />
                                                </span>
                                                <span onClick={() => handleEditClick(tasks)} className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 duration-300 cursor-pointer block mt-3 mb-4">
                                                    <FiEdit3 size={20} />
                                                </span>
                                                <Button onClick={() => handleDeleteTodo(tasks?._id)} className={`text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-500 duration-300 cursor-pointer focus:shadow-none block ${isDeleteIconLoading && 'cursor-wait opacity-50'}`} disabled={isDeleteIconLoading}>
                                                    <FiTrash2 size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </section>
                        </BlockUI>
                    )}
                </>
            )}

            <DeletePopup deletePopup={deletePopup} setDeletePopup={setDeletePopup} onDelete={onConfirmDeleteTodo} deleteBtnLoading={isDeleteIconLoading} />
            <TaskDetails taskDetailsPopup={taskDetailsPopup} setTaskDetailsPopup={setTaskDetailsPopup} taskIdForDetails={taskIdForDetails} todoLengthProgress={todoLengthProgress} setTodoLengthProgress={setTodoLengthProgress} />
            <AddTaskPopup taskAddForm={taskAddForm} setTaskAddForm={setTaskAddForm} fetchTasks={fetchUserTasks} />
            <EditTaskPopup taskEditForm={taskEditForm.isOpen} setTaskEditForm={(isOpen) => setTaskEditForm({ isOpen, task: null })} fetchUserTasks={fetchUserTasks} task={taskEditForm.task} />
        </>
    );
};

export default TaskLists;