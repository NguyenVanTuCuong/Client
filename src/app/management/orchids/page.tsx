"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { customAxios } from "@/utils/axios";
import useSWR from "swr";
import axios from "axios";
import { Search, Plus } from "lucide-react";
import { ToastContainer } from "react-toastify";
import { CreateOrchidModal } from "./_components/CreateAuchidModal";
import { useFormik } from "formik";
import { FileDropzone } from "./_components/CreateAuchidModal/FileDropzone";
import { ModalFooter } from "react-bootstrap";

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

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  interface FormikValues {
    id: string;
    name: string;
    description: string;
    color: string;
    origin: string;
    species: string;
    imageFile: File | null;
  }

  const initialValues: FormikValues = {
    id: "",
    name: "",
    description: "",
    color: "",
    origin: "",
    species: "",
    imageFile: null,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        if (values.imageFile === null) return;
        const formData = new FormData();
        formData.append("OrchidId", values.id);
        formData.append("Json.Description", values.description);
        formData.append("Json.Name", values.name);
        formData.append("Json.Color", values.color);
        formData.append("Json.Origin", values.origin);
        formData.append("Json.Species", values.species);
        formData.append("ImageFile", values.imageFile);
        await customAxios.put(
          `${process.env.NEXT_PUBLIC_API}orchid`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Update Successfully!");
        onClose();
      } catch (ex) {
        alert(ex as String);
      }
    },
  });

  const onDrop = useCallback(
    (files: Array<File>) => {
      formik.setFieldValue("imageFile", files.at(0));
    },
    [formik.values.imageFile]
  );
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const handleEditClick = (orchidId: any) => {
    setSelectedOrchidId(orchidId);
    setIsOpenEdit(true);
    onOpen();
  };
  const { data: orchidEdit, isLoading: isLoadingEdit } = useSWR(
    isOpen && selectedOrchidId
      ? `${process.env.NEXT_PUBLIC_API}orchid/${selectedOrchidId}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (orchidEdit) {
      fetch(orchidEdit?.data.imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], "filename.jpg", { type: "image/jpeg" });
          formik.setValues({
            id: orchidEdit?.data.orchidId,
            name: orchidEdit?.data.name,
            description: orchidEdit?.data.description,
            color: orchidEdit?.data.color,
            origin: orchidEdit?.data.origin,
            species: orchidEdit?.data.species,
            imageFile: file,
          });
        })
        .catch((error) => {
          console.error("Error fetching the image:", error);
        });
    }
  }, [orchidEdit]);

  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const handleDeleteClick = (orchidId: any) => {
    setSelectedOrchidId(orchidId);
    onOpenDelete();
  };

  const confirmDelete = () => {
    try {
      const responseDelete = customAxios.delete(
        `${process.env.NEXT_PUBLIC_API}orchid?orchidId=${selectedOrchidId}`
      );
      alert("Delete Successfully!");
      onCloseDelete();
    } catch (ex) {
      alert(ex as string);
    }
  };

  return (
    <>
      <div className="flex flex-col flex-1">
        <div className="flex flex-col gap-1">
          <div className="flex justify-center gap-1">
            <ToastContainer />
            {/* Delete */}
            <Modal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Delete Orchid
                    </ModalHeader>
                    <ModalBody>
                      <p>Are you sure you wanna delete this orchid?</p>
                    </ModalBody>
                    <ModalFooter className="flex flex-row gap-2 px-6 py-4 justify-end">
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button color="primary" onPress={confirmDelete}>
                        Confirm
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
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
                    <b className="text-center w-full">{item.name}</b>
                  </CardBody>
                  <CardFooter className="text-small justify-between">
                    <Button
                      type="submit"
                      color="primary"
                      className="m-5"
                      onPress={() => handleEditClick(item.orchidId)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="submit"
                      color="danger"
                      className="m-5"
                      onPress={() => handleDeleteClick(item.orchidId)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {/* Update */}
            <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
              <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                <ModalContent className="flex ">
                  {isLoadingEdit ? (
                    <Spinner />
                  ) : (
                    <>
                      <ModalHeader className="p-6 pb-0">
                        Update Orchid
                      </ModalHeader>
                      <ModalBody className="p-6 grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-4">
                          <Input
                            id="name"
                            variant="bordered"
                            classNames={{
                              inputWrapper:
                                "!border !border-divider shadow-none",
                            }}
                            label="Name"
                            labelPlacement="outside"
                            placeholder="Input name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              !!(formik.touched.name && formik.errors.name)
                            }
                            errorMessage={
                              formik.touched.name && formik.errors.name
                            }
                          />
                          <Textarea
                            id="description"
                            classNames={{
                              inputWrapper:
                                "!border !border-divider shadow-none",
                            }}
                            label="Description"
                            labelPlacement="outside"
                            variant="bordered"
                            placeholder="Input description"
                            onChange={formik.handleChange}
                            value={formik.values.description}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              !!(
                                formik.touched.description &&
                                formik.errors.description
                              )
                            }
                            errorMessage={
                              formik.touched.description &&
                              formik.errors.description
                            }
                          />
                          <Input
                            id="color"
                            label="Color"
                            classNames={{
                              inputWrapper:
                                "!border !border-divider shadow-none",
                            }}
                            labelPlacement="outside"
                            variant="bordered"
                            placeholder="Input color"
                            onChange={formik.handleChange}
                            value={formik.values.color}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              !!(formik.touched.color && formik.errors.color)
                            }
                            errorMessage={
                              formik.touched.color && formik.errors.color
                            }
                          />
                          <Input
                            id="origin"
                            label="Origin"
                            classNames={{
                              inputWrapper:
                                "!border !border-divider shadow-none",
                            }}
                            labelPlacement="outside"
                            variant="bordered"
                            placeholder="Input origin"
                            onChange={formik.handleChange}
                            value={formik.values.origin}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              !!(formik.touched.origin && formik.errors.origin)
                            }
                            errorMessage={
                              formik.touched.origin && formik.errors.origin
                            }
                          />
                          <Input
                            id="species"
                            label="Species"
                            classNames={{
                              inputWrapper:
                                "!border !border-divider shadow-none",
                            }}
                            labelPlacement="outside"
                            variant="bordered"
                            placeholder="Input species"
                            onChange={formik.handleChange}
                            value={formik.values.species}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              !!(
                                formik.touched.species && formik.errors.species
                              )
                            }
                            errorMessage={
                              formik.touched.species && formik.errors.species
                            }
                          />
                        </div>
                        <div className="flex flex-col justify-between items-end">
                          <FileDropzone
                            imageFile={formik.values.imageFile}
                            onDrop={onDrop}
                          />
                          <div className="flex gap-2">
                            <Button
                              color="danger"
                              variant="light"
                              onClick={onClose}
                            >
                              Close
                            </Button>
                            <Button type="submit" color="primary">
                              Update
                            </Button>
                          </div>
                        </div>
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </form>
            </Modal>

            {/* Detail */}
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
