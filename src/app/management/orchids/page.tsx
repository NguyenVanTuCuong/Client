"use client";
import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Pagination,
  Skeleton,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { customAxios } from "@/utils/axios";
import useSWR from "swr";
import axios from "axios";
import { Search, Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { CreateOrchidModal } from "./_components/CreateAuchidModal";

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

  const {
    isOpen: isOpenDetailModal,
    onOpen: onOpenDetailModal,
    onClose: onCloseDetailModal,
    onOpenChange: onOpenChangeDetailModal,
  } = useDisclosure();

  const [isOpenDetail, setIsOpenDetail] = useState(false);

  const [selectedOrchidId, setSelectedOrchidId] = useState(null);
  const handleDetailsClick = (orchidId: any) => {
    setSelectedOrchidId(orchidId);
    setIsOpenDetail(true);
    onOpenDetailModal();
    console.log(orchidId);
    console.log(orchidDetail.data);
  };
  const { data: orchidDetail, isLoading: isLoadingDetails } = useSWR(
    isOpenDetail && selectedOrchidId
      ? `${process.env.NEXT_PUBLIC_API}orchid/${selectedOrchidId}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return (
    <>
      <div className="flex flex-col flex-1">
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
            <CreateOrchidModal />
          </div>
        </div>
        {isLoading ? (
          <Card className="mx-5 w-[200px] space-y-5 p-4" radius="lg">
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
            <div className=" mx-5 gap-2 grid grid-cols-5 grid-rows-2 sm:grid-cols-5 sm:grid-rows-2">
              {orchids.map((item: any, index: number) => (
                <Card
                  shadow="sm"
                  key={index}
                  isPressable
                  onPress={() => handleDetailsClick(item.orchidId)}
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
            <Modal
              isOpen={isOpenDetailModal}
              onOpenChange={onOpenChangeDetailModal}
              onClose={onCloseDetailModal}
            >
              <ModalContent>
                {isLoadingDetails ? (
                  <Spinner />
                ) : (
                  <>
                    <ModalHeader>
                      <div className="flex flex-col text-2xl font-bold text-center">
                        Orchid Details
                      </div>
                    </ModalHeader>
                    <ModalBody className="p-5 bg-white rounded-lg shadow-md">
                      <Card shadow="sm" key={orchidDetail?.data.orchidId}>
                        <CardBody className="overflow-visible p-0">
                          <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt={orchidDetail?.data.name}
                            className="w-full object-cover h-[300px]"
                            src={orchidDetail?.data.imageUrl}
                          />
                          <div className="p-3 text-lg font-bold text-center">
                            Name: {orchidDetail?.data.name}
                          </div>
                        </CardBody>
                        <CardFooter className="text-sm text-center justify-between bg-gray-100 p-3">
                          <div>
                            <span className="font-bold">Color:</span>{" "}
                            {orchidDetail?.data.color}
                          </div>
                          <div>
                            <span className="font-bold">Origin:</span>{" "}
                            {orchidDetail?.data.origin}
                          </div>
                          <div>
                            <span className="font-bold">Species:</span>{" "}
                            {orchidDetail?.data.species}
                          </div>
                        </CardFooter>
                        <div className="flex flex-col p-3 text-sm">
                          <b className="text-lg font-bold">
                            Deposited Status:{" "}
                            {orchidDetail?.data.depositedStatus}
                          </b>
                          <b className="text-lg font-bold">
                            Approval Status: {orchidDetail?.data.approvalStatus}
                          </b>
                        </div>
                      </Card>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
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
      </div>
    </>
  );
};

export default orchids;
