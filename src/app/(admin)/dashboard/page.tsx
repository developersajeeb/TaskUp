import React from 'react';
import TotalTaskGraph from './TotalTask';
import TaskNumberOverview from './TaskNumberOverview';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Dashboard - TaskUp",
  };

const Dashboard = () => {
    return (
        <>
            <section className='grid xl:grid-cols-3 gap-8'>
                <div className='xl:col-span-2 bg-gray-50 dark:bg-[#1f1f1f] text-gray-900 dark:text-white px-5 md:px-8 pt-5 md:pt-8 rounded-2xl'><TaskNumberOverview /></div>
                <div className='xl:col-span-1 bg-gray-50 dark:bg-[#1f1f1f] p-4 rounded-2xl'><TotalTaskGraph /></div>
            </section>

            <section className='bg-gray-50 dark:bg-[#1f1f1f] rounded-2xl'></section>
        </>
    );
};

export default Dashboard;