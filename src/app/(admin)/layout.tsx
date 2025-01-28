import AdminLayout from "@/components/AdminLayout";


interface Props {
  children: React.ReactNode;
}

function Layout({ children }: Props) {
  return (
    <section className="main-area">
      <AdminLayout>{children}</AdminLayout>
    </section>
  );
}

export default Layout;