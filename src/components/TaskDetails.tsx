'use client';
import { ErrorMessage } from '@hookform/error-message';
import { BlockUI } from 'primereact/blockui';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiTrash2 } from 'react-icons/fi';
import { LuListTree } from 'react-icons/lu';
import { toast } from 'react-toastify';
import DeletePopup from './DeletePoup';
import { addTodo, deleteTodo, fetchTaskDetails, updateTodoStatus } from '@/services/task';

interface Props {
    taskDetailsPopup: boolean;
    setTaskDetailsPopup: (value: boolean) => void;
    taskIdForDetails: string | null;
    todoLengthProgress: TaskDetailsProps | null;
    setTodoLengthProgress: (value: TaskDetailsProps | null) => void;
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
const TaskDetails = ({ taskDetailsPopup, setTaskDetailsPopup, taskIdForDetails, todoLengthProgress, setTodoLengthProgress }: Props) => {
    const [isDataLoading, setDataLoading] = useState<boolean>(true);
    const [isFormBtnLoading, setIsFormBtnLoading] = useState<boolean>(false);
    const [addTodoList, setAddTodoList] = useState<boolean>(false);
    const [deletePopup, setDeletePopup] = useState<boolean>(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    const fetchTasksDetails = async () => {
        if (!taskIdForDetails) return;
        setDataLoading(true);
        try {
            const data = await fetchTaskDetails(taskIdForDetails);
            setTodoLengthProgress(data);
        } catch (error) {
            console.error("Error fetching task:", error);
        } finally {
            setDataLoading(false);
        }
    };    
    useEffect(() => {
        fetchTasksDetails();
    }, [taskIdForDetails, taskDetailsPopup]);

    const customHeader = () => {
        return (
            <p>{todoLengthProgress?.taskName || '---'}
                {todoLengthProgress?.priority !== null &&
                    <span className={`text-white font-medium text-xs ml-2 py-1 px-2 rounded-lg ${todoLengthProgress?.priority === 'Low' && 'bg-gray-400' || todoLengthProgress?.priority === 'Medium' && 'bg-yellow-500' || todoLengthProgress?.priority === 'High' && 'bg-red-500'}`}>{todoLengthProgress?.priority}</span>
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
            const success = await addTodo(taskIdForDetails, data.todoListDetails);
            if (success) {
                toast.success("Todo added successfully!");
                setAddTodoList(false);
                reset();
                await fetchTasksDetails();
            } else {
                toast.error("Failed to add todo.");
            }
        } catch (error) {
            console.error("Error adding todo:", error);
        } finally {
            setIsFormBtnLoading(false);
        }
    };    

    const handleCheckboxClick = async (index: number, checked: boolean) => {
        setDataLoading(true);
        if (!taskIdForDetails) return;
        try {
            const success = await updateTodoStatus(taskIdForDetails, index, checked);
            if (success) {
                toast.success("Todo status updated successfully!");
                await fetchTasksDetails();
            } else {
                toast.error("Failed to update todo status.");
            }
        } catch (error) {
            console.error("Error updating todo status:", error);
        } finally {
            setDataLoading(false);
        }
    };    

    const handleDeleteTodo = (index: number) => {
        setDeleteIndex(index);
        setDeletePopup(true);
    };

    const onConfirmDeleteTodo = async () => {
        if (!taskIdForDetails || deleteIndex === null) return;
        setDataLoading(true);
        try {
            const success = await deleteTodo(taskIdForDetails, deleteIndex);
            if (success) {
                toast.success("Todo deleted successfully!");
                await fetchTasksDetails();
            } else {
                toast.error("Failed to delete todo.");
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
        } finally {
            setDeletePopup(false);
            setDeleteIndex(null);
            setDataLoading(false);
        }
    };    

    return (
        <Dialog header={customHeader} visible={taskDetailsPopup} className='w-full max-w-[750px] mx-4 z-[70]' onHide={() => setTaskDetailsPopup(false)}>
            <BlockUI className="rounded-lg pt-4 pb-3" blocked={isDataLoading} template={
                <div className='flex space-x-2 justify-center items-center'>
                    <div className='h-4 w-4 bg-gray-700 dark:bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                    <div className='h-4 w-4 bg-gray-700 dark:bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                    <div className='h-4 w-4 bg-gray-700 dark:bg-white rounded-full animate-bounce'></div>
                </div>
            }>
                <div className='pt-6 overflow-hidden'>
                    {todoLengthProgress?.description ? (
                        <>
                            <h5 className='text-gray-800 dark:text-white font-medium mb-2'>Description:</h5>
                            <p className='text-gray-800 dark:text-gray-200 text-sm'>{todoLengthProgress?.description}</p>
                        </>
                    ) : (
                        <p className='text-gray-600 dark:text-gray-200 text-center'>No description here!</p>
                    )}

                    {todoLengthProgress?.dueDate && (
                        <p className='text-gray-800 dark:text-white text-sm mt-4'> <span className='font-semibold text-red-500'>Due Date:</span> {new Date(todoLengthProgress.dueDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}</p>
                    )}

                    {todoLengthProgress?.taskCategory && todoLengthProgress?.taskCategory?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-8">
                            {todoLengthProgress?.taskCategory?.map((taskCtg: any, index: number) => (
                                <span key={`${todoLengthProgress?._id}-${index}`} className="inline-block rounded-lg px-3 py-2 bg-[#9C82F8] text-xs font-medium text-white">
                                    {taskCtg}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className='h-[1px] w-full bg-gray-200 dark:bg-gray-800 my-8'></div>

                    <button className='primary-btn flex items-center gap-2' onClick={() => setAddTodoList(true)}>Add Todo List <LuListTree size={16} /></button>

                    <ul className='grid gap-5 mt-10'>
                        {todoLengthProgress?.todoList && todoLengthProgress.todoList.length > 0 ? (
                            todoLengthProgress.todoList.map((todo: any, index: number) => (
                                <li key={index} className={`flex flex-col md:flex-row gap-3 bg-gray-100 dark:bg-[#303030] p-4 md:p-5 rounded-lg border-2 border-gray-200 dark:border-[#484848] relative ${todo.workDone ? 'line-through opacity-50' : ''}`}>
                                    <Checkbox
                                        onChange={e => handleCheckboxClick(index, e.checked ?? false)}
                                        checked={todo.workDone ?? false}
                                    />
                                    <p className='text-gray-800 dark:text-white'>{todo?.todoName}</p>
                                    <span className='bg-red-500 w-6 h-6 flex items-center justify-center rounded-tl-none rounded-tr-[10px] rounded-bl-[30px] text-white absolute top-0 right-0 opacity-75 cursor-pointer hover:opacity-100 duration-300' onClick={() => handleDeleteTodo(index)}><FiTrash2 size={14} className='-mt-[3px] -mr-[3px]' /></span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-600 dark:text-gray-200 text-center">No todo list added yet.</p>
                        )}
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
            <DeletePopup deletePopup={deletePopup} setDeletePopup={setDeletePopup} onDelete={onConfirmDeleteTodo} deleteBtnLoading={isDataLoading} />

        </Dialog>
    );
};

export default TaskDetails;