'use client';
import DeskTopSidebar from "./DeskTopSidebar";
import NavBar from "./NavBar";
interface Props {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
    return (
        <>
            <DeskTopSidebar />
            <div className="lg:pl-[240px]">
                <NavBar />
                <div className="pt-20 pb-14"><div className="container">{children}</div></div>
            </div>
        </>
    );
}