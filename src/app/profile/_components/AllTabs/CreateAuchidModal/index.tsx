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
} from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import { customAxios } from "@/utils/axios";
import Dropzone from "react-dropzone";
import { FileUpIcon } from "lucide-react";

export const CreateAuchidModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
    },
  });

  const onDrop = (files: Array<File>) => {
    formik.setFieldValue("imageFile", files.at(0));
  };

  return (
    <>
      <Button onPress={onOpen}>Create Auchid</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
            <ModalHeader className="flex flex-col gap-1">
              Create Auchid
            </ModalHeader>
            <ModalBody>
              <Input
                id="name"
                label="Name"
                onChange={formik.handleChange}
                value={formik.values.name}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.name && formik.errors.name)}
                errorMessage={formik.touched.name && formik.errors.name}
              />
              <Input
                id="description"
                label="Description"
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
                onChange={formik.handleChange}
                value={formik.values.color}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.color && formik.errors.color)}
                errorMessage={formik.touched.color && formik.errors.color}
              />
              <Input
                id="origin"
                label="Origin"
                onChange={formik.handleChange}
                value={formik.values.origin}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.origin && formik.errors.origin)}
                errorMessage={formik.touched.origin && formik.errors.origin}
              />
              <Input
                id="species"
                label="Species"
                onChange={formik.handleChange}
                value={formik.values.species}
                onBlur={formik.handleBlur}
                isInvalid={!!(formik.touched.species && formik.errors.species)}
                errorMessage={formik.touched.species && formik.errors.species}
              />
              <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {formik.values.imageFile ? (
                      <Image
                        src={URL.createObjectURL(formik.values.imageFile)}
                        classNames={{
                          wrapper:
                            "aspect-video overflow-hidden grid place-content-center w-full",
                        }}
                      />
                    ) : (
                      <div className="h-28 grid place-items-center rounded-large border-1">
                        <FileUpIcon className="w-12 h-12 text-foreground-500" />
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light">
                Close
              </Button>
              <Button type="submit" color="primary">
                Create
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
