"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardBody, CardFooter, CardHeader, Chip, Image, Spacer } from "@nextui-org/react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const Page = () => {
  const [orchids, setOrchids] = useState<any>([]);
  useEffect(() => {
    const handleEffect = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}orchid?skip=0&top=4`
      );
      console.log(response.data)
      setOrchids(response.data);
    };
    handleEffect();
  }, []);

  return (
    <div>
      <div className="relative">
        <div className="absolute h-[500px] w-full z-20 grid place-content-center text-[5rem] font-bold text-white">
          Orchid Auction{" "}
        </div>

        <Image
          className="rounded-none w-full"
          radius="none"
          classNames={{
            img: "w-full",
            wrapper:
              "w-full !max-w-none h-[500px] grid place-content-center overflow-hidden",
          }}
          src={"/orchid.jpg"}
        />
      </div>
      <div>
        <Spacer y={6} />
        <div className="max-w-[1024px] mx-auto px-6">
          <div>
            <div className="text-2xl font-semibold">Top Orchids</div>
            <Spacer y={6} />
            <div className="grid grid-cols-4 gap-6">
              {
                (orchids?.orchids as any[])?.map(orchid => 
                  
                    <Card shadow="none" className="border border-divider">
                    <CardHeader className="p-0">
                      <div className="aspect-video overflow-hidden grid place-content-center">
                        <Image
                          className="rounded-b-none"
                          key={orchid.orchidId.toString()}
                          src={orchid.imageUrl}
                        />
                      </div>
                    </CardHeader>
                    <CardBody className="p-4">
                      <div className="text-lg font-bold">{orchid.name}</div>
                      <div className="text-sm text-foreground-500">
                        {orchid.description}
                      </div>
                    </CardBody>
                  </Card>
              )
              }
              </div>
              <Spacer y={6} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
