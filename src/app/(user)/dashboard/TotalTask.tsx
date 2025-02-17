'use client';
import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';

interface Props {
    tasks: [];
    completeTasks: [];
    incompleteTasks: [];
}

const TotalTaskGraph = ({ tasks, completeTasks, incompleteTasks }: Props) => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

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
    }, []);

    return (
        <>
            {tasks?.length === 0 && completeTasks?.length === 0 && incompleteTasks?.length === 0 ? (
                <div className='text-gray-800 dark:text-white h-full flex items-center justify-center'><p>No Data Available.</p></div>
            ) : (
                <Chart type="doughnut" data={chartData} options={chartOptions} className="max-w-[262px] w-full mx-auto" />
            )}
        </>
    );
};

export default TotalTaskGraph;