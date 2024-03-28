"use client";
import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Input,
  Pagination,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { customAxios } from "@/utils/axios";
import useSWR from "swr";
import axios from "axios";
import { Search, Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { CreateAuchidModal } from "@/app/profile/_components/AllTabs/CreateAuchidModal";

const fetcher = async (key: string) => {
  const response = await axios.get(key);
  return response as any;
};
const orchids = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const top = 10;
  const skip = (page - 1) * top;
  const getPagingUrl = `${process.env.NEXT_PUBLIC_API}orchid?skip=${skip}&top=${top}`;

  const getSearchUrl = `${process.env.NEXT_PUBLIC_API}orchid/search?skip=${skip}&top=${top}&name=${searchQuery}`;

  const url = searchQuery ? getSearchUrl : getPagingUrl;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher, {
    keepPreviousData: true,
  });

  const pages = useMemo(() => {
    return data?.data.pages ? data.data.pages : 0;
  }, [data?.data.pages, top]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const orchids = useMemo(() => {
    if (!data || !data.data.orchids) return [];

    return data.data.orchids.map((orchid: any) => {
      return { ...orchid };
    });
  }, [data]);
  const handleSearch = (query: any) => {
    setSearchQuery(query);
    setPage(1);
  };

  const onClear = React.useCallback(() => {
    setSearchQuery("");
    setPage(1);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex justify-center gap-1">
          <ToastContainer />
          <Input
            isClearable
            className="w-full m-5 sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<Search />}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onClear={() => onClear()}
          />
          <Button
            color="primary"
            className="m-5"
            endContent={<Plus />}
            onPress={onOpen}
          >
            Create
          </Button>
        </div>
      </div>
      {isLoading ? (
        <Card className="w-[200px] space-y-5 p-4" radius="lg">
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>
      ) : (
        <>
          <div className="gap-2 grid grid-cols-5 grid-rows-2 sm:grid-cols-5 sm:grid-rows-2">
            {orchids.map((item: any, index: number) => (
              <Card
                shadow="sm"
                key={index}
                isPressable
                onPress={() => console.log("item pressed")}
              >
                <CardBody className="overflow-visible p-0">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={item.name}
                    className="w-full object-cover h-[140px]"
                    src={item.imageUrl}
                  />
                </CardBody>
                <CardFooter className="text-small justify-between">
                  <b>{item.name}</b>
                  <b>{item.color}</b>
                  <p className="text-default-500">{item.depositedStatus}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
          {pages > 1 && (
            <Pagination
              className="grid place-content-center"
              isCompact
              loop={true}
              showControls
              initialPage={1}
              page={page ?? 1}
              onChange={(page) => setPage(page)}
              total={pages}
            />
          )}
        </>
      )}
    </>
  );
};

export default orchids;
