'use client';
import { useState } from "react";
import DeskTopSidebar from "./DeskTopSidebar";
import NavBar from "./NavBar";
import MobileSidebar from "./MobileSidebar";
interface Props {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
    const [visible, setVisible] = useState<boolean>(false);
    return (
        <>
            <DeskTopSidebar />
            <MobileSidebar visible={visible} setVisible={setVisible} />
            <div className="lg:pl-[240px]">
                <NavBar setVisible={setVisible} />
                <div className="pt-20 pb-14"><div className="container">{children}</div></div>
            </div>
        </>
    );
}