import React, { useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card,
  CardBody,
  Input,
  Link,
  Tab,
  Tabs,
} from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Avatar } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { customAxios } from "@/utils/axios";
import { RootContext } from "@/app/_hooks/RootProvider";

export const AuthModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selected, setSelected] = useState<string | number>("login");
  const router = useRouter();

  const { swrs } = useContext(RootContext)!
  const { profileSwr } = swrs
  const { mutate } = profileSwr

  const signInFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("Invalid Email").required("Required"),
      password: Yup.string().min(6, "At least 6 digits").required("Required"),
    }),
    onSubmit: async (values) => {
      await customAxios.post(
        `${process.env.NEXT_PUBLIC_API}auth/sign-in`,
        values
      )
      await mutate()
    },
  });

  const signUpFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(2, "At least 2")
        .max(50, "Maximum 50")
        .required("Required"),
      email: Yup.string().email("Invalid Email").required("Required"),
      password: Yup.string().min(6, "At least 6 digits").required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match" as const)
        .required("Required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}auth/signin`,
        JSON.stringify(values)
      );
      console.log(response.data);
    },
  });

  return (
    <>
      <Button onPress={onOpen} isIconOnly radius="full">
        <Avatar showFallback src="https://images.unsplash.com/broken" />
      </Button>
      <Modal size="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex flex-col px-3 py-6">
                  <Tabs
                    fullWidth
                    size="md"
                    aria-label="Tabs form"
                    selectedKey={selected}
                    onSelectionChange={setSelected}
                  >
                    <Tab key="login" title="Login">
                      <form
                        className="flex flex-col gap-4"
                        onSubmit={signInFormik.handleSubmit}
                        onReset={signInFormik.handleReset}
                      >
                        <Input
                          id="email"
                          value={signInFormik.values.email}
                          onChange={signInFormik.handleChange}
                          onBlur={signInFormik.handleBlur}
                          //   endContent={
                          //   }
                          isInvalid={
                            !!(
                              signInFormik.touched.email &&
                              signInFormik.errors.email
                            )
                          }
                          errorMessage={
                            signInFormik.touched.email &&
                            signInFormik.errors.email
                          }
                          isRequired
                          label="Email"
                          placeholder="Enter your email"
                          type="email"
                        />
                        <Input
                          id="password"
                          value={signInFormik.values.password}
                          onChange={signInFormik.handleChange}
                          onBlur={signInFormik.handleBlur}
                          //   endContent={
                          //   }
                          isInvalid={
                            !!(
                              signInFormik.touched.password &&
                              signInFormik.errors.password
                            )
                          }
                          errorMessage={
                            signInFormik.touched.password &&
                            signInFormik.errors.password
                          }
                          isRequired
                          label="Password"
                          placeholder="Enter your password"
                          type="password"
                        />
                        <p className="text-center text-small">
                          Need to create an account?{" "}
                          <Link
                            size="sm"
                            onPress={() => setSelected("sign-up")}
                            style={{ cursor: "pointer" }}
                          >
                            Sign up
                          </Link>
                        </p>
                        <div className="flex gap-2 justify-end">
                          <Button type="submit" fullWidth color="primary">
                            Login
                          </Button>
                        </div>
                      </form>
                    </Tab>
                    <Tab key="sign-up" title="Sign up">
                      <form className="flex flex-col gap-4">
                        <Input
                          id="name"
                          value={signUpFormik.values.name}
                          onChange={signUpFormik.handleChange}
                          onBlur={signUpFormik.handleBlur}
                          isInvalid={
                            !!(
                              signUpFormik.touched.name &&
                              signUpFormik.errors.name
                            )
                          }
                          errorMessage={
                            signUpFormik.touched.name &&
                            signUpFormik.errors.name
                          }
                          isRequired
                          label="Name"
                          placeholder="Enter your name"
                          type="text"
                        />
                        <Input
                          id="email"
                          value={signUpFormik.values.email}
                          onChange={signUpFormik.handleChange}
                          onBlur={signUpFormik.handleBlur}
                          isInvalid={
                            !!(
                              signUpFormik.touched.email &&
                              signUpFormik.errors.email
                            )
                          }
                          errorMessage={
                            signUpFormik.touched.email &&
                            signUpFormik.errors.email
                          }
                          isRequired
                          label="Email"
                          placeholder="Enter your email"
                          type="email"
                        />
                        <Input
                          id="password"
                          value={signUpFormik.values.password}
                          onChange={signUpFormik.handleChange}
                          onBlur={signUpFormik.handleBlur}
                          isInvalid={
                            !!(
                              signUpFormik.touched.password &&
                              signUpFormik.errors.password
                            )
                          }
                          errorMessage={
                            signUpFormik.touched.password &&
                            signUpFormik.errors.password
                          }
                          isRequired
                          label="Password"
                          placeholder="Enter your password"
                          type="password"
                        />
                        <Input
                          id="confirmPassword"
                          value={signUpFormik.values.confirmPassword}
                          onChange={signUpFormik.handleChange}
                          onBlur={signUpFormik.handleBlur}
                          isInvalid={
                            !!(
                              signUpFormik.touched.confirmPassword &&
                              signUpFormik.errors.confirmPassword
                            )
                          }
                          errorMessage={
                            signUpFormik.touched.confirmPassword &&
                            signUpFormik.errors.confirmPassword
                          }
                          isRequired
                          label="Confirm Password"
                          placeholder="Enter your password"
                          type="password"
                        />
                        <p className="text-center text-small">
                          Already have an account?{" "}
                          <Link
                            size="sm"
                            onPress={() => setSelected("login")}
                            style={{ cursor: "pointer" }}
                          >
                            Login
                          </Link>
                        </p>
                        <div className="flex gap-2 justify-end">
                          <Button fullWidth color="primary">
                            Sign up
                          </Button>
                        </div>
                      </form>
                    </Tab>
                  </Tabs>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
