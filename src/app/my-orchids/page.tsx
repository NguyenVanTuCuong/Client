"use client";
import {
  Card,
  CardBody,
  Pagination,
  Image,
  CardFooter,
  Skeleton,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import React, { useCallback, useState } from "react";
import useSWR from "swr";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import { CloudUpload } from "lucide-react";
import { UserRound } from "lucide-react";

const fetcher = async (key: string) => {
  const response = await axios.get(key);
  return response.data;
};

interface Image {}

const myOrchids = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = useState(1);
  const swr = useSWR(
    `https://swapi.py4e.com/api/people/?page=${page}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );
  const createFormik = useFormik({
    initialValues: {
      name: "",
      image: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(2, "At least 2")
        .max(50, "Maximum 50")
        .required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const [image, setImage] = useState("");
  const onDrop = (acceptedFiles: Array<File>) => {
    const file = acceptedFiles[0];
    setImage(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  console.log(data);

  return (
    <div>
      <Button color="primary" className="m-5" onPress={onOpen}>
        Create
      </Button>
      <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <>
            <ModalHeader>
              <div className="flex flex-col px-3">Add Orchid</div>
            </ModalHeader>
            <div className="flex flex-col px-3">
              <form
                className="flex flex-col gap-4"
                onSubmit={createFormik.handleSubmit}
                onReset={createFormik.handleReset}
              >
                <ModalBody>
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Input
                      id="name"
                      value={createFormik.values.name}
                      onChange={createFormik.handleChange}
                      onBlur={createFormik.handleBlur}
                      endContent={<UserRound />}
                      isInvalid={
                        !!(
                          createFormik.touched.name && createFormik.errors.name
                        )
                      }
                      errorMessage={
                        createFormik.touched.name && createFormik.errors.name
                      }
                      isRequired
                      label="Name"
                      placeholder="Enter Name"
                      type="text"
                    />
                  </div>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {image ? (
                      <Image
                        id="image"
                        alt="NextUI hero Image"
                        src={image}
                        className="rounded-large place-items-center w-full"
                      />
                    ) : isDragActive ? (
                      <div className="rounded-large grid place-items-center h-40 border-dashed border-2 border-sky-500 ...">
                        <div className="grid place-items-center">
                          <CloudUpload />
                          <p>Drop here</p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-large grid place-items-center h-40 border-dashed border-2 border-sky-500 ...">
                        <div className="grid place-items-center">
                          <CloudUpload />
                          <p>Drop files here or click to upload</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <div className="flex w-full">
                    <Button type="submit" fullWidth color="primary">
                      Create
                    </Button>
                  </div>
                </ModalFooter>
              </form>
            </div>
          </>
        </ModalContent>
      </Modal>
      {swr.isValidating ? (
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
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
          {swr.data?.results.map((item: any, index: number) => (
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
                  alt={item.title}
                  className="w-full object-cover h-[140px]"
                  src={item.img}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>{item.name}</b>
                <p className="text-default-500">{item.height}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Pagination
        className="grid place-content-center"
        isCompact
        loop={true}
        showControls
        initialPage={1}
        page={page ?? 1}
        onChange={setPage}
        total={Math.ceil((swr.data?.count ?? 0) / 10)}
      />
    </div>
  );
};
export default myOrchids;
