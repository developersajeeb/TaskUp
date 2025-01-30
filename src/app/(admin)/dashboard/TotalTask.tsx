'use client';
import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';

const TotalTaskGraph = () => {
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
                    data: [300, 50, 100],
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
            <Chart type="doughnut" data={chartData} options={chartOptions} className="max-w-[262px] w-full mx-auto" />
        </>
    );
};

export default TotalTaskGraph;