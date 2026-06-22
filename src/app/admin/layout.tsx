import type { Metadata } from "next";
import AdminBodyClass from "./AdminBodyClass";

export const metadata: Metadata = {
  title: "VYRO Admin Panel",
  description: "Internal admin dashboard for managing VYRO website content, flavours, and settings.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Sets body.admin-page so cursor:none is overridden */}
      <AdminBodyClass />
      {children}
    </>
  );
}
