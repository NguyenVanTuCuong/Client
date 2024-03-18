/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ReactNode, createContext } from "react";
import React from "react";
import useSWR, { SWRResponse } from "swr";
import { UserDto } from "../dtos/user.dto";
import { customAxios } from "@/utils/axios";

interface RootContextValue {
  swrs: {
    profileSwr: SWRResponse<UserDto | null>;
  };
}

export const RootContext = createContext<RootContextValue | null>(null);

export const COLUMNS_PER_PAGE = 5;

export const RootProvider = ({ children }: { children: ReactNode }) => {
  const fetchProfile = async (key: string) => {
    try {
      return (await customAxios.get(key)) as UserDto;
    } catch (ex) {
      return null;
    }
  };

  const profileSwr = useSWR(
    `${process.env.NEXT_PUBLIC_API}auth/get-profile`,
    fetchProfile
  );

  const rootContextValue: RootContextValue = {
    swrs: {
      profileSwr,
    },
  };

  return (
    <RootContext.Provider value={rootContextValue}>
      {children}
    </RootContext.Provider>
  );
};
