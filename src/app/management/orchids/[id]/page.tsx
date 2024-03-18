import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { customAxios } from "@/utils/axios";
import { useRouter } from "next/router";

export default function App() {
  const router = useRouter();
  return (
    <Card>
      <CardBody>
        <p>UserId</p>
        <p>Email</p>
        <p>Role</p>
      </CardBody>
    </Card>
  );
}
