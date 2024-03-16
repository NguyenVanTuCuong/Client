"use client";
import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  getKeyValue,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { UserRound } from "lucide-react";
import useSWR from "swr";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const fetcher = async (key: string) => {
  const response = await axios.get(key);
  console.log(response.data);
  return response.data;
};
const users = () => {
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useSWR(
    `https://swapi.py4e.com/api/people?page=${page}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const rowsPerPage = 10;

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);

  const loadingState =
    isLoading || data?.results.length === 0 ? "loading" : "idle";

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
  const router = useRouter();

  return (
    <div>
      <Button color="primary" className="m-5" onPress={onOpen}>
        Create
      </Button>
      <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <>
            <ModalHeader>
              <div className="flex flex-col px-3">Add User</div>
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
      <Table
        selectionMode="single"
        onRowAction={(key) => router.push("/management/users/" + key)}
        aria-label="Example table with client async pagination"
        bottomContent={
          pages > 0 ? (
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
          <TableColumn key="name">Name</TableColumn>
          <TableColumn key="height">Height</TableColumn>
          <TableColumn key="mass">Mass</TableColumn>
          <TableColumn key="birth_year">Birth year</TableColumn>
          {/* <TableColumn key="userId">ID</TableColumn>
        <TableColumn key="email">Email</TableColumn>
        <TableColumn key="username">Username</TableColumn>
        <TableColumn key="firstName">First Name</TableColumn>
        <TableColumn key="lastName">Last Name</TableColumn>
        <TableColumn key="walletAddress">Wallet Address</TableColumn>
        <TableColumn key="birthday">Birthday</TableColumn>
        <TableColumn key="status">Status</TableColumn> */}
        </TableHeader>
        <TableBody
          items={data?.results ?? []}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item) => (
            <TableRow key={item?.name}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default users;
