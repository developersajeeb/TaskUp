'use client';
import { createCategory } from '@/services/task';
import { ErrorMessage } from '@hookform/error-message';
import { useSession } from 'next-auth/react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Props {
    visibleCtgPopup: boolean,
    setVisibleCtgPopup: any,
    onCategoryAdded: () => void;
}

interface CategoryFrom {
    categoryName: string,
}

const AddCategory = ({ visibleCtgPopup, setVisibleCtgPopup, onCategoryAdded }: Props) => {
    const [isFormBtnLoading, setIsFormBtnLoading] = useState<boolean>(false);
    const sessionData = useSession();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
    } = useForm<CategoryFrom>({
        defaultValues: {
            categoryName: '',
        },
    });

    const onSubmit = async (data: CategoryFrom) => {
        setIsFormBtnLoading(true);
        try {
            const userEmail = sessionData?.data?.user?.email;
            if (!userEmail) throw new Error('User email is missing.');

            await createCategory(data.categoryName, userEmail);

            toast.success('Category added successfully');
            reset();
            setVisibleCtgPopup(false);
            onCategoryAdded();
        } catch (error) {
            console.error(error);
            setError('categoryName', { type: 'server', message: 'Error creating category' });
        } finally {
            setIsFormBtnLoading(false);
        }
    };

    return (
        <Dialog header="Add Category" visible={visibleCtgPopup} className='w-full max-w-[440px]' onHide={() => { if (!visibleCtgPopup) return; setVisibleCtgPopup(false); }}>
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