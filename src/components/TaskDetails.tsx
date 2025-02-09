'use client';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';

interface Props {
    taskDetailsPopup: boolean;
    setTaskDetailsPopup: (value: boolean) => void;
    taskIdForDetails: string | null;
}

interface TaskDetailsProps {
    taskName: string;
    description: string;
    dueDate: any;
    priority: string;
    taskCategory: [];
}

const TaskDetails = ({ taskDetailsPopup, setTaskDetailsPopup, taskIdForDetails }: Props) => {
    const [taskDetails, setTaskDetails] = useState<TaskDetailsProps | null>(null);
    const [isDataLoading, setDataLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!taskIdForDetails) return;
    
        const fetchTasks = async () => {
            setDataLoading(true);
            try {
                const res = await fetch(`/api/tasks/${taskIdForDetails}`);
                const data = await res.json();
                setTaskDetails(data?.data);
            } catch (error) {
                console.error("Error fetching task:", error);
            } finally {
                setDataLoading(false);
            }
        };
    
        fetchTasks();
    }, [taskIdForDetails]);

    console.log(taskDetails);

    return (
        <Dialog header={taskDetails?.taskName} visible={taskDetailsPopup} className='w-full max-w-[850px] mx-4' onHide={() => setTaskDetailsPopup(false)}>

        </Dialog>
    );
};

export default TaskDetails;