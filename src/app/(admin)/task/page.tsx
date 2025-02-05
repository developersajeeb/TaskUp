import React from 'react';
import TaskCards from './TaskCards';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Tasks - TaskUp",
  };

const Task = () => {
    // http://localhost:3000/api/tasks?userEmail=sajeeb@codersbucket.com
    return (
        <>
            <TaskCards />
        </>
    );
};

export default Task;