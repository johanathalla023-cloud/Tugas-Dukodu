import PortalShell from "@/components/PortalShell";

export const metadata = {
  title: "Portal Pelanggan Dukodu",
  description: "Portal pelanggan Dukodu Internet",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}