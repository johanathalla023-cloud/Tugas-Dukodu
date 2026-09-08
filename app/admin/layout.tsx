import AdminShell from "@/components/AdminShell";

export const metadata = {
  title: "Dukodu Admin CMS",
  description: "Panel administrasi Dukodu Internet",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}