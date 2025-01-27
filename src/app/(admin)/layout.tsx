import AdminLayout from "@/components/AdminLayout";


interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  return (
    <section className="main-area">
      <AdminLayout>{children}</AdminLayout>
    </section>
  );
}
