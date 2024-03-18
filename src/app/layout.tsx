"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Navbar } from "./_components";
import { RootProvider } from "./_hooks/RootProvider";
import { MetaMaskProvider } from "@metamask/sdk-react";

const inter = Inter({ subsets: ["latin"] });

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootProvider>
          <MetaMaskProvider
            debug={false}
            sdkOptions={{
              dappMetadata: {
                name: "Orchid Auction",
              },
            }}
          >
            <NextUIProvider>
              <Navbar />
              {children}
            </NextUIProvider>
          </MetaMaskProvider>
        </RootProvider>
      </body>
    </html>
  );
};
export default Layout;
