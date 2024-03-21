import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import React, { useContext, useRef } from "react";
import { WalletModalRef, WalletModalRefSelectors } from "./WalletModalRef";
import { RootContext } from "@/app/_hooks/RootProvider";

export const AuthenticatedSelect = () => {
  const ref = useRef<WalletModalRefSelectors | null>(null);

  const { swrs } = useContext(RootContext)!;
  const { profileSwr } = swrs;
  const { mutate } = profileSwr;

  const onOpen = () => ref.current?.onOpen();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await mutate();
  };

  return (
    <>
      {" "}
      <Dropdown>
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">zoey@example.com</p>
          </DropdownItem>
          <DropdownItem key="settings"></DropdownItem>
          <DropdownItem key="wallet" onPress={onOpen}>
            Wallet
          </DropdownItem>
          <DropdownItem key="analytics">Analytics</DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
          <DropdownItem key="configurations">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem key="logout" color="danger" onPress={handleLogout}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <WalletModalRef ref={ref} />
    </>
  );
};
