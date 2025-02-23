import React from 'react';
import { Metadata } from 'next';
import TaskLists from './TaskLists';

export const metadata: Metadata = {
    title: "Tasks - TaskUp",
  };

const Task = () => {
    return (
        <>
            <TaskLists />
        </>
    );
};

export default Task;