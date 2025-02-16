import React from 'react';
import TotalTaskGraph from './TotalTask';
import TaskNumberOverview from './TaskNumberOverview';
import { getServerSession } from 'next-auth';

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

const Dashboard = async () => {
    const session = await getServerSession();
    const userEmail = session?.user?.email || null;

    const tasks = await getTasks(userEmail);
    // console.log(tasks);
    

    return (
        <>
            <section className='grid xl:grid-cols-3 gap-8'>
                <div className='xl:col-span-2 bg-gray-50 dark:bg-[#1f1f1f] text-gray-900 dark:text-white px-5 md:px-8 pt-5 md:pt-8 rounded-2xl'>
                    <TaskNumberOverview />
                </div>
                <div className='xl:col-span-1 bg-gray-50 dark:bg-[#1f1f1f] p-4 rounded-2xl'>
                    <TotalTaskGraph />
                </div>
            </section>

            <section className='bg-gray-50 dark:bg-[#1f1f1f] rounded-2xl'></section>
        </>
    );
};

export default Dashboard;
