import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import React from "react";
import { AllTabs } from "./_components/AllTabs";

const Page = () => {
  return (
    <div className="max-w-[1024px] w-full m-auto px-6">
      <AllTabs />
    </div>
  );
};

export default Page;
