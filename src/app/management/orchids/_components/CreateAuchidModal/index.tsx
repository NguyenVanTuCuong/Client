import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Image,
  Textarea,
} from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useCallback, useContext, useMemo } from "react";
import { customAxios } from "@/utils/axios";
import Dropzone from "react-dropzone";
import { FileUpIcon, Plus } from "lucide-react";
import { FileDropzone } from "./FileDropzone";

export const CreateOrchidModal = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  interface FormikValues {
    name: string;
    description: string;
    color: string;
    origin: string;
    species: string;
    imageFile: File | null;
  }

  const initialValues: FormikValues = {
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
      if (values.imageFile === null) return;
      const formData = new FormData();
      formData.append("Json.Name", values.name);
      formData.append("Json.Description", values.description);
      formData.append("Json.Name", values.name);
      formData.append("Json.Color", values.color);
      formData.append("Json.Origin", values.origin);
      formData.append("Json.Species", values.species);
      formData.append("ImageFile", values.imageFile);
      await customAxios.post(`${process.env.NEXT_PUBLIC_API}orchid`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onClose();
    },
  });

  const onDrop = useCallback(
    (files: Array<File>) => {
      formik.setFieldValue("imageFile", files.at(0));
    },
    [formik.values.imageFile]
  );

  return (
    <>
      <Button
        color="primary"
        className="m-5"
        endContent={<Plus />}
        onPress={onOpen}
      >
        Create
      </Button>
      <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
          <ModalContent className="flex ">
            <ModalHeader className="p-6 pb-0">Create Auchid</ModalHeader>
            <ModalBody className="p-6 grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <Input
                  id="name"
                  variant="bordered"
                  classNames={{
                    inputWrapper: "!border !border-divider shadow-none",
                  }}
                  label="Name"
                  labelPlacement="outside"
                  placeholder="Input name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.name && formik.errors.name)}
                  errorMessage={formik.touched.name && formik.errors.name}
                />
                <Textarea
                  id="description"
                  classNames={{
                    inputWrapper: "!border !border-divider shadow-none",
                  }}
                  label="Description"
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Input description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.description && formik.errors.description)
                  }
                  errorMessage={
                    formik.touched.description && formik.errors.description
                  }
                />
                <Input
                  id="color"
                  label="Color"
                  classNames={{
                    inputWrapper: "!border !border-divider shadow-none",
                  }}
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Input color"
                  onChange={formik.handleChange}
                  value={formik.values.color}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.color && formik.errors.color)}
                  errorMessage={formik.touched.color && formik.errors.color}
                />
                <Input
                  id="origin"
                  label="Origin"
                  classNames={{
                    inputWrapper: "!border !border-divider shadow-none",
                  }}
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Input origin"
                  onChange={formik.handleChange}
                  value={formik.values.origin}
                  onBlur={formik.handleBlur}
                  isInvalid={!!(formik.touched.origin && formik.errors.origin)}
                  errorMessage={formik.touched.origin && formik.errors.origin}
                />
                <Input
                  id="species"
                  label="Species"
                  classNames={{
                    inputWrapper: "!border !border-divider shadow-none",
                  }}
                  labelPlacement="outside"
                  variant="bordered"
                  placeholder="Input species"
                  onChange={formik.handleChange}
                  value={formik.values.species}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    !!(formik.touched.species && formik.errors.species)
                  }
                  errorMessage={formik.touched.species && formik.errors.species}
                />
              </div>
              <div className="flex flex-col justify-between items-end">
                <FileDropzone
                  imageFile={formik.values.imageFile}
                  onDrop={onDrop}
                />
                <div className="flex gap-2">
                  <Button color="danger" variant="light" onClick={onClose}>
                    Close
                  </Button>
                  <Button type="submit" color="primary">
                    Create
                  </Button>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
