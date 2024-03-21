"use client";
import { FactoryContract, NFT } from "@/blockchain/factory";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
  Tab,
  Tabs,
  Image,
  Switch,
  Button,
  Spacer,
  Chip,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { InitializeAuctionModal } from "../profile/_components/AllTabs/InitializeAuctionModal";
import { NftContract } from "@/blockchain/nft";
import { useSDK } from "@metamask/sdk-react";
import { AuctionContract } from "@/blockchain/auction";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Aunction {
  address: string;
  tokenId: number;
  isTerminated: boolean;
  initialAmount: number;
  info: NFT;
}

const Page = () => {
  const [auctions, setAunctions] = useState<Array<Aunction>>([]);
  const { provider, account } = useSDK();
  useEffect(() => {
    if (!account) return;
    const handleEffect = async () => {
      const factoryContract = new FactoryContract(provider, account);
      const newAuctions: Array<Aunction> = [];
      const allContracts = await factoryContract.getAllAuctionContracts();
      const promises: Array<Promise<void>> = [];

      for (const address of allContracts) {
        promises.push(
          (async () => {
            const contract = new AuctionContract(address, provider, account);
            const tokenId = Number(await contract.tokenId());
            const isTerminated = await contract.isTerminated();
            const initialAmount = await contract.initialAmount();
            const _initialAmount =
              Number((BigInt(initialAmount) * BigInt(100000)) / BigInt(10e17)) /
              100000;
            const nftContract = new NftContract(provider, account);
            const info = await nftContract.getNFTInfo(BigInt(tokenId));
            newAuctions.push({
              address,
              initialAmount: _initialAmount,
              isTerminated,
              tokenId,
              info,
            });
          })()
        );
      }
      await Promise.all(promises);
      setAunctions(newAuctions);
    };
    handleEffect();
  }, [account]);

  const router = useRouter()

  return (
    <div className="max-w-[1024px] w-full m-auto px-6">
      <Spacer y={6} />
      <div className="text-3xl font-semibold">Auctions</div>
      <Spacer y={6} />
      <div className="grid grid-cols-3 gap-4">
        {auctions.map((auction, index) => (
          <Card
            isPressable
            onPress={() => router.push(`/auctions/${auction.address}`)}
            shadow="none"
            className="!border !border-divider !shadow-none"
            key={index}
          >
            <CardBody className="p-4">
              <div>
                <Link
                  href={`https://baobab.klaytnscope.com/account/${auction.address}`}
                  color="foreground"
                  showAnchorIcon
                  className="font-bold text-2xl"
                >{`${auction.address.slice(0, 4)}...${auction.address.slice(
                  -2
                )}`}</Link>
                <Spacer y={6} />

                <div className="flex items-center justify-between">
                  <Image
                    radius="full"
                    className="w-12 h-12 min-w-12"
                    src={auction.info.imageUrl}
                  />
                  <div>
                    <div className="font-bold">{auction.info.name}</div>
                    <div className="text-end">#{auction.tokenId}</div>
                  </div>
                </div>
                <Spacer y={4} />
                <div className="text-sm text-foreground-500 flex justify-between items-center">
                  <div>Initial amount: </div>
                  <Chip variant="flat">{auction.initialAmount} KLAY</Chip>
                </div>
                <Spacer y={2} />
                <div className="text-sm text-foreground-500 flex justify-between items-center">
                  <div>Current amount: </div>
                  <Chip variant="flat">{auction.initialAmount} KLAY</Chip>
                </div>

                <Spacer y={6} />
                {auction.isTerminated ? (
                  <Chip color="danger">Terminated</Chip>
                ) : (
                  <Chip color="warning" variant="flat">
                    In progress
                  </Chip>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
