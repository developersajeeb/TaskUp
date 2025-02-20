import React, { Suspense } from 'react';
import TotalTaskGraph from './TotalTask';
import TaskNumberOverview from './TaskNumberOverview';
import { getServerSession } from 'next-auth';
import { Skeleton } from 'primereact/skeleton';
import TaskTable from '@/components/TaskTable';

export const metadata = {
    title: "Dashboard - TaskUp",
};

const getTasks = async (userEmail: string | null) => {
    if (!userEmail) return [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks?userEmail=${encodeURIComponent(userEmail)}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error("Failed to load data");
        }

        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
};

const getCompletedTasks = async (userEmail: string | null) => {
    if (!userEmail) return [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/completed?userEmail=${encodeURIComponent(userEmail)}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error("Failed to load data");
        }

        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
};

const getIncompleteTasks = async (userEmail: string | null) => {
    if (!userEmail) return [];
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/incomplete?userEmail=${encodeURIComponent(userEmail)}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error("Failed to load data");
        }

        const { data } = await res.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
};

const Dashboard = async () => {
    const session = await getServerSession();
    const userEmail = session?.user?.email || null;
    const tasks = await getTasks(userEmail);
    const completeTasks = await getCompletedTasks(userEmail);
    const incompleteTasks = await getIncompleteTasks(userEmail);

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

            <section className='mt-12'>
                <TaskTable />
            </section>
        </>
    );
};

export default Dashboard;
