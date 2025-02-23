import React, { Suspense } from 'react';
import TotalTaskGraph from './TotalTask';
import TaskNumberOverview from './TaskNumberOverview';
import { Skeleton } from 'primereact/skeleton';
import WeeklyAnalytics from './WeeklyAnalytics';

export const metadata = {
    title: "Dashboard - TaskUp",
};

const Dashboard = async () => {

    return (
        <>
            <section className='grid xl:grid-cols-3 gap-8'>
                <div className='xl:col-span-2 bg-gray-50 dark:bg-[#1f1f1f] text-gray-900 dark:text-white pl-5 md:pl-8 pt-5 md:pt-8 rounded-2xl'>
                    <TaskNumberOverview />
                </div>
                <div className='xl:col-span-1 bg-gray-50 dark:bg-[#1f1f1f] p-4 rounded-2xl'>
                    <TotalTaskGraph />
                </div>
            </section>

            <section className='mt-8'>
                <Suspense fallback={<Skeleton width="100%" height="180px" className='dark:bg-[#1a1a1a] rounded-xl'></Skeleton>}>
                    <WeeklyAnalytics />
                </Suspense>
            </section>
        </>
    );
};

export default Dashboard;
