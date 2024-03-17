"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Navbar } from "./_components";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import useSWR from "swr";
import { UserDto } from "./dtos/user.dto";
import { customAxios } from "@/utils/axios";

const inter = Inter({ subsets: ["latin"] });

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const fetchProfile = async (): Promise<UserDto | null> => {
    return await customAxios.get(`${process.env.NEXT_PUBLIC_API}/auth/profile`);
  };

  const profileSwr = useSWR(["PROFILE"], fetchProfile);

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          <Navbar />
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
};
export default Layout;
