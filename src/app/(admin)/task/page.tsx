import React from 'react';
import TaskCards from './TaskCards';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Tasks - TaskUp",
  };

const Task = () => {
    return (
        <>
            <TaskCards />
        </>
    );
};

export default Task;