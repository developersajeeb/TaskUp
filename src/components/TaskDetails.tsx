'use client';
import { ErrorMessage } from '@hookform/error-message';
import { BlockUI } from 'primereact/blockui';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuListTree } from 'react-icons/lu';
import { toast } from 'react-toastify';

interface Props {
    taskDetailsPopup: boolean;
    setTaskDetailsPopup: (value: boolean) => void;
    taskIdForDetails: string | null;
}

interface TodoItem {
    workDone: boolean;
    todoName: string;
}

interface TaskDetailsProps {
    _id: string;
    taskName: string;
    description: string;
    dueDate: any;
    priority: string;
    taskCategory: [];
    todoList: TodoItem[];
}

interface TodoListContent {
    todoListDetails: string;
}

interface AllPriority {
    name: string;
}

const TaskDetails = ({ taskDetailsPopup, setTaskDetailsPopup, taskIdForDetails }: Props) => {
    const [taskDetails, setTaskDetails] = useState<TaskDetailsProps | null>(null);
    const [isDataLoading, setDataLoading] = useState<boolean>(true);
    const [isFormBtnLoading, setIsFormBtnLoading] = useState<boolean>(false);
    const [addTodoList, setAddTodoList] = useState<boolean>(false);
    const [checked, setTasks] = useState<boolean>(false);
    const [selectedPriority, setSelectedPriority] = useState<AllPriority | null>(null);
    const allPriority: AllPriority[] = [
        { name: 'Normal' },
        { name: 'Low' },
        { name: 'Medium' },
        { name: 'High' },
    ];

    const fetchTasksDetails = async () => {
        setDataLoading(true);
        try {
            const res = await fetch(`/api/tasks/${taskIdForDetails}`);
            const data = await res.json();
            setTaskDetails(data?.data);
        } catch (error) {
            // console.error("Error fetching task:", error);
        } finally {
            setDataLoading(false);
        }
    };
    useEffect(() => {
        fetchTasksDetails();
    }, [taskIdForDetails, taskDetailsPopup]);

    const customHeader = () => {
        return (
            <p>{taskDetails?.taskName || '---'}
                {taskDetails?.priority !== null &&
                    <span className={`text-white font-medium text-xs ml-2 py-1 px-2 rounded-lg ${taskDetails?.priority === 'Low' && 'bg-gray-400' || taskDetails?.priority === 'Medium' && 'bg-yellow-500' || taskDetails?.priority === 'High' && 'bg-red-500'}`}>{taskDetails?.priority}</span>
                }
            </p>
        )
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TodoListContent>({
        defaultValues: {
            todoListDetails: '',
        },
    });

    const handleAddTodo = async (data: TodoListContent) => {
        if (!taskIdForDetails) return;

        setIsFormBtnLoading(true);

        try {
            const newTodo = {
                workDone: false,
                todoName: data.todoListDetails,
            };
            const response = await fetch(`/api/tasks/${taskIdForDetails}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todoList: [newTodo] }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Todo added successfully!");
                setAddTodoList(false);
                reset();
                await fetchTasksDetails();
            } else {
                toast.error("Failed to add todo:", result.message);
            }
        } catch (error) {
            console.error("Error adding todo:", error);
        } finally {
            setIsFormBtnLoading(false);
        }
    };

    const handleCheckboxClick = async (index: number, checked: boolean) => {
        if (!taskIdForDetails) return;

        try {
            const response = await fetch(`/api/tasks/${taskIdForDetails}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ updateWorkDone: { todoIndex: index, workDone: checked } }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Todo status updated successfully!");
                await fetchTasksDetails();
            } else {
                toast.error("Failed to update todo status.");
            }
        } catch (error) {
            console.error("Error updating todo status:", error);
        }
    };


    console.log(taskDetails?.todoList);

    return (
        <Dialog header={customHeader} visible={taskDetailsPopup} className='w-full max-w-[750px] mx-4' onHide={() => setTaskDetailsPopup(false)}>
            <BlockUI className="rounded-lg pt-4 pb-3" blocked={isDataLoading} template={
                <div className='flex space-x-2 justify-center items-center'>
                    <div className='h-4 w-4 bg-gray-700 dark:bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                    <div className='h-4 w-4 bg-gray-700 dark:bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                    <div className='h-4 w-4 bg-gray-700 dark:bg-white rounded-full animate-bounce'></div>
                </div>
            }>
                <div className='pt-6 overflow-hidden'>
                    {taskDetails?.description && (
                        <>
                            <h5 className='text-gray-800 dark:text-white font-medium mb-2'>Description:</h5>
                            <p className='text-gray-800 dark:text-gray-200 text-sm'>{taskDetails?.description}</p>
                        </>
                    )}

                    {taskDetails?.dueDate && (
                        <p className='text-gray-800 dark:text-white text-sm mt-4'> <span className='font-semibold text-red-500'>Due Date:</span> {new Date(taskDetails.dueDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}</p>
                    )}

                    {taskDetails?.taskCategory && taskDetails?.taskCategory?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-8">
                            {taskDetails?.taskCategory?.map((taskCtg: any, index: number) => (
                                <span key={`${taskDetails?._id}-${index}`} className="inline-block rounded-lg px-3 py-2 bg-[#9C82F8] text-xs font-medium text-white">
                                    {taskCtg}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className='h-[1px] w-full bg-gray-200 dark:bg-gray-800 my-8'></div>

                    <button className='primary-btn flex items-center gap-2' onClick={() => setAddTodoList(true)}>Add Todo List <LuListTree size={16} /></button>

                    <ul className='grid gap-5 mt-12'>
                        {taskDetails?.todoList?.map((todo: any, index: number) => {
                            return (
                                <li key={index} className={`flex flex-col md:flex-row gap-3 bg-gray-100 dark:bg-[#303030] p-4 md:p-5 rounded-lg border-2 border-gray-20 dark:border-[#484848] ${todo.workDone === true && 'line-through opacity-50'}`}>
                                    <Checkbox
                                        onChange={e => handleCheckboxClick(index, e.checked ?? false)}
                                        checked={todo.workDone ?? false}
                                    />
                                    <p className='text-gray-800 dark:text-white'>{todo?.todoName}</p>
                                </li>
                            )
                        })}
                    </ul>

                    <Dialog header='Add Todo' visible={addTodoList} className='w-full max-w-[550px] mx-4' onHide={() => setAddTodoList(false)}>
                        <form className='mt-5' onSubmit={handleSubmit(handleAddTodo)}>
                            <label className="mb-1 block text-sm text-gray-900 dark:text-gray-50" htmlFor="todoListDetails">
                                Todo<span className='text-red-500'>*</span>
                            </label>
                            <div className='flex gap-3'>
                                <div className='w-full'>
                                    <InputText className="tu-input" {...register('todoListDetails', { required: "Content is required" })} />
                                    <ErrorMessage errors={errors} name="todoListDetails" render={({ message }) => <span className="text-sm text-red-500">{message}</span>} />
                                </div>
                                <Button label="Add" type="submit" className="primary-btn w-full max-w-24" disabled={isFormBtnLoading} loading={isFormBtnLoading} />
                            </div>
                        </form>
                    </Dialog>
                </div>
            </BlockUI>
        </Dialog>
    );
};

export default TaskDetails;