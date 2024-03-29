"use client";

import { BookUp, Flower, UserCircle } from "lucide-react";
import Sidebar, { SidebarItem } from "./_components/sidebar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="flex">
        <Sidebar>
          <SidebarItem
            icon={<UserCircle size="20" />}
            text="User"
            active
            href="/management/users"
          />
          <SidebarItem
            icon={<Flower size="20" />}
            text="Orchid"
            href="/management/orchids"
          />
          <SidebarItem
            icon={<BookUp size="20" />}
            text="Deposit Request"
            href="/management/requests"
          />
        </Sidebar>
        {children}
      </div>
    </>
  );
};
export default Layout;
