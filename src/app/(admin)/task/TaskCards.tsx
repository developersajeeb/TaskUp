'use client';
import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import { GoTasklist } from 'react-icons/go';
import { TbSubtask } from 'react-icons/tb';
import { BsThreeDots } from 'react-icons/bs';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import { ProgressBar } from 'primereact/progressbar';
import { LuChartBarStacked } from 'react-icons/lu';
import AddTaskPopup from '@/components/AddTaskPopup';
import { useSession } from 'next-auth/react';
import { FaEye } from 'react-icons/fa';
import { BlockUI } from 'primereact/blockui';
import CommonLoader from '@/components/CommonLoader';
import { toast } from 'react-toastify';
import NoTask from '../../../../public/images/no-task.png';
import Image from 'next/image';

const TaskCards = () => {
    const [taskAddForm, setTaskAddForm] = useState<boolean>(false);
    const { data } = useSession();
    const [allTasks, setAllTasks] = useState<{ data: any[] } | null>(null);
    const userEmail = data?.user?.email;
    const [isDataLoading, setDataLoading] = useState<boolean>(true);
    const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
    const [isDeleteIconLoading, setDeleteIconLoading] = useState<boolean>(false);

    const fetchTasks = async () => {
        setDataLoading(true);
        if (!userEmail) return;
        try {
            const res = await fetch(`/api/tasks?userEmail=${encodeURIComponent(userEmail)}`);
            const data = await res.json();
            setAllTasks(data);
            setDataLoading(false);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setDataLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
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
                fetchTasks();
            } else {
                console.error("Error deleting task:", data.message);
                toast.error(data.message);
            }
        } catch (error: any) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
        }
    };

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

    return (
        <>
            <section className='flex justify-between items-center gap-5'>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-white">
                    <span className="flex h-9 w-9 max-w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-slate-800 dark:text-white">
                        <GoTasklist size={22} />
                    </span>
                    Tasks
                </h2>

                <Button
                    label="Add new task"
                    className="primary-btn"
                    onClick={() => setTaskAddForm(true)}
                />
            </section>

            <BlockUI className="!fixed !bg-[#121212e8] h-screen" blocked={isDataLoading} template={<CommonLoader />}>
                {allTasks?.data?.length === 0 ? (
                    <div className='flex justify-center items-center h-[calc(100vh-180px)]'>
                        <div>
                            <Image className='w-full max-w-24 mx-auto' src={NoTask} height='150' width='50' alt='No task' />
                            <p className='text-gray-600 dark:text-gray-100 text-center mt-4 font-semibold text-xl'>No Task Available!</p>
                        </div>
                    </div>
                ) : (
                    <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-7 mt-10">
                        {allTasks?.data?.map((tasks: any) => {
                            return (
                                <div key={tasks._id} className={`bg-[#dbe8f5] dark:bg-[#36516c] p-5 rounded-xl border-2 border-[#cfe2f5] dark:border-[#486480] relative`}>
                                    <div className="flex gap-2 justify-between">
                                        <div className="flex gap-2">
                                            <span className="flex h-9 w-[36px] max-w-[36px] items-center justify-center rounded-full bg-[#004B94] dark:bg-[#233e77] text-white">
                                                <TbSubtask size={20} />
                                            </span>
                                            <h5 className="text-lg font-medium text-gray-800 dark:text-white cursor-pointer mt-1">
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
                                            <p className="text-xs flex items-center font-medium text-gray-600 dark:text-gray-100">
                                                <span>
                                                    <LuChartBarStacked />
                                                </span>{" "}
                                                Progress
                                            </p>
                                            <p className="text-xs font-medium text-gray-600 dark:text-gray-100">2/6</p>
                                        </div>
                                        <ProgressBar className="text-xs bg-white dark:bg-gray-200 h-3" value={50}></ProgressBar>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {tasks?.taskCategory?.map((taskCtg: any, index: number) => (
                                            <span key={`${tasks?._id}-${index}`} className="inline-block rounded-lg px-3 py-2 bg-[#9C82F8] text-xs font-medium text-white">
                                                {taskCtg}
                                            </span>
                                        ))}
                                    </div>

                                    <div className={`bg-gray-50 dark:bg-[#323232] absolute right-4 top-12 px-4 pt-3 pb-4 rounded-md shadow transition-opacity duration-300 overly-panel ${activeOverlay === tasks._id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                        <span className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 duration-300 cursor-pointer block">
                                            <FaEye size={20} />
                                        </span>
                                        <span className="text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 duration-300 cursor-pointer block mt-3 mb-4">
                                            <FiEdit3 size={20} />
                                        </span>
                                        <Button className={`text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-500 duration-300 cursor-pointer block ${isDeleteIconLoading && 'cursor-wait opacity-50'}`} onClick={() => handleDeleteTask(tasks?._id)} disabled={isDeleteIconLoading}>
                                            <FiTrash2 size={20} />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </section>
                )}
            </BlockUI>

            <AddTaskPopup taskAddForm={taskAddForm} setTaskAddForm={setTaskAddForm} fetchTasks={fetchTasks} />
        </>
    );
};

export default TaskCards;