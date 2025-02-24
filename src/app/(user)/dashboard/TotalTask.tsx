'use client';
import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { useSession } from 'next-auth/react';
import { fetchTasks, getCompletedTasks, getIncompleteTasks } from '@/services/task';
import { Skeleton } from 'primereact/skeleton';

const TotalTaskGraph = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
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
                }
            }
        };

        loadTasks();
    }, [userEmail]);

    useEffect(() => {
        const colors = {
            blue: '#024995',
            purple: '#9C82F8',
            green: '#F9E7A0',
            blueHover: '#024995',
            purpleHover: '#9C82F8',
            greenHover: '#F9E7A0',
        };
        const data = {
            labels: ['Total', 'Complete', 'Pending'],
            datasets: [
                {
                    data: [`${tasks?.length || 0}`, `${completeTasks?.length || 0}`, `${incompleteTasks?.length || 0}`],
                    backgroundColor: [colors.blue, colors.purple, colors.green],
                    hoverBackgroundColor: [colors.blueHover, colors.purpleHover, colors.greenHover],
                }
            ]
        };
        const options = {
            cutout: '60%'
        };

        setChartData(data);
        setChartOptions(options);
    }, [tasks, completeTasks, incompleteTasks]);

    return (
        <>
            {isLoading ?
                (<Skeleton width="100%" height="262px" className='dark:bg-[#1a1a1a] rounded-xl'></Skeleton>) : (
                    tasks?.length === 0 && completeTasks?.length === 0 && incompleteTasks?.length === 0 ? (
                        <div className='text-gray-500 h-[296px] flex items-center justify-center'><p>No Data Available.</p></div>
                    ) : (
                        <Chart type="doughnut" data={chartData} options={chartOptions} className="max-w-[262px] w-full mx-auto" />
                    )
                )}
        </>
    );
};

export default TotalTaskGraph;