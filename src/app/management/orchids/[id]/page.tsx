import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { customAxios } from "@/utils/axios";
import { useRouter } from "next/router";

export default function App() {
  const router = useRouter();

  async (id) => {
    try {
      const response = await customAxios.get(`${process.env.NEXT_PUBLIC_API}/orchids/${id}`);
      // Handle response data
      console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    },
}
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
