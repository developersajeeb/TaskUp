import React, { Suspense } from 'react';
import TotalTaskGraph from './TotalTask';
import TaskNumberOverview from './TaskNumberOverview';
import { getServerSession } from 'next-auth';
import { Skeleton } from 'primereact/skeleton';
import TaskTable from '@/components/TaskTable';
import { fetchTasks, getCompletedTasks, getIncompleteTasks } from '@/services/task';

export const metadata = {
    title: "Dashboard - TaskUp",
};

const Dashboard = async () => {
    const session = await getServerSession();
    const userEmail = session?.user?.email || null;

    const tasks = userEmail ? await fetchTasks(userEmail) : [];
    const completeTasks = userEmail ? await getCompletedTasks(userEmail) : [];
    const incompleteTasks = userEmail ? await getIncompleteTasks(userEmail) : [];

    return (
        <>
            <section className='grid xl:grid-cols-3 gap-8'>
                <div className='xl:col-span-2 bg-gray-50 dark:bg-[#1f1f1f] text-gray-900 dark:text-white px-5 md:px-8 pt-5 md:pt-8 rounded-2xl'>
                    <Suspense fallback={<Skeleton width="100%" height="220px" className='dark:bg-[#1a1a1a] rounded-xl'></Skeleton>}>
                        <TaskNumberOverview tasks={tasks} completeTasks={completeTasks} incompleteTasks={incompleteTasks} />
                    </Suspense>
                </div>
                <div className='xl:col-span-1 bg-gray-50 dark:bg-[#1f1f1f] p-4 rounded-2xl'>
                    <Suspense fallback={<Skeleton width="100%" height="100%" className='dark:bg-[#1a1a1a] rounded-xl'></Skeleton>}>
                        <TotalTaskGraph tasks={tasks} completeTasks={completeTasks} incompleteTasks={incompleteTasks} />
                    </Suspense>
                </div>
            </section>

            <section className='mt-8'>
                <TaskTable />
            </section>
        </>
    );
};

export default Dashboard;
