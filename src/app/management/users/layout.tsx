"use client";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div></div>
      {children}
    </>
  );
};
export default Layout;
