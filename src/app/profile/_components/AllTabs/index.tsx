"use client";

import { FactoryContract } from "@/blockchain/factory";
import { NFT, NftContract } from "@/blockchain/nft";
import { useSDK } from "@metamask/sdk-react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  Image,
  CardFooter,
  Link,
  Button,
  Switch,
  Divider,
  Spacer,
  Chip,
} from "@nextui-org/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import Web3, { Address } from "web3";
import { InitializeAuctionModal } from "./InitializeAuctionModal";
import { AuctionContract } from "@/blockchain/auction";
import { customAxios } from "@/utils/axios";
import axios from "axios";
import { CreateAuchidModal } from "./CreateAuchidModal";
import { useRouter } from "next/navigation";

export interface Aunction {
  address: string;
  tokenId: number;
  isTerminated: boolean;
  initialAmount: number;
  info: NFT;
  currentAmount?: number;
}

interface ResetContextValue {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

export const ResetContext = createContext<ResetContextValue | null>(null);

export const AllTabs = () => {
  const [count, setCount] = useState(0);

  const [NFTs, setNFTs] = useState<Array<NFT>>([]);
  const [auctions, setAuctions] = useState<Array<Aunction>>([]);
  const { provider, account } = useSDK();

  const [orchids, setOrchids] = useState<Array<any>>([]);

  useEffect(() => {
    const handleEffect = async () => {
      const req = (await customAxios.get(
        `${process.env.NEXT_PUBLIC_API}orchid/owned?skip=0&top=99`
      )) as any;
      console.log(req);
      setOrchids(req.orchids);
    };
    handleEffect();
  }, [count]);
  useEffect(() => {
    if (!account) return;
    const handleEffect = async () => {
      const nftContract = new NftContract(provider, account);
      const allNFTs = await nftContract.getAllNfts();
      setNFTs(allNFTs);
    };
    handleEffect();
  }, [account]);

  useEffect(() => {
    if (!account) return;
    const handleEffect = async () => {
      const factoryContract = new FactoryContract(provider, account);
      const newAuctions: Array<Aunction> = [];
      const allContracts = await factoryContract.getAllOwnedAuctionContracts(
        account
      );
      console.log(allContracts);
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
            const currentAmount = await contract.currentAmount();
            const _currentAmount =
              Number((BigInt(currentAmount) * BigInt(100000)) / BigInt(10e17)) /
              100000;
            const nftContract = new NftContract(provider, account);
            const info = await nftContract.getNFTInfo(BigInt(tokenId));
            newAuctions.push({
              address,
              initialAmount: _initialAmount,
              currentAmount: _currentAmount,
              isTerminated,
              tokenId,
              info,
            });
          })()
        );
      }
      await Promise.all(promises);
      setAuctions(newAuctions);
    };
    handleEffect();
  }, [account]);

  const router = useRouter();

  return (
    <ResetContext.Provider value={{ count, setCount }}>
      <Tabs
        color="primary"
        variant="underlined"
        aria-label="Options"
        classNames={{
          panel: "!py-6 !px-0",
        }}
      >
        <Tab key="orchid" title="Orchids">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-semibold"> Orchids </div>
            <CreateAuchidModal />
          </div>

          <Spacer y={6} />
          <div className="grid grid-cols-3 gap-6">
            {orchids.map((orchid) => (
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
                <CardFooter className="p-4 pt-2 gap-4 inline">
                  <div className="text-foreground-500 text-sm">
                    <div className="flex gap-2 items-center justify-between">
                      <div>Deposited Status:</div>{" "}
                      <Chip
                        variant="flat"
                        color={
                          orchid.depositedStatus === "Available"
                            ? "success"
                            : "warning"
                        }
                      >
                        {orchid.depositedStatus}
                      </Chip>
                    </div>
                    <Spacer y={2} />
                    <div className="flex gap-2 items-center justify-between">
                      <div>Approval Status:</div>{" "}
                      <Chip
                        variant="flat"
                        color={
                          orchid.approvalStatus === "Available"
                            ? "success"
                            : "warning"
                        }
                      >
                        {orchid.approvalStatus}
                      </Chip>
                    </div>
                    <Spacer y={4} />
                  </div>
                  {orchid.depositedStatus === "Available" &&
                  orchid.approvalStatus === "Available" ? (
                    <Button
                      color="primary"
                      onPress={async () => {
                        await customAxios.post(
                          `${process.env.NEXT_PUBLIC_API}deposit-request`,
                          {
                            orchidId: orchid.orchidId,
                            title: "Deposit Request",
                            description: "Please mint an NFT for me",
                            walletAddress: account,
                          }
                        );
                        alert("Deposit success");
                        setCount(count + 1);
                      }}
                      className="w-full"
                    >
                      Deposit for NFT
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            ))}
          </div>
        </Tab>
        <Tab key="photos" title="NFTs">
          <>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-semibold"> NFTs </div>
              {/* <CreateAuchidModal /> */}
            </div>
            <Spacer y={6} />
            <div className="grid grid-cols-3 gap-6">
              {NFTs.map((nft) => (
                <Card shadow="none" className="border border-radius">
                  <CardHeader className="p-0">
                    <div className="aspect-video overflow-hidden grid place-content-center">
                      <Image
                        className="rounded-b-none"
                        key={nft.tokenId.toString()}
                        src={nft.imageUrl}
                      />
                    </div>
                  </CardHeader>
                  <CardBody className="p-4">
                    <div className="text-lg font-bold">
                      {nft.name} #{nft.tokenId.toString()}
                    </div>
                    <Link
                      size="sm"
                      className="text-foreground-500"
                      isExternal
                      showAnchorIcon
                      href={`https://baobab.klaytnscope.com/account/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}`}
                    >
                      {process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS?.slice(
                        0,
                        4
                      )}
                      ...
                      {process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS?.slice(-2)}
                    </Link>
                  </CardBody>
                  <CardFooter className="p-4 pt-2 gap-2">
                    <InitializeAuctionModal tokenId={nft.tokenId} />
                    <Button
                      fullWidth
                      variant="light"
                      onPress={async () => {
                        const res = (await customAxios.post(
                          `${process.env.NEXT_PUBLIC_API}blockchain/withdraw-nft`,
                          {
                            tokenId: Number(nft.tokenId),
                          }
                        )) as any;
                        alert(
                          `Withdraw successfully. Tx has ${res.transactionHash}`
                        );
                      }}
                      color="primary"
                    >
                      Withdraw
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        </Tab>
        <Tab key="music" title="Auctions">
          <div className="text-3xl font-semibold"> Auctions </div>
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
        </Tab>
      </Tabs>
    </ResetContext.Provider>
  );
};
