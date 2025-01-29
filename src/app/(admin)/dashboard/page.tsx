import React from 'react';
import TotalTaskGraph from './TotalTask';
import TaskNumberOverview from './TaskNumberOverview';

const Dashboard = () => {
    return (
        <>
            <section className='grid grid-cols-3 gap-8'>
                <div className='col-span-2'><TaskNumberOverview /></div>
                <div className='col-span-1'><TotalTaskGraph /></div>
            </section>
        </>
    );
};

export default Dashboard;