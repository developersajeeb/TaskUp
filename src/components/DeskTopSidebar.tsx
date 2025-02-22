'user client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { RxDashboard } from 'react-icons/rx';
import Logo from '../../public/images/logo.png';
import { GoTasklist } from 'react-icons/go';
import { TbCategory2 } from 'react-icons/tb';

const DeskTopSidebar = () => {
    const pathname = usePathname();
    return (
        <aside className='bg-[#f9f9f9] dark:bg-[#1B1B1B] p-5 border-r border-gray-300 dark:border-[#2d2d2d] w-full max-w-[250px] fixed z-50 top-0 left-0 bottom-0 hidden lg:block duration-100 ease-in-out'>
            <Link href='/'>
                <Image className={`w-[130px] md:w-[160px] mx-auto`} src={Logo} alt='Logo' width={180} height={80} />
            </Link>

            <div className='h-[calc(100%-170px)] flex items-center justify-center'>
                <ul className='text-gray-700 dark:text-white text-sm font-medium mt-12 grid gap-5'>
                    <li><Link className={`flex items-center gap-2 hover:text-[#7e5cee] duration-300 ${pathname === '/dashboard' ? 'text-[#9C83F2]' : ''}`} href='/dashboard'><RxDashboard size={20} /> Dashboard</Link></li>
                    <li><Link className={`flex items-center gap-2 hover:text-[#7e5cee] duration-300 ${pathname === '/task' ? 'text-[#9C83F2]' : ''}`} href='/task'><GoTasklist size={20} /> Tasks</Link></li>
                    <li><Link className={`flex items-center gap-2 hover:text-[#7e5cee] duration-300 ${pathname === '/categories' ? 'text-[#9C83F2]' : ''}`} href='/categories'><TbCategory2 size={20} /> Categories</Link></li>
                </ul>
            </div>
        </aside>
    );
};

export default DeskTopSidebar;