'use client';
import { useSession } from 'next-auth/react';
import React, { Suspense } from 'react';
import ManWork from '../../../../public/images/man-working-on-laptop.png';
import { GoTasklist } from 'react-icons/go';
import { RiProgress2Line } from 'react-icons/ri';
import { CgGoogleTasks } from 'react-icons/cg';

interface Props {
    tasks: [];
    completeTasks: [];
    incompleteTasks: [];
}

const TaskNumberOverview = ({ tasks, completeTasks, incompleteTasks }: Props) => {
    const session = useSession();

    return (
        <div className='pb-8 bg-no-repeat bg-contain bg-right-bottom' style={{ backgroundImage: `url(${ManWork.src})` }}>
            <h1 className='text-2xl font-medium'>Welcome, {session?.data?.user?.name}</h1>
            <p className='mt-1 text-sm'>All tasks overview</p>

            <div className='flex gap-2 items-center mt-6'>
                <span className="flex h-11 w-11 max-w-11 items-center justify-center rounded-full bg-[#DEFEF3] dark:bg-[#1B3C48] text-[#58D08B] dark:text-[#46AB7A] ">
                    <GoTasklist size={24} />
                </span>
                <div>
                    <h3 className="text-sm leading-0 font-medium text-gray-600 dark:text-white">Total Tasks</h3>
                    <p className='text-xl leading-0 font-semibold text-gray-800 dark:text-white'>{tasks?.length || 0}</p>
                </div>
            </div>
            <div className='flex gap-2 items-center mt-5'>
                <span className="flex h-11 w-11 max-w-11 items-center justify-center rounded-full bg-[#fff1e0] dark:bg-[#4D3A2A] text-[#fac785] dark:text-[#CD9E63] ">
                    <RiProgress2Line size={24} />
                </span>
                <div>
                    <h3 className="text-sm leading-0 font-medium text-gray-600 dark:text-white">In Progress</h3>
                    <p className='text-xl leading-0 font-semibold text-gray-800 dark:text-white'>{incompleteTasks?.length || 0}</p>
                </div>
            </div>
            <div className='flex gap-2 items-center mt-5'>
                <span className="flex h-11 w-11 max-w-11 items-center justify-center rounded-full bg-[#eae5fc] dark:bg-[#50437c] text-[#9C82FA] dark:text-[#977fee] ">
                    <CgGoogleTasks size={24} />
                </span>
                <div>
                    <h3 className="text-sm leading-0 font-medium text-gray-600 dark:text-white">Completed</h3>
                    <p className='text-xl leading-0 font-semibold text-gray-800 dark:text-white'>{completeTasks?.length || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default TaskNumberOverview;