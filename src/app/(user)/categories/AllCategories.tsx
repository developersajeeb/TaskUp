'use client';
import AddCategory from '@/components/AddCategory';
import CommonLoader from '@/components/CommonLoader';
import { deleteCategory, fetchCategories, searchCategories } from '@/services/task';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { BlockUI } from 'primereact/blockui';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { TbCategory2 } from 'react-icons/tb';
import NoCTG from '../../../../public/images/no-ctg.svg';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DeletePopup from '@/components/DeletePoup';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';

interface TaskCategory {
    taskCategory: string;
}

const AllCategories = () => {
    const [isDataLoading, setDataLoading] = useState<boolean>(false);
    const [visibleCtgPopup, setVisibleCtgPopup] = useState<boolean>(false);
    const [taskCategories, setTaskCategories] = useState<TaskCategory[]>([]);
    const [deletePopup, setDeletePopup] = useState<boolean>(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const sessionData = useSession();
    const userEmail = sessionData?.data?.user?.email;
    const { register, handleSubmit, watch } = useForm();
    const searchQuery = watch('searchQuery');

    // const fetchUserCategories = async () => {
    //     if (!userEmail) return;

    //     setDataLoading(true);

    //     try {
    //         const queryParam = searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : '';
    //         const res = await fetch(`/api/categories/search?email=${encodeURIComponent(userEmail)}${queryParam}`);

    //         if (!res.ok) throw new Error('Failed to fetch categories');

    //         const { data } = await res.json();

    //         const formattedCategories = Array.isArray(data)
    //             ? data.map((category: string) => ({ taskCategory: category }))
    //             : [];

    //         setTaskCategories(formattedCategories);
    //     } catch (error) {
    //         console.error("Error fetching categories:", error);
    //         setTaskCategories([]);
    //     } finally {
    //         setDataLoading(false);
    //     }
    // };

    const fetchUserCategories = async () => {
        if (!userEmail) return;

        setDataLoading(true);

        try {
            const categories = await searchCategories(userEmail, searchQuery);
            setTaskCategories(categories);
        } catch (error) {
            setTaskCategories([]);
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        fetchUserCategories();
    }, [userEmail]);

    const handleCategoryAdded = () => {
        setVisibleCtgPopup(false);
        fetchUserCategories();
    };

    const handleDeleteCategory = (index: number) => {
        setDeleteIndex(index);
        setDeletePopup(true);
    };

    const onConfirmDeleteCtg = async () => {
        if (!userEmail || !taskCategories || deleteIndex === null) return;
        setDataLoading(true);
        try {
            const response = await deleteCategory(userEmail, deleteIndex);
            if (response?.success) {
                toast.success(response?.message);
                const updatedCategories = taskCategories.filter((_, i) => i !== deleteIndex);
                setTaskCategories(updatedCategories);
            } else {
                console.error(response?.message || 'Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        } finally {
            setDeletePopup(false);
            setDeleteIndex(null);
            setDataLoading(false);
        }
    };

    return (
        <BlockUI className="!bg-[#ffffffca] dark:!bg-[#121212e8] w-full !h-[calc(100vh-81px)] !z-[60]" blocked={isDataLoading} template={<CommonLoader />}>
            <section className='flex flex-wrap justify-between items-center gap-5'>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800 dark:text-white">
                    <span className="flex h-9 w-9 max-w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-slate-800 dark:text-white">
                        <TbCategory2 size={22} />
                    </span>
                    Category
                </h2>

                <div className='flex flex-wrap gap-5'>
                    <form className='relative' onSubmit={handleSubmit(fetchUserCategories)}>
                        <InputText placeholder="Search" {...register('searchQuery')} className='tu-input w-full !pr-9' />
                        <button type='submit' className='absolute right-2 top-[9px] cursor-pointer'><FiSearch size={20} /></button>
                    </form>
                    <div>
                        <Button
                            label="Add Category"
                            className="primary-btn"
                            onClick={() => setVisibleCtgPopup(true)}
                        />
                    </div>
                </div>
            </section>

            {taskCategories?.length === 0 ? (
                <div className='flex justify-center items-center h-[calc(100vh-180px)]'>
                    <div>
                        <Image className='w-full max-w-[300px] mx-auto' src={NoCTG} height='150' width='50' alt='No task' />
                        <p className='text-gray-600 dark:text-gray-100 text-center font-medium text-xl'>No Categories Found!</p>
                    </div>
                </div>
            ) : (
                <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 mt-10">
                    {taskCategories?.map((category: any, index: number) => {
                        return (
                            <li key={index} className={`flex flex-col md:flex-row gap-3 bg-gray-100 dark:bg-[#303030] p-4 md:p-5 rounded-lg border-2 border-gray-200 dark:border-[#484848] relative`}>
                                <p className='text-gray-800 dark:text-white'>{category?.taskCategory}</p>
                                <p onClick={() => handleDeleteCategory(index)} className='bg-red-500 w-6 h-6 flex items-center justify-center rounded-tl-none rounded-tr-[10px] rounded-bl-[30px] text-white absolute top-0 right-0 opacity-75 cursor-pointer hover:opacity-100 duration-300'><FiTrash2 size={14} className='-mt-[3px] -mr-[3px]' /></p>
                            </li>
                        );
                    })}
                </section>
            )}
            <DeletePopup deletePopup={deletePopup} setDeletePopup={setDeletePopup} onDelete={onConfirmDeleteCtg} deleteBtnLoading={isDataLoading} />
            <AddCategory visibleCtgPopup={visibleCtgPopup} setVisibleCtgPopup={setVisibleCtgPopup} onCategoryAdded={handleCategoryAdded} />
        </BlockUI>
    );
};

export default AllCategories;