'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from 'primereact/sidebar';
import React from 'react';
import { GoTasklist } from 'react-icons/go';
import { RxDashboard } from 'react-icons/rx';
import { TbCategory2 } from 'react-icons/tb';
import Logo from '../../public/images/logo-icon.png';
import Image from 'next/image';

interface Props {
    visible: boolean;
    setVisible: (value: boolean) => void;
}

const MobileSidebar: React.FC<Props> = ({ visible, setVisible }) => {
    const pathname = usePathname();

    const customHeader = (
        <Link href='/'>
            <Image src={Logo} alt='Logo' width={30} height={30} />
        </Link>
    );

    return (
        <Sidebar header={customHeader} blockScroll={true} visible={visible} onHide={() => setVisible(false)} className="!max-w-[280px] !bg-[#f9f9f9] dark:!bg-[#1B1B1B]">
            <ul className='text-gray-700 dark:text-white text-sm font-medium mt-6 grid gap-5'>
                <li><Link className={`flex items-center gap-2 hover:text-[#7e5cee] duration-300 ${pathname === '/dashboard' ? 'text-[#9C83F2]' : ''}`} href='/dashboard'><RxDashboard size={20} /> Dashboard</Link></li>
                <li><Link className={`flex items-center gap-2 hover:text-[#7e5cee] duration-300 ${pathname === '/task' ? 'text-[#9C83F2]' : ''}`} href='/task'><GoTasklist size={20} /> Tasks</Link></li>
                <li><Link className={`flex items-center gap-2 hover:text-[#7e5cee] duration-300 ${pathname === '/categories' ? 'text-[#9C83F2]' : ''}`} href='/categories'><TbCategory2 size={20} /> Categories</Link></li>
            </ul>
        </Sidebar>
    );
};

export default MobileSidebar;