import React from 'react';
import TotalTaskGraph from './TotalTask';
import TaskNumberOverview from './TaskNumberOverview';

const Dashboard = () => {
    return (
        <>
            <section className='grid xl:grid-cols-3 gap-8'>
                <div className='xl:col-span-2'><TaskNumberOverview /></div>
                <div className='xl:col-span-1 hidden xl:block'><TotalTaskGraph /></div>
            </section>
        </>
    );
};

export default Dashboard;