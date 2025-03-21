'use client';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import AddCategory from './AddCategory';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { fetchCategories } from '@/services/task';

interface TaskForm {
    taskName: string;
    description: string;
    dueDate: Date | null;
    taskCategory: string[];
}

interface TaskCategory {
    taskCategory: string;
}

interface Props {
    taskAddForm: boolean;
    setTaskAddForm: (value: boolean) => void;
    fetchTasks: () => void;
}

interface TaskPriority {
    name: string;
}

const AddTaskPopup = ({ taskAddForm, setTaskAddForm, fetchTasks }: Props) => {
    const [isFormBtnLoading, setIsFormBtnLoading] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<TaskCategory[]>([]);
    const [visibleCtgPopup, setVisibleCtgPopup] = useState<boolean>(false);
    const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
    const sessionData = useSession();
    const userEmail = sessionData?.data?.user?.email;
    const [taskPriority, setTaskPriority] = useState<TaskPriority | null>(null);
    const allPriority: TaskPriority[] = [
        { name: 'Low' },
        { name: 'Medium' },
        { name: 'High' }
    ];

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<TaskForm>({
        defaultValues: {
            taskName: '',
            description: '',
            dueDate: null,
            taskCategory: [],
        },
    });

    const fetchUserCategories = async () => {
        if (!userEmail) return;
        try {
            const categories = await fetchCategories(userEmail);
            if (categories && Array.isArray(categories)) {
                const formattedCategories = categories.map((category: string) => ({
                    taskCategory: category,
                }));
                setTaskCategories(formattedCategories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchUserCategories();
    }, [userEmail]);

    const handleCategoryAdded = () => {
        setVisibleCtgPopup(false);
        fetchUserCategories();
    };

    const onSubmit = async (formData: TaskForm) => {
        setIsFormBtnLoading(true);
        try {
            const formattedCategories = selectedCategories.map(category => category.taskCategory);
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
                    priority: taskPriority?.name,
                    taskCategory: formattedCategories,
                    userEmail: sessionData?.data?.user?.email,
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("Task added successfully!");
                reset();
                setTaskAddForm(false);
                setTaskPriority(null);
                setSelectedCategories([]);
                fetchTasks();
            } else {
                toast.error(data.message || "Something went wrong!");
            }
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task.");
        } finally {
            setIsFormBtnLoading(false);
        }
    };

    return (
        <Dialog header="Add new task" visible={taskAddForm} className='w-full max-w-[550px]' onHide={() => setTaskAddForm(false)}>
            <form className='grid gap-4 pt-5' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="mb-1 text-sm text-gray-900 dark:text-gray-50" htmlFor="taskName">
                        Task Name<span className='text-red-500'>*</span>
                    </label>
                    <InputText className="tu-input" {...register('taskName', { required: "Task Name is required" })} />
                    <ErrorMessage errors={errors} name="taskName" render={({ message }) => <span className="text-sm text-red-500">{message}</span>} />
                </div>

                <div>
                    <label className="mb-1 text-sm text-gray-900 dark:text-gray-50" htmlFor="description">
                        Description
                    </label>
                    <InputTextarea className="tu-input py-3 !h-32" {...register('description')} />
                </div>

                <div className='overflow-hidden'>
                    <label className="mb-1 text-sm text-gray-900 dark:text-gray-50 flex gap-3 justify-between" htmlFor="taskCategory">
                        <p>Category</p>
                        <span className='text-blue-500 cursor-pointer' onClick={() => setVisibleCtgPopup(true)}>Add New +</span>
                    </label>
                    <MultiSelect
                        value={selectedCategories}
                        onChange={(e: MultiSelectChangeEvent) => setSelectedCategories(e.value)}
                        options={taskCategories}
                        optionLabel="taskCategory"
                        filter
                        placeholder="Select Category"
                        maxSelectedLabels={3}
                        className="w-full tu-multi-select"
                    />
                    <ErrorMessage errors={errors} name="taskCategory" render={({ message }) => <span className="text-sm text-red-500">{message}</span>} />
                </div>

                <div className='grid sm:grid-cols-2 gap-5'>
                    <div>
                        <label className="mb-1 text-sm text-gray-900 dark:text-gray-50" htmlFor="dueDate">
                            Due Date
                        </label>
                        <Calendar className='tu-calender' value={watch('dueDate') ?? null} onChange={(e) => setValue('dueDate', e.value as Date)} />
                    </div>

                    <div>
                        <label className="mb-1 text-sm text-gray-900 dark:text-gray-50" htmlFor="taskPriority">
                            Priority
                        </label>
                        <Dropdown value={taskPriority} onChange={(e: DropdownChangeEvent) => setTaskPriority(e.value)} options={allPriority} optionLabel="name"
                            placeholder="Select a priority" className="w-full tu-dropdown-input" />
                    </div>
                </div>

                <Button label="Submit" type="submit" className="primary-btn mt-3 w-full max-w-36 mx-auto" disabled={isFormBtnLoading} loading={isFormBtnLoading} />
            </form>

            <AddCategory visibleCtgPopup={visibleCtgPopup} setVisibleCtgPopup={setVisibleCtgPopup} onCategoryAdded={handleCategoryAdded} />
        </Dialog>
    );
};

export default AddTaskPopup;
