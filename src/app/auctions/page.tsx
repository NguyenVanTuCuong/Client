"use client"
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
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { InitializeAuctionModal } from "../profile/_components/AllTabs/InitializeAuctionModal";
import { NftContract } from "@/blockchain/nft";
import { useSDK } from "@metamask/sdk-react";
import { AuctionContract } from "@/blockchain/auction";
import { EyeIcon, SignpostIcon } from "lucide-react";
import Web3, { WebSocketProvider } from "web3";

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
            if (isTerminated) return
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

  return (
    <div className="max-w-[1024px] w-full m-auto px-6">
       <Spacer y={6}/>
      <div className="text-3xl">
        All Auctions
      </div>
      <Spacer y={6}/>
      <div className="grid grid-cols-4 gap-4">
        {auctions.map((auction, index) => (
          <Card key={index}>
            <CardHeader className="p-0">
              <Image
                className="rounded-b-none"
                key={auction.tokenId.toString()}
                src={auction.info.imageUrl}
              />
            </CardHeader>
            <CardBody className="p-4">
              <Link
                href={`https://baobab.klaytnscope.com/account/${auction.address}`}
                color="foreground"
                className="text-lg font-bold"
              >{`${auction.address.slice(0, 4)}...${auction.address.slice(
                -2
              )}`}</Link>
              <div className="text-sm text-foreground-500">
                Initial Amount: {auction.initialAmount} KLAY
              </div>
              <div className="text-sm text-foreground-500">
                Token Id: {auction.tokenId.toString()}
              </div>
            </CardBody>
            <CardFooter className="p-4 pt-2">
                <Button fullWidth color="primary" startContent={<EyeIcon size={20} strokeWidth={3/2}/>}> Details </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
