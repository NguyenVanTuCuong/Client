"use client";

import { BookUp, Flower, UserCircle } from "lucide-react";
import Sidebar, { SidebarItem } from "./_components/sidebar";
import { usePathname } from "next/navigation";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathName = usePathname();
  return (
    <>
      <div className="flex">
        <Sidebar>
          <SidebarItem
            icon={<UserCircle size="20" />}
            text="User"
            active={pathName === "/management/users"}
            href="/management/users"
          />
          <SidebarItem
            icon={<Flower size="20" />}
            text="Orchid"
            href="/management/orchids"
            active={pathName === "/management/orchids"}
          />
          <SidebarItem
            icon={<BookUp size="20" />}
            text="Deposit Request"
            href="/management/requests"
            active={pathName === "/management/requests"}
          />
        </Sidebar>
        {children}
      </div>
    </>
  );
};
export default Layout;
