import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import notFound from '../../public/images/404.png';

export const metadata = {
    title: "Not Found - TaskUp",
};

const NotFound = () => {
    return (
        <main className='flex justify-center items-center min-h-screen py-6'>
            <div className='text-center'>
                <Image className='max-w-[600px] mx-auto mb-10' src={notFound} alt='404' width={600} height={400} />
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mt-4">Oops! Page Not Found</h2>
                <p className="text-lg text-gray-600 dark:text-gray-200 mt-2 text-center max-w-md mx-auto">
                    It looks like you've taken a wrong turn. The page you're looking for might have been moved, renamed, or doesn't exist.
                </p>
                <Link className='primary-btn inline-block pt-2 mt-5' href={'/dashboard'}>Back to Dashboard</Link>
            </div>
        </main>
    );
};

export default NotFound;