'use client';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Props {
    visibleCtgPopup: boolean,
    setVisibleCtgPopup: any,
}

interface CategoryFrom {
    categoryName: string,
}

const AddCategory = ({ visibleCtgPopup, setVisibleCtgPopup }: Props) => {
    const [isFormBtnLoading, setIsFormBtnLoading] = useState<boolean>(false);

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
    } = useForm<CategoryFrom>({
        defaultValues: {
            categoryName: '',
        },
    });

    const onSubmit = async (data: CategoryFrom) => {        
        setIsFormBtnLoading(true);
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ categoryName: data.categoryName.trim() }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            toast.success('Category added successfully');
            reset();
            setVisibleCtgPopup(false);
        } catch (error) {
            console.error(error);
            setError('categoryName', {
                type: 'server',
                message: 'Error creating category',
            });
        } finally {
            setIsFormBtnLoading(false);
        }
    };

    return (
        <Dialog header="Add Category" visible={visibleCtgPopup} style={{ width: '38vw' }} onHide={() => { if (!visibleCtgPopup) return; setVisibleCtgPopup(false); }}>
            <form onSubmit={handleSubmit(onSubmit)} className='mt-5'>
                <div className='flex gap-3'>
                    <InputText
                        className="tu-input"
                        {...register('categoryName', {
                            required: {
                                value: true,
                                message: 'Name is required',
                            },
                        })}
                    />
                    <Button
                        label="Added"
                        className="primary-btn w-[100%] max-w-[100px]"
                        disabled={isFormBtnLoading}
                        loading={isFormBtnLoading}
                    />
                </div>
                <ErrorMessage
                    errors={errors}
                    name="categoryName"
                    render={({ message }) => <span className="text-sm text-red-500">{message}</span>}
                />
            </form>
        </Dialog>
    );
};

export default AddCategory;