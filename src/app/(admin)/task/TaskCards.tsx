'use client';
import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import { GoTasklist } from 'react-icons/go';
import { TbSubtask } from 'react-icons/tb';
import { BsThreeDots } from 'react-icons/bs';
import { OverlayPanel } from 'primereact/overlaypanel';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import { ProgressBar } from 'primereact/progressbar';
import { LuChartBarStacked } from 'react-icons/lu';
import AddTaskPopup from '@/components/AddTaskPopup';
import { useSession } from 'next-auth/react';

const TaskCards = () => {
    const [taskAddForm, setTaskAddForm] = useState<boolean>(false);
    const editDeletePanel = useRef<OverlayPanel | null>(null);
    const { data } = useSession();
    const [allTasks, setAllTasks] = useState<{ data: any[] } | null>(null);
    const userEmail = data?.user?.email;

    const fetchTasks = async () => {
        if (!userEmail) return;
        try {
            const res = await fetch(`/api/tasks?userEmail=${encodeURIComponent(userEmail)}`);
            const data = await res.json();
            setAllTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [userEmail]);

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

            <section className='grid grid-cols-3 gap-6 mt-10'>
                {
                    allTasks?.data?.map((tasks: any) => {
                        return (
                            <div key={tasks?._id}>
                                <div className='bg-[#dbe8f5] dark:bg-[#36516c] p-5 rounded-xl border-2 border-[#cfe2f5] dark:border-[#486480]'>
                                    <div className='flex gap-2 justify-between'>
                                        <div className='flex gap-2'>
                                            <span className='flex h-9 w-[100%] max-w-[36px] items-center justify-center rounded-full bg-[#004B94] dark:bg-[#233e77] text-white'><TbSubtask size={20} /></span>
                                            <h5 className='text-lg font-medium text-gray-800 dark:text-white'>{tasks?.taskName}</h5>
                                        </div>
                                        <div><span className='cursor-pointer' onClick={(e) => editDeletePanel.current?.toggle(e)}><BsThreeDots size={22} /></span></div>
                                    </div>

                                    <div className='mt-5 mb-8'>
                                        <div className='mb-2 flex items-center gap-4 justify-between'>
                                            <p className='text-xs flex items-center font-medium text-gray-600 dark:text-gray-100'><span><LuChartBarStacked /></span> Progress</p>
                                            <p className='text-xs font-medium text-gray-600 dark:text-gray-100'>2/6</p>
                                        </div>
                                        <ProgressBar className='text-xs bg-white dark:bg-gray-200 h-3' value={50}></ProgressBar>
                                    </div>

                                    <div className='flex flex-wrap gap-3'>
                                        {tasks?.taskCategory?.map((taskCtg: any) => {
                                            return (
                                                <span className='inline-block rounded-lg px-3 py-2 bg-[#9C82F8] text-xs font-medium text-white'>{taskCtg}</span>
                                            )
                                        })}
                                    </div>
                                </div>
                                <OverlayPanel className='dark:bg-[#323232]' ref={editDeletePanel}>
                                    <span className='text-gray-800 dark:text-white hover:text-[#004B93] dark:hover:text-[#004B93] duration-300 cursor-pointer block'><FiEdit3 size={20} /></span>
                                    <span className='text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-500 duration-300 cursor-pointer block mt-3'><FiTrash2 size={20} /></span>
                                </OverlayPanel>
                            </div>
                        )
                    })
                }
            </section>

            <AddTaskPopup taskAddForm={taskAddForm} setTaskAddForm={setTaskAddForm} />
        </>
    );
};

export default TaskCards;