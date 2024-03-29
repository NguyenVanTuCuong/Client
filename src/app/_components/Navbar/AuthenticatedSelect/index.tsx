import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Spacer,
} from "@nextui-org/react";
import React, { useContext, useRef } from "react";
import { WalletModalRef, WalletModalRefSelectors } from "./WalletModalRef";
import { RootContext } from "@/app/_hooks/RootProvider";
import { useRouter } from "next/navigation";

export const AuthenticatedSelect = () => {
  const ref = useRef<WalletModalRefSelectors | null>(null);

  const { swrs } = useContext(RootContext)!;
  const { profileSwr } = swrs;
  const { mutate, data } = profileSwr;

  const onOpen = () => ref.current?.onOpen();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await mutate();
  };

  const router = useRouter()

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            src="/smile.jpg"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="profile" className="h-20 gap-2">
            <div className="font-semibold">Signed in as</div>
            <div className="font-semibold">{data?.email}</div>
            <Spacer y={2}/>
            <div> You are {data?.role}</div>
          </DropdownItem>
          <DropdownItem key="wallet" onPress={onOpen}>
            Wallet
          </DropdownItem>
          <DropdownItem key="analytics" onPress={() => router.push("/profile")}>Profile</DropdownItem>
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
