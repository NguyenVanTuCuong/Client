"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
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
  Chip,
  ChipProps,
  Tooltip,
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
  EyeIcon,
  Trash2,
  PencilLine,
  BadgeCheck,
} from "lucide-react";
import useSWR from "swr";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { customAxios } from "@/utils/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootContext } from "@/app/_hooks/RootProvider";

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
  const {
    isOpen: isOpenDetailModal,
    onOpen: onOpenDetailModal,
    onClose: onCloseDetailModal,
    onOpenChange: onOpenChangeDetailModal,
  } = useDisclosure();

  const [isOpenDetail, setIsOpenDetail] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const handleDetailsClick = (user: any) => {
    setSelectedUserId(user?.userId);
    setIsOpenDetail(true);
    onOpenDetailModal();
    console.log(user?.userId);
  };
  const { data: user, isLoading: isLoadingDetail } = useSWR(
    isOpenDetail && selectedUserId
      ? `${process.env.NEXT_PUBLIC_API}user/${selectedUserId}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const {
    isOpen: isOpenCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal,
    onOpenChange: onOpenChangeCreateModal,
  } = useDisclosure();
  const {
    isOpen: isOpenEditModal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
    onOpenChange: onOpenChangeEditModal,
  } = useDisclosure();
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const handleEditClick = (user: any) => {
    setSelectedUserId(user?.userId);
    setIsOpenEdit(true);
    onOpenEditModal();
    console.log(user?.userId);
  };
  const { data: userEdit, isLoading: isLoadingEdit } = useSWR(
    isOpenEdit && selectedUserId
      ? `${process.env.NEXT_PUBLIC_API}user/${selectedUserId}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
    onOpenChange: onOpenChangeDeleteModal,
  } = useDisclosure();
  const rootContext = useContext(RootContext);
  const { profileSwr } = rootContext?.swrs || {};
  const currentUserId = profileSwr?.data?.userId;
  const handleDeleteClick = (user: any) => {
    setSelectedUserId(user?.userId);
    console.log(user?.userId);
    console.log(currentUserId);

    if (user?.userId == currentUserId) {
      alert("You cannot delete yourself!");
      toast.error("You cannot delete yourself!");
    } else {
      onOpenDeleteModal();
    }
  };

  const confirmDelete = () => {
    try {
      const responseDelete = customAxios.delete(
        `${process.env.NEXT_PUBLIC_API}user/${selectedUserId}`
      );
      toast.success("Delete Successfully!");
      alert("Delete Successfully!");
      onCloseDeleteModal();
    } catch (ex) {
      toast.error(ex as string);
      alert(ex as string);
    }
  };
  const createFormik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      birthday: "",
      role: "",
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
        alert("Create Successfully!");
      } catch (ex) {
        toast.error(ex as string);
        alert(ex as string);
      }
    },
  });

  const updateFormik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      oldPassword: "",
      firstName: "",
      lastName: "",
      birthday: "",
      status: "",
      role: "User",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Invalid Email").required("Required"),
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
      status: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      try {
        const updateResponse = await customAxios.put(
          `${process.env.NEXT_PUBLIC_API}user/${selectedUserId}`,
          values
        );
        toast.success("Update Successfully!");
        alert("Update Successfully!");

        onCloseEditModal();
      } catch (ex) {
        toast.error(ex as string);
        alert(ex as string);
      }
    },
  });
  useEffect(() => {
    if (userEdit) {
      updateFormik.setValues({
        email: userEdit?.email,
        username: userEdit?.username,
        password: "",
        oldPassword: "",
        firstName: userEdit?.firstName,
        lastName: userEdit?.lastName,
        birthday: userEdit?.birthday.split("T")[0],
        status: userEdit?.status,
        role: userEdit?.role,
      });
    }
  }, [userEdit]);

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

  const handleSearch = (query: any) => {
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

  const handleRoleChangeCreate = (events: any) => {
    createFormik.setFieldValue("role", events.target.value);
  };

  const handleRoleChangeUpdate = (events: any) => {
    updateFormik.setFieldValue("role", events.target.value);
  };

  const statuses = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const handleStatusChange = (events: any) => {
    updateFormik.setFieldValue("status", events.target.value);
  };

  const statusColorMap: Record<string, ChipProps["color"]> = {
    Active: "success",
    Inactive: "danger",
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col flex-1">
        <div className="flex flex-col gap-1 ">
          <div className="flex justify-center gap-1">
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
              onPress={onOpenCreateModal}
            >
              Create
            </Button>
          </div>
        </div>
        {/* Create */}

        <Modal
          size="lg"
          isOpen={isOpenCreateModal}
          onOpenChange={onOpenChangeCreateModal}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <div className="flex flex-col px-3">Create User</div>
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
                          onChange={handleRoleChangeCreate}
                          errorMessage={
                            createFormik.touched.role &&
                            createFormik.errors.role
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
                        <Button type="submit" fullWidth color="primary">
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
        {/* Update */}
        <Modal
          size="lg"
          isOpen={isOpenEditModal}
          onOpenChange={onOpenChangeEditModal}
          onClose={onCloseEditModal}
        >
          <ModalContent>
            {isLoadingEdit ? (
              <Spinner />
            ) : (
              <>
                <ModalHeader>
                  <div className="flex flex-col px-3">Update User</div>
                </ModalHeader>
                <div className="flex flex-col px-3">
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={updateFormik.handleSubmit}
                    onReset={updateFormik.handleReset}
                  >
                    <ModalBody>
                      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Input
                          id="email"
                          value={updateFormik.values.email}
                          onChange={updateFormik.handleChange}
                          onBlur={updateFormik.handleBlur}
                          startContent={<Mail />}
                          isInvalid={
                            !!(
                              updateFormik.touched.email &&
                              updateFormik.errors.email
                            )
                          }
                          errorMessage={
                            updateFormik.touched.email &&
                            updateFormik.errors.email
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
                          value={updateFormik.values.username}
                          onChange={updateFormik.handleChange}
                          onBlur={updateFormik.handleBlur}
                          startContent={<UserRound />}
                          isInvalid={
                            !!(
                              updateFormik.touched.username &&
                              updateFormik.errors.username
                            )
                          }
                          errorMessage={
                            updateFormik.touched.username &&
                            updateFormik.errors.username
                          }
                          isRequired
                          label="Name"
                          placeholder="Enter Username"
                          type="text"
                        />
                      </div>
                      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Input
                          id="oldPassword"
                          value={updateFormik.values.oldPassword}
                          onChange={updateFormik.handleChange}
                          onBlur={updateFormik.handleBlur}
                          startContent={<Lock />}
                          isInvalid={
                            !!(
                              updateFormik.touched.oldPassword &&
                              updateFormik.errors.oldPassword
                            )
                          }
                          errorMessage={
                            updateFormik.touched.oldPassword &&
                            updateFormik.errors.oldPassword
                          }
                          label="Old Password"
                          placeholder="Enter Old Password"
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
                          id="password"
                          value={updateFormik.values.password}
                          onChange={updateFormik.handleChange}
                          onBlur={updateFormik.handleBlur}
                          startContent={<Lock />}
                          isInvalid={
                            !!(
                              updateFormik.touched.password &&
                              updateFormik.errors.password
                            )
                          }
                          errorMessage={
                            updateFormik.touched.password &&
                            updateFormik.errors.password
                          }
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
                        <div className="flex flex-row gap-3">
                          <Input
                            id="firstName"
                            value={updateFormik.values.firstName}
                            onChange={updateFormik.handleChange}
                            onBlur={updateFormik.handleBlur}
                            startContent={<ContactRound />}
                            isInvalid={
                              !!(
                                updateFormik.touched.firstName &&
                                updateFormik.errors.firstName
                              )
                            }
                            errorMessage={
                              updateFormik.touched.firstName &&
                              updateFormik.errors.firstName
                            }
                            isRequired
                            label="First Name"
                            placeholder="Enter First Name"
                            type="text"
                          />
                          <Input
                            id="lastName"
                            value={updateFormik.values.lastName}
                            onChange={updateFormik.handleChange}
                            onBlur={updateFormik.handleBlur}
                            startContent={<ContactRound />}
                            isInvalid={
                              !!(
                                updateFormik.touched.lastName &&
                                updateFormik.errors.lastName
                              )
                            }
                            errorMessage={
                              updateFormik.touched.lastName &&
                              updateFormik.errors.lastName
                            }
                            isRequired
                            label="Last Name"
                            placeholder="Enter Last Name"
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Input
                          id="birthday"
                          value={updateFormik.values.birthday}
                          onChange={updateFormik.handleChange}
                          onBlur={updateFormik.handleBlur}
                          startContent={<Cake />}
                          isInvalid={
                            !!(
                              updateFormik.touched.birthday &&
                              updateFormik.errors.birthday
                            )
                          }
                          errorMessage={
                            updateFormik.touched.birthday &&
                            updateFormik.errors.birthday
                          }
                          isRequired
                          label="Birthday"
                          placeholder="Enter Birthday"
                          type="date"
                        />
                      </div>
                      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Select
                          label="Status"
                          placeholder="Select Status"
                          className="max-w"
                          value={updateFormik.values.status}
                          isRequired
                          startContent={<BadgeCheck />}
                          onChange={handleStatusChange}
                          errorMessage={
                            updateFormik.touched.status &&
                            updateFormik.errors.status
                          }
                        >
                          {statuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Select
                          label="Role"
                          placeholder="Select Role"
                          className="max-w"
                          selectedKeys={updateFormik.values.role}
                          value={updateFormik.values.role}
                          isRequired
                          startContent={<UserRound />}
                          onChange={handleRoleChangeUpdate}
                          errorMessage={
                            updateFormik.touched.role &&
                            updateFormik.errors.role
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
                        <Button type="submit" fullWidth color="primary">
                          Update
                        </Button>
                      </div>
                    </ModalFooter>
                  </form>
                </div>
              </>
            )}
          </ModalContent>
        </Modal>
        {/* Delete */}
        <Modal
          isOpen={isOpenDeleteModal}
          onOpenChange={onOpenChangeDeleteModal}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Delete User
                </ModalHeader>
                <ModalBody>
                  <p>Are you sure you wanna delete this user?</p>
                </ModalBody>
                <ModalFooter>
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
        <Table
          className="px-10"
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
            <TableColumn key="actions" align="center">
              Actions
            </TableColumn>
          </TableHeader>
          <TableBody
            items={formattedUsers}
            loadingContent={<Spinner />}
            loadingState={loadingState}
          >
            {(item) => (
              <TableRow key={(item as any)?.userId}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "status" ? (
                      <Chip
                        className="capitalize"
                        color={statusColorMap[item[columnKey]]}
                        size="sm"
                        variant="flat"
                      >
                        {item[columnKey]}
                      </Chip>
                    ) : columnKey === "actions" ? (
                      <div className="relative flex items-center gap-2">
                        <Tooltip content="Details" size="sm" disableAnimation>
                          <span
                            onClick={() => handleDetailsClick(item)}
                            className="text-sm text-default-400 cursor-pointer active:opacity-50"
                          >
                            <EyeIcon />
                          </span>
                        </Tooltip>
                        <Tooltip content="Edit" size="sm" disableAnimation>
                          <span
                            onClick={() => handleEditClick(item)}
                            className="text-sm text-default-400 cursor-pointer active:opacity-50"
                          >
                            <PencilLine />
                          </span>
                        </Tooltip>
                        <Tooltip
                          color="danger"
                          content="Delete"
                          size="sm"
                          disableAnimation
                        >
                          <span
                            onClick={() => handleDeleteClick(item)}
                            className="text-sm text-danger cursor-pointer active:opacity-50"
                          >
                            <Trash2 />
                          </span>
                        </Tooltip>
                      </div>
                    ) : (
                      <>
                        {item[columnKey] === null
                          ? "Not Provided"
                          : item[columnKey]}
                      </>
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Modal
          isOpen={isOpenDetailModal}
          onOpenChange={onOpenChangeDetailModal}
          onClose={onCloseDetailModal}
        >
          <ModalContent>
            {isLoadingDetail ? (
              <Spinner />
            ) : (
              <>
                <ModalHeader>
                  <div className="flex flex-col text-large font-bold">
                    User Details
                  </div>
                </ModalHeader>
                <ModalBody className="p-6 bg-white rounded-lg shadow-md">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <span className="font-semibold">Email:</span>{" "}
                      {user?.email}
                    </div>
                    <div>
                      <span className="font-semibold">Username:</span>{" "}
                      {user?.username}
                    </div>
                    <div>
                      <span className="font-semibold">First Name:</span>{" "}
                      {user?.firstName}
                    </div>
                    <div>
                      <span className="font-semibold">Last Name:</span>{" "}
                      {user?.lastName}
                    </div>
                    <div>
                      <span className="font-semibold">Birthday:</span>{" "}
                      {user?.birthday === "0001-01-01T00:00:00"
                        ? "Not Provided"
                        : new Date(user?.birthday).toLocaleDateString("en-GB")}
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span>{" "}
                      {user?.status}
                    </div>
                    <div>
                      <span className="font-semibold">Role:</span> {user?.role}
                    </div>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default users;
