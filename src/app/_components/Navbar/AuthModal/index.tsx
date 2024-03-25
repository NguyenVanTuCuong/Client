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
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Avatar } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { customAxios } from "@/utils/axios";
import { RootContext } from "@/app/_hooks/RootProvider";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css"

export const AuthModal = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selected, setSelected] = useState<string | number>("login");
  const router = useRouter();

  const { swrs } = useContext(RootContext)!;
  const { profileSwr } = swrs;
  const { mutate } = profileSwr;

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
      try {
        await customAxios.post(
          `${process.env.NEXT_PUBLIC_API}auth/sign-in`,
          values
        );
        toast.success("Login Successfully!");
        await mutate();
        onClose()
      } catch (ex) {
        toast.error(ex as string);
      }
    },
  });

  const signUpFormik = useFormik({
    initialValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
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
      password: Yup.string()
        .min(6, "At least 6 digits")
        .max(50, "Maximum 50")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match" as const)
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API}auth/sign-up`,
          values
        );
        toast.success("Sign Up Successful!");
        onClose()
      } catch (error) {
        toast.error("An error occurred during signup.");
      }
    },
  });

  const [isVisibleSignInPassword, setIsVisibleSignInPassword] = useState(false);
  const [isVisibleSignUpPassword, setIsVisibleSignUpPassword] = useState(false);
  const [isVisibleSignUpConfirmPass, setIsVisibleSignUpConfirmPass] =
    useState(false);

  const toggleVisibilitySignInPassword = () =>
    setIsVisibleSignInPassword(!isVisibleSignInPassword);
  const toggleVisibilitySignUpPassword = () =>
    setIsVisibleSignUpPassword(!isVisibleSignUpPassword);
  const toggleVisibilitySignUpConfirmPass = () =>
    setIsVisibleSignUpConfirmPass(!isVisibleSignUpConfirmPass);

  return (
    <>
      <ToastContainer />
      <Button onPress={onOpen} isIconOnly radius="full">
        <Avatar showFallback src="https://images.unsplash.com/broken" />
      </Button>
      <Modal size="sm" isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange}>
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
                          endContent={
                            <button
                              className="focus"
                              type="button"
                              onClick={toggleVisibilitySignInPassword}
                            >
                              {isVisibleSignInPassword ? (
                                <Eye className="text-2xl text-default-500 pointer-events-none" />
                              ) : (
                                <EyeOff className="text-2xl text-default-500 pointer-events-none" />
                              )}
                            </button>
                          }
                          type={isVisibleSignInPassword ? "text" : "password"}
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
                      <form className="flex flex-col gap-4"  onSubmit={signUpFormik.handleSubmit}
                        onReset={signUpFormik.handleReset}>
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
                          id="username"
                          value={signUpFormik.values.username}
                          onChange={signUpFormik.handleChange}
                          onBlur={signUpFormik.handleBlur}
                          isInvalid={
                            !!(
                              signUpFormik.touched.username &&
                              signUpFormik.errors.username
                            )
                          }
                          errorMessage={
                            signUpFormik.touched.username &&
                            signUpFormik.errors.username
                          }
                          isRequired
                          label="Username"
                          placeholder="Enter your name"
                          type="text"
                        />
                        <Input
                          id="firstName"
                          value={signUpFormik.values.firstName}
                          onChange={signUpFormik.handleChange}
                          onBlur={signUpFormik.handleBlur}
                          isInvalid={
                            !!(
                              signUpFormik.touched.firstName &&
                              signUpFormik.errors.firstName
                            )
                          }
                          errorMessage={
                            signUpFormik.touched.firstName &&
                            signUpFormik.errors.firstName
                          }
                          isRequired
                          label="First Name"
                          placeholder="Enter your first name"
                          type="text"
                        />
                        <Input
                          id="lastName"
                          value={signUpFormik.values.lastName}
                          onChange={signUpFormik.handleChange}
                          onBlur={signUpFormik.handleBlur}
                          isInvalid={
                            !!(
                              signUpFormik.touched.lastName &&
                              signUpFormik.errors.lastName
                            )
                          }
                          errorMessage={
                            signUpFormik.touched.lastName &&
                            signUpFormik.errors.lastName
                          }
                          isRequired
                          label="Last Name"
                          placeholder="Enter your last name"
                          type="text"
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
                          endContent={
                            <button
                              className="focus"
                              type="button"
                              onClick={toggleVisibilitySignUpPassword}
                            >
                              {isVisibleSignUpPassword ? (
                                <Eye className="text-2xl text-default-500 pointer-events-none" />
                              ) : (
                                <EyeOff className="text-2xl text-default-500 pointer-events-none" />
                              )}
                            </button>
                          }
                          type={isVisibleSignUpPassword ? "text" : "password"}
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
                          endContent={
                            <button
                              className="focus"
                              type="button"
                              onClick={toggleVisibilitySignUpConfirmPass}
                            >
                              {isVisibleSignUpConfirmPass ? (
                                <Eye className="text-2xl text-default-500 pointer-events-none" />
                              ) : (
                                <EyeOff className="text-2xl text-default-500 pointer-events-none" />
                              )}
                            </button>
                          }
                          type={
                            isVisibleSignUpConfirmPass ? "text" : "password"
                          }
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
                          <Button fullWidth color="primary" type="submit">
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
