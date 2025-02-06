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
import { FaEye } from 'react-icons/fa';
import { BlockUI } from 'primereact/blockui';
import CommonLoader from '@/components/CommonLoader';

const TaskCards = () => {
    const [taskAddForm, setTaskAddForm] = useState<boolean>(false);
    const editDeletePanel = useRef<OverlayPanel | null>(null);
    const { data } = useSession();
    const [allTasks, setAllTasks] = useState<{ data: any[] } | null>(null);
    const userEmail = data?.user?.email;
    const [isDataLoading, setDataLoading] = useState<boolean>(true);

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
                <section className='grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-10'>
                    {
                        allTasks?.data?.map((tasks: any) => {
                            return (
                                <div key={tasks?._id}>
                                    <div className='bg-[#dbe8f5] dark:bg-[#36516c] p-5 rounded-xl border-2 border-[#cfe2f5] dark:border-[#486480]'>
                                        <div className='flex gap-2 justify-between'>
                                            <div className='flex gap-2'>
                                                <span className='flex h-9 w-[100%] max-w-[36px] items-center justify-center rounded-full bg-[#004B94] dark:bg-[#233e77] text-white'><TbSubtask size={20} /></span>
                                                <h5 className='text-lg font-medium text-gray-800 dark:text-white cursor-pointer'>{tasks?.taskName}</h5>
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
                                            {tasks?.taskCategory?.map((taskCtg: any, index: number) => {
                                                return (
                                                    <span key={index} className='inline-block rounded-lg px-3 py-2 bg-[#9C82F8] text-xs font-medium text-white'>{taskCtg}</span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <OverlayPanel className='dark:bg-[#323232]' ref={editDeletePanel}>
                                        <span className='text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 duration-300 cursor-pointer block'><FaEye size={20} /></span>
                                        <span className='text-gray-800 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 duration-300 cursor-pointer block my-3'><FiEdit3 size={20} /></span>
                                        <span className='text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-500 duration-300 cursor-pointer block'><FiTrash2 size={20} /></span>
                                    </OverlayPanel>
                                </div>
                            )
                        })
                    }
                </section>
            </BlockUI>

            <AddTaskPopup taskAddForm={taskAddForm} setTaskAddForm={setTaskAddForm} />
        </>
    );
};

export default TaskCards;