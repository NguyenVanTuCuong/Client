import React, { useContext } from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Switch,
} from "@nextui-org/react";
import { AuthModal } from "./AuthModal";
import { AuthenticatedSelect } from "./AuthenticatedSelect";
import { RootContext } from "@/app/_hooks/RootProvider";
import { usePathname, useRouter } from "next/navigation";

export const Navbar = () => {
  const { swrs } = useContext(RootContext)!;
  const { profileSwr } = swrs;
  const { data } = profileSwr;

  const pathName = usePathname();
  console.log(pathName);

  return (
    <NextUINavbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">Orchid Auction</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathName === "/"}>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathName === "/auctions"}>
          <Link color="foreground" href="/auctions">
            Auctions
          </Link>
        </NavbarItem>
        {data?.role === "Administrator" ? (
          <NavbarItem isActive={pathName === "/management/requests"}>
            <Link color="foreground" href="/management/requests">
              Management
            </Link>
          </NavbarItem>
        ) : null}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {data ? <AuthenticatedSelect /> : <AuthModal />}
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
