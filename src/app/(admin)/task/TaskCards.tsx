'use client';
// import { Button } from 'primereact/button';
// import React, { useState } from 'react';
// import { GoTasklist } from 'react-icons/go';
// import { Dialog } from 'primereact/dialog';
// import { InputText } from 'primereact/inputtext';
// import { ErrorMessage } from '@hookform/error-message';
// import { useForm } from 'react-hook-form';
// import { InputTextarea } from "primereact/inputtextarea";
// import { Calendar } from 'primereact/calendar';
// import { Nullable } from "primereact/ts-helpers";
// import { Dropdown } from 'primereact/dropdown';

// type TaskForm = {
//     email: string;
//     password: string;
// };

const TaskCards = () => {
    // const [isFormBtnLoading, setIsFormBtnLoading] = useState<boolean>(false);
    // const [taskAddForm, setTaskAddForm] = useState<boolean>(false);
    // const [date, setDate] = useState<Nullable<Date>>(null);

    // const {
    //     register,
    //     control,
    //     handleSubmit,
    //     watch,
    //     setError,
    //     formState: { errors },
    //     reset,
    //     clearErrors,
    //     setValue
    // } = useForm<TaskForm>({
    //     defaultValues: {
    //         taskName: '',
    //         description: '',
    //         dueDate: '',
    //     },
    // });
    // const statusOptions = ['Male', 'Female', 'Non-binary', 'Prefer Not to Say'].map((status, index) => ({
    //     label: status,
    //     value: index + 1,
    // }));

    // const onStatusChange = (e: any) => {
    //     setValue('status', e.value);
    //     clearErrors('status');
    // };

    return (
        <>
            {/* <section className='flex justify-between items-center gap-5'>
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

                <Dialog header="Header" visible={taskAddForm} style={{ width: '40vw' }} onHide={() => { if (!taskAddForm) return; setTaskAddForm(false); }}>
                    <form>
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
                            <label className="mb-1 text-sm text-gray-900 dark:text-gray-50" htmlFor="dueDate">
                                Status<span className='text-red-500'>*</span>
                            </label>
                            <Dropdown
                                value={formData?.gender}
                                options={statusOptions}
                                onChange={onGenderChange}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select a status"
                                className="mdt-selectbox-input"
                            />
                            <ErrorMessage
                                errors={errors}
                                name="status"
                                render={({ message }) => <span className="text-sm text-red-500">{message}</span>} />
                        </div>
                    </form>
                </Dialog>
            </section > */}
        </>
    );
};

export default TaskCards;