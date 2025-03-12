"use client";
import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { useSession } from 'next-auth/react';
import { fetchTasks, getCompletedTasks, getIncompleteTasks } from '@/services/task';
import { Skeleton } from 'primereact/skeleton';

interface Task {
    createdAt: string;
    status?: 'completed' | 'pending';
}

const WeeklyAnalytics = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const { data: session } = useSession();
    const userEmail = session?.user?.email;
    const [tasks, setTasks] = useState<Task[]>([]);
    const [completeTasks, setCompleteTasks] = useState<Task[]>([]);
    const [incompleteTasks, setIncompleteTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadTasks = async () => {
            if (userEmail) {
                setIsLoading(true);
                try {
                    const [allTasks, completed, incomplete] = await Promise.all([
                        fetchTasks(userEmail),
                        getCompletedTasks(userEmail),
                        getIncompleteTasks(userEmail)
                    ]);

                    setTasks(allTasks || []);
                    setCompleteTasks(completed || []);
                    setIncompleteTasks(incomplete || []);
                } catch (error) {
                    console.error("Failed to fetch tasks:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadTasks();
    }, [userEmail]);

    useEffect(() => {
        if (!tasks.length && !completeTasks.length && !incompleteTasks.length) return;

        const getLast7Days = () => {
            const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            const today = new Date();
            const lastSaturday = new Date(today);
            lastSaturday.setDate(today.getDate() - ((today.getDay() + 1) % 7));

            return days.map((day, index) => {
                const date = new Date(lastSaturday);
                date.setDate(lastSaturday.getDate() + index);
                return { day, date: date.toISOString().split('T')[0] };
            });
        };

        const last7Days = getLast7Days();

        const countTasksByDay = (taskList: Task[]) => {
            return last7Days.map(({ date }) =>
                taskList.filter((task) => task.createdAt?.startsWith(date)).length
            );
        };

        const totalCounts = countTasksByDay(tasks);
        const completedCounts = countTasksByDay(completeTasks);
        const pendingCounts = countTasksByDay(incompleteTasks);

        const colors = {
            blue: '#024995',
            purple: '#9C82F8',
            yellow: '#F9E7A0',
        };

        setChartData({
            labels: last7Days.map((d) => d.day),
            datasets: [
                {
                    label: 'Total',
                    data: totalCounts,
                    borderColor: colors.blue,
                    fill: false,
                    tension: 0.4,
                    borderWidth: 3,
                },
                {
                    label: 'Completed',
                    data: completedCounts,
                    borderColor: colors.purple,
                    fill: false,
                    tension: 0.4,
                    borderWidth: 3,
                },
                {
                    label: 'Pending',
                    data: pendingCounts,
                    borderColor: colors.yellow,
                    fill: false,
                    tension: 0.4,
                    borderWidth: 3,
                }
            ],
        });

        setChartOptions({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#333'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#777' },
                    grid: { display: false }
                },
                y: {
                    ticks: { color: '#777' },
                    grid: { display: false }
                }
            }
        });
    }, [tasks, completeTasks, incompleteTasks]);

    return (
        <div className='bg-gray-50 dark:bg-[#1f1f1f] p-4 md:p-6 rounded-2xl'>
            {isLoading ? (
                <Skeleton width="100%" height="180px" className="dark:bg-[#1a1a1a] rounded-xl" />
            ) : tasks.length === 0 ? (
                <p className='text-gray-500 h-[150px] flex items-center justify-center'>No tasks here</p>
            ) : (
                <Chart type="line" data={chartData} options={chartOptions} />
            )}
        </div>
    );
};

export default WeeklyAnalytics;
