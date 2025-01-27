import React from 'react';
import TaskCards from './TaskCards';
import { GoTasklist } from 'react-icons/go';

const Task = () => {
    return (
        <>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-white">
                <span className="flex h-9 w-9 max-w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-slate-800 dark:text-white">
                    <GoTasklist size={22} />
                </span>
                Tasks
            </h2>

            <TaskCards />
        </>
    );
};

export default Task;