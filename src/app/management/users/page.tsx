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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  Cake,
  Eye,
  EyeOff,
  Plus,
  Search,
  UserRound,
  Lock,
  Mail,
  ContactRound,
} from "lucide-react";
import useSWR from "swr";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { customAxios } from "@/utils/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fetcher = async (key: string) => {
  const response = await customAxios.get(key);
  return response as any;
};
const users = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const top = 10;
  const skip = (page - 1) * top;
  const getPagingUrl = `${process.env.NEXT_PUBLIC_API}user?skip=${skip}&top=${top}`;

  const getSearchUrl = `${process.env.NEXT_PUBLIC_API}user/search?skip=${skip}&top=${top}&input=${searchQuery}`;

  const url = searchQuery ? getSearchUrl : getPagingUrl;

  const { data, isLoading } = useSWR(url, fetcher, {
    keepPreviousData: true,
  });

  const pages = useMemo(() => {
    return data?.pages ? data.pages : 0;
  }, [data?.pages, top]);

  const loadingState = isLoading || data?.pages === 0 ? "loading" : "idle";
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const createFormik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      birthday: "",
      role: "User",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Invalid Email").required("Required"),
      password: Yup.string().min(6, "At least 6 digits").required("Required"),
      username: Yup.string()
        .min(2, "At least 2")
        .max(50, "Maximum 50")
        .required("Required"),
      firstName: Yup.string()
        .min(2, "At least 2")
        .max(50, "Maximum 50")
        .required("Required"),
      lastName: Yup.string()
        .min(2, "At least 2")
        .max(50, "Maximum 50")
        .required("Required"),
      birthday: Yup.string()
        .min(2, "At least 2")
        .max(50, "Maximum 50")
        .required("Required"),
      role: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      try {
        const addResponse = await customAxios.post(
          `${process.env.NEXT_PUBLIC_API}user`,
          values
        );
        toast.success("Create Successfully!");
      } catch (ex) {
        toast.error(ex as string);
      }
    },
  });
  const router = useRouter();

  const formattedUsers = useMemo(() => {
    if (!data || !data.users) return [];

    return data.users.map((user: any) => {
      const formattedBirthday =
        user.birthday === "0001-01-01T00:00:00"
          ? null
          : new Date(user.birthday).toLocaleDateString("en-GB");

      return { ...user, birthday: formattedBirthday };
    });
  }, [data]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const onClear = React.useCallback(() => {
    setSearchQuery("");
    setPage(1);
  }, []);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const roles = [
    { label: "User", value: "User" },
    { label: "Administrator", value: "Administrator" },
  ];

  const handleRoleChange = (events: any) => {
    createFormik.setFieldValue("role", events.target.value);
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-center gap-1">
          <ToastContainer />
          <Input
            isClearable
            className="w-full m-5 sm:max-w-[44%]"
            placeholder="Search by name or email..."
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
      <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
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
                        id="email"
                        value={createFormik.values.email}
                        onChange={createFormik.handleChange}
                        onBlur={createFormik.handleBlur}
                        startContent={<Mail />}
                        isInvalid={
                          !!(
                            createFormik.touched.email &&
                            createFormik.errors.email
                          )
                        }
                        errorMessage={
                          createFormik.touched.email &&
                          createFormik.errors.email
                        }
                        isRequired
                        label="Email"
                        placeholder="Enter Email"
                        type="text"
                      />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Input
                        id="username"
                        value={createFormik.values.username}
                        onChange={createFormik.handleChange}
                        onBlur={createFormik.handleBlur}
                        startContent={<UserRound />}
                        isInvalid={
                          !!(
                            createFormik.touched.username &&
                            createFormik.errors.username
                          )
                        }
                        errorMessage={
                          createFormik.touched.username &&
                          createFormik.errors.username
                        }
                        isRequired
                        label="Name"
                        placeholder="Enter Username"
                        type="text"
                      />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Input
                        id="password"
                        value={createFormik.values.password}
                        onChange={createFormik.handleChange}
                        onBlur={createFormik.handleBlur}
                        startContent={<Lock />}
                        isInvalid={
                          !!(
                            createFormik.touched.password &&
                            createFormik.errors.password
                          )
                        }
                        errorMessage={
                          createFormik.touched.password &&
                          createFormik.errors.password
                        }
                        isRequired
                        label="Password"
                        placeholder="Enter Password"
                        endContent={
                          <button
                            className="focus"
                            type="button"
                            onClick={toggleVisibility}
                          >
                            {isVisible ? (
                              <Eye className="text-2xl text-default-500 pointer-events-none" />
                            ) : (
                              <EyeOff className="text-2xl text-default-500 pointer-events-none" />
                            )}
                          </button>
                        }
                        type={isVisible ? "text" : "password"}
                      />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Input
                        id="firstName"
                        value={createFormik.values.firstName}
                        onChange={createFormik.handleChange}
                        onBlur={createFormik.handleBlur}
                        startContent={<ContactRound />}
                        isInvalid={
                          !!(
                            createFormik.touched.firstName &&
                            createFormik.errors.firstName
                          )
                        }
                        errorMessage={
                          createFormik.touched.firstName &&
                          createFormik.errors.firstName
                        }
                        isRequired
                        label="First Name"
                        placeholder="Enter First Name"
                        type="text"
                      />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Input
                        id="lastName"
                        value={createFormik.values.lastName}
                        onChange={createFormik.handleChange}
                        onBlur={createFormik.handleBlur}
                        startContent={<ContactRound />}
                        isInvalid={
                          !!(
                            createFormik.touched.lastName &&
                            createFormik.errors.lastName
                          )
                        }
                        errorMessage={
                          createFormik.touched.lastName &&
                          createFormik.errors.lastName
                        }
                        isRequired
                        label="Last Name"
                        placeholder="Enter Last Name"
                        type="text"
                      />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Input
                        id="birthday"
                        value={createFormik.values.birthday}
                        onChange={createFormik.handleChange}
                        onBlur={createFormik.handleBlur}
                        startContent={<Cake />}
                        isInvalid={
                          !!(
                            createFormik.touched.birthday &&
                            createFormik.errors.birthday
                          )
                        }
                        errorMessage={
                          createFormik.touched.birthday &&
                          createFormik.errors.birthday
                        }
                        isRequired
                        label="Birthday"
                        placeholder="Enter Birthday"
                        type="date"
                      />
                    </div>
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                      <Select
                        label="Role"
                        placeholder="Select Role"
                        className="max-w"
                        value={createFormik.values.role}
                        isRequired
                        startContent={<UserRound />}
                        onChange={handleRoleChange}
                        errorMessage={
                          createFormik.touched.role && createFormik.errors.role
                        }
                      >
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <div className="flex w-full">
                      <Button
                        type="submit"
                        fullWidth
                        color="primary"
                        onPress={onClose}
                      >
                        Create
                      </Button>
                    </div>
                  </ModalFooter>
                </form>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
      <Table
        className="px-10"
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
          <TableColumn key="email">Email</TableColumn>
          <TableColumn key="username">Username</TableColumn>
          <TableColumn key="firstName">First Name</TableColumn>
          <TableColumn key="role">Role</TableColumn>
          <TableColumn key="status">Status</TableColumn>
        </TableHeader>
        <TableBody
          items={formattedUsers}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item) => (
            <TableRow key={(item as any)?.userId}>
              {(columnKey) => (
                <TableCell
                  style={{
                    backgroundColor:
                      item[columnKey] === null ? "#cccccc" : "inherit",
                  }}
                >
                  {item[columnKey] === null ? "Not Provided" : item[columnKey]}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default users;
