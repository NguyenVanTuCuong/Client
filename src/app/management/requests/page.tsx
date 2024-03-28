"use client";
import React, { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Image,
  Chip,
  Button,
} from "@nextui-org/react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { customAxios } from "@/utils/axios";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { CheckIcon, XIcon } from "lucide-react";

const fetcher = async (key: string) => {
  const response = await customAxios.get(key);
  return response as any;
};
const Page = () => {
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const top = 10;
  const skip = (page - 1) * top;

  const getPagingUrl = `${process.env.NEXT_PUBLIC_API}deposit-request/all?skip=${skip}&top=${top}`;

  const { data, isLoading } = useSWR(getPagingUrl, fetcher, {
    keepPreviousData: true,
  });

  const pages = useMemo(() => {
    return data?.pages ? data.pages : 0;
  }, [data?.pages, top]);

  const loadingState = isLoading || data?.pages === 0 ? "loading" : "idle";
  const router = useRouter();

  const renderChip = (item: any) => {
    if (item?.requestStatus === "Pending")
      return (
        <Chip variant="flat" color="warning">
          Pending
        </Chip>
      );
    if (item?.requestStatus === "Approved")
      return (
        <Chip variant="flat" color="success">
          Approved
        </Chip>
      );
    if (item?.requestStatus === "Rejected")
      return (
        <Chip variant="flat" color="danger">
          Rejected
        </Chip>
      );
  };

  return (
    <div className="px-6 max-w-[1024px] mx-auto mt-6">
      <Table
        removeWrapper
        selectionMode="single"
        onRowAction={(key) => router.push("/management/users/" + key)}
        aria-label="User Table"
        bottomContent={
          pages > 1 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn key="depositRequestId">Id</TableColumn>
          <TableColumn key="name">Name</TableColumn>
          <TableColumn key="address">Address</TableColumn>
          <TableColumn key="date">Date</TableColumn>
          <TableColumn key="image">Status</TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody
          items={data?.deposits ?? []}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item: any) => (
            <TableRow key={item?.depositRequestId}>
              <TableCell>{`${item?.depositRequestId.slice(
                0,
                4
              )}...${item?.depositRequestId.slice(-2)}`}</TableCell>
              <TableCell>
                <div className="flex gap-3 items-center">
                  <Image
                    src={item.orchid.imageUrl}
                    classNames={{
                      wrapper: "aspect-square w-20 min-w-20 overflow-hidden",
                      img: "h-full",
                    }}
                  />
                  <div>
                    <div className="text-bold"> {item.orchid.name} </div>
                    <div className="text-foreground-500 text-sm">
                      {item.orchid.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {item.walletAddress.slice(0, 4)}...
                {item.walletAddress.slice(-2)}
              </TableCell>
              <TableCell>
                {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </TableCell>
              <TableCell>{renderChip(item)}</TableCell>
              <TableCell>
                {item.requestStatus === "Pending" ? (
                  <div className="flex items-center">
                    <Button
                      onPress={async () => {
                        await customAxios.put(
                          `${process.env.NEXT_PUBLIC_API}deposit-request`,
                          {
                            depositRequestId: item.depositRequestId,
                            requestStatus: "Rejected",
                          }
                        );
                        alert("You have rejected this request");
                        setCount(count + 1);
                      }}
                      color="primary"
                      variant="light"
                      isIconOnly
                    >
                      <XIcon size={20} strokeWidth={3 / 2} />
                    </Button>
                    <Button
                      onPress={async () => {
                        await customAxios.post(
                          `${process.env.NEXT_PUBLIC_API}blockchain/deposit-for-nft`,
                          {
                            address: item.walletAddress,
                            orchidId: item.orchidId,
                          }
                        );
                        await customAxios.put(
                          `${process.env.NEXT_PUBLIC_API}deposit-request`,
                          {
                            depositRequestId: item.depositRequestId,
                            requestStatus: "Approved",
                          }
                        );
                        alert("You have approved this request and mint NFT");
                        setCount(count + 1);
                      }}
                      color="primary"
                      variant="light"
                      isIconOnly
                    >
                      <CheckIcon size={20} strokeWidth={3 / 2} />
                    </Button>
                  </div>
                ) : null}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
