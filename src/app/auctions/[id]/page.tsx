"use client";
import { Aunction } from "@/app/profile/_components/AllTabs";
import { AuctionContract } from "@/blockchain/auction";
import { NftContract } from "@/blockchain/nft";
import { useSDK } from "@metamask/sdk-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Image,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import Web3, { WebSocketProvider } from "web3";
import { HammerIcon } from "lucide-react";
import { BidModal } from "./BidModal";

const Page = () => {
  const params = useParams();
  const address = params.id as string;

  const [auction, setAuction] = useState<Aunction | null>(null);

  const { provider, account } = useSDK();

  const rows = [
    {
      key: "1",
      name: "Tony Reichert",
      role: "CEO",
      status: "Active",
    },
    {
      key: "2",
      name: "Zoey Lang",
      role: "Technical Lead",
      status: "Paused",
    },
    {
      key: "3",
      name: "Jane Fisher",
      role: "Senior Developer",
      status: "Active",
    },
    {
      key: "4",
      name: "William Howard",
      role: "Community Manager",
      status: "Vacation",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "role",
      label: "ROLE",
    },
    {
      key: "status",
      label: "STATUS",
    },
  ];

  useEffect(() => {
    if (!account) return;
    const handleEffect = async () => {
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
      setAuction({
        address,
        info,
        initialAmount: _initialAmount,
        currentAmount: _currentAmount,
        isTerminated,
        tokenId,
      });
    };
    handleEffect();
  }, [account]);

  useEffect(() => {
    const handleEffect = async () => {
      const provider = new WebSocketProvider(
        "wss://public-en-baobab.klaytn.net/ws"
      );
      const web3 = new Web3(provider);
      const lastBlock = await web3.eth.getBlockNumber();
      web3.eth
        .getPastLogs({
          address,
          fromBlock: lastBlock - BigInt(100000),
          toBlock: "latest",
        })
        .then((logs) => {
          console.log(logs);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    handleEffect();
  }, []);

  return (
    <div className="max-w-[1024px] m-auto gap-12 grid grid-cols-3 w-full mt-6">
      <div>
        <Image src={auction?.info.imageUrl} />
        <Spacer y={6} />
        <div className="text-3xl font-bold"> {auction?.info.name} </div>
        <div className="text-xl text-foreground-500">
          {auction?.info.description}
        </div>
        <Spacer y={12} />
        <div> Initital Amount: {auction?.initialAmount} KLAY </div>
        <div> Current Price: {auction?.currentAmount} KLAY </div>
        <Spacer y={4} />
        <BidModal address={address} />
      </div>
      <div className="col-span-2">
        <div className="text-3xl font-bold"> Transactions </div>
        <Spacer y={4} />
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default Page;
