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
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import Web3, { Address } from "web3";
import { InitializeAuctionModal } from "./InitializeAuctionModal";
import { AuctionContract } from "@/blockchain/auction";
import { customAxios } from "@/utils/axios";
import axios from "axios";
import { CreateAuchidModal } from "./CreateAuchidModal";

export interface Aunction {
  address: string;
  tokenId: number;
  isTerminated: boolean;
  initialAmount: number;
  info: NFT;
  currentAmount?: number;
}

export const AllTabs = () => {
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
  }, []);
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
      setAuctions(newAuctions);
    };
    handleEffect();
  }, [account]);

  return (
    <Tabs variant="underlined" aria-label="Options">
      <Tab key="orchid" title="Orchids">
        <div className="grid grid-cols-4 gap-4">
          {orchids.map((orchid) => (
            <Card>
              <CardHeader className="p-0">
                <Image
                  className="rounded-b-none"
                  key={orchid.orchidId.toString()}
                  src={orchid.imageUrl}
                />
              </CardHeader>
              <CardBody className="p-4">
                <div className="text-lg font-bold">{orchid.name}</div>
                <div className="text-sm text-foreground-500">
                  {orchid.description}
                </div>
              </CardBody>
              <CardFooter className="p-4 pt-2 gap-4 inline">
                <div className="text-foreground-500 text-sm">
                  <div>
                    <div>Status: {orchid.depositedStatus}</div>
                  </div>
                  <Spacer y={2} />
                </div>
                {orchid.depositedStatus === "Available" && orchid.approvalStatus === "Available" ? (
                  <Button
                    onPress={async () => {
                      await customAxios.post(
                        `${process.env.NEXT_PUBLIC_API}deposit-request`,
                        {
                          orchidId: orchid.orchidId,
                          title: "Deposit Request",
                          description: "Please mint an NFT for me",
                          walletAddress: account
                        }
                      );
                      alert("Deposit success")
                    }}
                    className="w-full"
                  >
                    Deposit For Nft
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          ))}
        </div>
        <Spacer y={6} />
        <CreateAuchidModal />
      </Tab>
      <Tab key="photos" title="NFTs">
        <div className="grid grid-cols-4 gap-4">
          {NFTs.map((nft) => (
            <Card>
              <CardHeader className="p-0">
                <Image
                  className="rounded-b-none"
                  key={nft.tokenId.toString()}
                  src={nft.imageUrl}
                />
              </CardHeader>
              <CardBody className="p-4">
                <div className="text-lg font-bold">
                  {nft.name} #{nft.tokenId.toString()}{" "}
                  <Link
                    size="sm"
                    isExternal
                    showAnchorIcon
                    href={`https://baobab.klaytnscope.com/account/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}`}
                  />
                </div>
                <div className="text-sm text-foreground-500">
                  {nft.description}
                </div>
              </CardBody>
              <CardFooter className="p-4 pt-2 gap-4 inline">
                <InitializeAuctionModal tokenId={nft.tokenId} />
                <Spacer y={2} />
                <Button
                  fullWidth
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
      </Tab>
      <Tab key="music" title="Auctions">
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
                <div className="text-sm text-foreground-500 flex items-center gap-2">
                  {auction.isTerminated ? (
                    <div className="text-danger text-sm">Terminated</div>
                  ) : null}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Tab>
    </Tabs>
  );
};
