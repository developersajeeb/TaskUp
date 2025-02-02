'use client';
import { Button } from 'primereact/button';
import React, { useRef, useState } from 'react';
import { GoTasklist } from 'react-icons/go';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ErrorMessage } from '@hookform/error-message';
import { useForm } from 'react-hook-form';
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { TbSubtask } from 'react-icons/tb';
import { BsThreeDots } from 'react-icons/bs';
import { OverlayPanel } from 'primereact/overlaypanel';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import { ProgressBar } from 'primereact/progressbar';
import { LuChartBarStacked } from 'react-icons/lu';
import AddCategory from '@/components/AddCategory';

interface TaskForm {
    taskName: string;
    description: string;
    dueDate: string;
};

interface Task {
    taskCategory: string;
}

const TaskCards = () => {
    const [isFormBtnLoading, setIsFormBtnLoading] = useState<boolean>(false);
    const [taskAddForm, setTaskAddForm] = useState<boolean>(false);
    const [date, setDate] = useState<Nullable<Date>>(null);
    const [selectedCategory, setSelectedCategory] = useState<Task | null>(null);
    const editDeletePanel = useRef<OverlayPanel | null>(null);
    const [visibleCtgPopup, setVisibleCtgPopup] = useState<boolean>(false);
    const taskCategory: Task[] = [
        { taskCategory: 'New York' },
        { taskCategory: 'Rome' },
        { taskCategory: 'London' },
        { taskCategory: 'Istanbul' },
        { taskCategory: 'Paris' }
    ];

    const {
        register,
        control,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
        reset,
        clearErrors,
        setValue
    } = useForm<TaskForm>({
        defaultValues: {
            taskName: '',
            description: '',
            dueDate: '',
        },
    });

    return (
        <>
            <section className='flex justify-between items-center gap-5'>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-white">
                    <span className="flex h-9 w-9 max-w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-slate-800 dark:text-white">
                        <GoTasklist size={22} />
                    </span>
                    Tasks
                </h2>

                <Button
                    label="Add new task"
                    className="primary-btn"
                    disabled={isFormBtnLoading}
                    loading={isFormBtnLoading}
                    onClick={() => setTaskAddForm(true)}
                />
            </section>

            <section className='grid grid-cols-3 gap-6 mt-10'>
                <div>
                    <div className='bg-[#dbe8f5] dark:bg-[#36516c] p-5 rounded-lg'>
                        <div className='flex gap-2 justify-between'>
                            <div className='flex gap-2'>
                                <span className='flex h-9 w-[100%] max-w-[36px] items-center justify-center rounded-full bg-[#004B94] dark:bg-slate-800 text-white'><TbSubtask size={20} /></span>
                                <h5 className='text-lg font-medium text-gray-800 dark:text-white'>My Personal Website Development</h5>
                            </div>
                            <div><span className='cursor-pointer' onClick={(e) => editDeletePanel.current?.toggle(e)}><BsThreeDots size={22} /></span></div>
                        </div>

                        <div className='mt-5 mb-8'>
                            <div className='mb-2 flex items-center gap-4 justify-between'>
                                <p className='text-xs flex items-center font-medium text-gray-600 dark:text-gray-100'><span><LuChartBarStacked /></span> Progress</p>
                                <p className='text-xs font-medium text-gray-600 dark:text-gray-100'>2/6</p>
                            </div>
                            <ProgressBar className='text-xs bg-white dark:bg-gray-200 h-3' value={50}></ProgressBar>
                        </div>

                        <div className='flex flex-wrap gap-3'>
                            <span className='inline-block rounded-lg px-3 py-2 bg-[#9C82F8] text-xs font-medium text-white'>Web development</span>
                            <span className='inline-block rounded-lg px-3 py-2 bg-[#9C82F8] text-xs font-medium text-white'>Frontend</span>
                            <span className='inline-block rounded-lg px-3 py-2 bg-[#9C82F8] text-xs font-medium text-white'>Backend</span>
                        </div>
                    </div>
                    <OverlayPanel className='dark:bg-[#323232]' ref={editDeletePanel}>
                        <span className='text-gray-800 dark:text-white hover:text-[#004B93] dark:hover:text-[#004B93] duration-300 cursor-pointer block'><FiEdit3 size={20} /></span>
                        <span className='text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-500 duration-300 cursor-pointer block mt-3'><FiTrash2 size={20} /></span>
                    </OverlayPanel>
                </div>
            </section>

            <AddCategory visibleCtgPopup={visibleCtgPopup} setVisibleCtgPopup={setVisibleCtgPopup} />

            <Dialog header="Add new task" visible={taskAddForm} style={{ width: '40vw' }} onHide={() => { if (!taskAddForm) return; setTaskAddForm(false); }}>
                <form className='grid gap-5 pt-5'>
                    <div>
                        <label className="mb-1 text-sm text-gray-900 dark:text-gray-50" htmlFor="taskName">
                            Task Name<span className='text-red-500'>*</span>
                        </label>
                        <InputText
                            className="tu-input"
                            {...register('taskName', {
                                required: {
                                    value: true,
                                    message: 'Name is required',
                                },
                            })}
                        />
                        <ErrorMessage
                            errors={errors}
                            name="taskName"
                            render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                        />
                    </div>

                    <div>
                        <label className="mb-1 text-sm text-gray-900 dark:text-gray-50" htmlFor="description">
                            Description
                        </label>
                        <InputTextarea
                            className="tu-input !h-32"
                            {...register('description')}
                        />
                        <ErrorMessage
                            errors={errors}
                            name="description"
                            render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                        />
                    </div>

                    <div>
                        <label className="mb-1 text-sm text-gray-900 dark:text-gray-50" htmlFor="dueDate">
                            Due Date
                        </label>
                        <Calendar className='tu-calender' />
                    </div>

                    <div>
                        <label className="mb-1 text-sm text-gray-900 dark:text-gray-50 flex gap-3 justify-between" htmlFor="taskCategory">
                            <p>Category<span className='text-red-500'>*</span></p> <span className='text-blue-500 cursor-pointer' onClick={() => setVisibleCtgPopup(true)}>Add New +</span>
                        </label>
                        <MultiSelect value={selectedCategory} onChange={(e: MultiSelectChangeEvent) => setSelectedCategory(e.value)} options={taskCategory} optionLabel="taskCategory"
                            filter placeholder="Select Category" maxSelectedLabels={3} className="w-full tu-multi-select" />
                        <ErrorMessage
                            errors={errors}
                            name='taskCategory'
                            render={({ message }) => <span className="text-sm text-red-500">{message}</span>} />
                    </div>

                    <Button
                        label="Submit"
                        className="primary-btn mt-3 w-full max-w-36 mx-auto"
                        disabled={isFormBtnLoading}
                        loading={isFormBtnLoading}
                    // onClick={() => {
                    //     clearErrors();
                    //     setErrorMsg('');
                    // }}
                    />
                </form>
            </Dialog>


        </>
    );
};

export default TaskCards;