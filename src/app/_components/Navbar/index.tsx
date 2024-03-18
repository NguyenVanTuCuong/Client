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
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { swrs }  = useContext(RootContext)!
  const { profileSwr }  = swrs
  const { data }  = profileSwr

  const router = useRouter()

  return (
    <NextUINavbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link onPress={() => router.push("nfts")} aria-current="page">
            NFTs
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Orchids
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {
            data ? <AuthenticatedSelect /> : <AuthModal />
          }            
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
};
