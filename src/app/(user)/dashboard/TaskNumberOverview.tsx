'use client';
import { useSession } from 'next-auth/react';
import React, { Suspense, useEffect, useState } from 'react';
import ManWork from '../../../../public/images/man-working-on-laptop.png';
import { GoTasklist } from 'react-icons/go';
import { RiProgress2Line } from 'react-icons/ri';
import { CgGoogleTasks } from 'react-icons/cg';
import { fetchTasks, getCompletedTasks, getIncompleteTasks } from '@/services/task';
import { Skeleton } from 'primereact/skeleton';

const TaskNumberOverview = () => {
    const { data: session } = useSession();
    const userEmail = session?.user?.email;
    const [tasks, setTasks] = useState<[]>([]);
    const [completeTasks, setCompleteTasks] = useState<[]>([]);
    const [incompleteTasks, setIncompleteTasks] = useState<[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadTasks = async () => {
            setIsLoading(true);
            if (userEmail) {
                try {
                    const allTasks = await fetchTasks(userEmail);
                    const completed = await getCompletedTasks(userEmail);
                    const incomplete = await getIncompleteTasks(userEmail);
                    setTasks(allTasks);
                    setCompleteTasks(completed);
                    setIncompleteTasks(incomplete);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Failed to fetch tasks:', error);
                    setIsLoading(false);
                }
            }
        };

        loadTasks();
    }, [userEmail]);

    return (
        <div className='pr-5 pb-8 md:pr-8 bg-no-repeat bg-contain bg-right-bottom rounded-2xl' style={{ backgroundImage: `url(${ManWork.src})` }}>
            <h1 className='text-2xl font-medium'>Welcome, {session?.user?.name}</h1>
            <p className='mt-1 text-sm'>All tasks overview</p>

            <div className='flex gap-2 items-center mt-6'>
                <span className="flex h-11 w-11 max-w-11 items-center justify-center rounded-full bg-[#eae5fc] dark:bg-[#50437c] text-[#9C82FA] dark:text-[#977fee]">
                    <GoTasklist size={24} />
                </span>
                <div>
                    <h3 className="text-sm leading-0 font-medium text-gray-600 dark:text-white">Total Tasks</h3>
                    {isLoading ?
                        <Skeleton width="40px" height="30px" className='dark:bg-[#1a1a1a] rounded-lg mt-2'></Skeleton>
                        :
                        <p className='text-xl leading-0 font-semibold text-gray-800 dark:text-white'>{tasks?.length || 0}</p>
                    }
                </div>
            </div>
            <div className='flex gap-2 items-center mt-5'>
                <span className="flex h-11 w-11 max-w-11 items-center justify-center rounded-full bg-[#fff1e0] dark:bg-[#4D3A2A] text-[#fac785] dark:text-[#CD9E63]">
                    <RiProgress2Line size={24} />
                </span>
                <div>
                    <h3 className="text-sm leading-0 font-medium text-gray-600 dark:text-white">In Progress</h3>
                    {isLoading ?
                        <Skeleton width="40px" height="30px" className='dark:bg-[#1a1a1a] rounded-lg mt-2'></Skeleton>
                        :
                        <p className='text-xl leading-0 font-semibold text-gray-800 dark:text-white'>{incompleteTasks?.length || 0}</p>
                    }
                </div>
            </div>
            <div className='flex gap-2 items-center mt-5'>
                <span className="flex h-11 w-11 max-w-11 items-center justify-center rounded-full bg-[#DEFEF3] dark:bg-[#1B3C48] text-[#58D08B] dark:text-[#46AB7A]">
                    <CgGoogleTasks size={24} />
                </span>
                <div>
                    <h3 className="text-sm leading-0 font-medium text-gray-600 dark:text-white">Completed</h3>
                    {isLoading ?
                        <Skeleton width="40px" height="30px" className='dark:bg-[#1a1a1a] rounded-lg mt-2'></Skeleton>
                        :
                        <p className='text-xl leading-0 font-semibold text-gray-800 dark:text-white'>{completeTasks?.length || 0}</p>
                    }
                </div>
            </div>
        </div>
    );
};

export default TaskNumberOverview;