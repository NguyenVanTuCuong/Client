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
  CardHeader,
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
import { v4 as uuidv4 } from "uuid"
import Web3, { WebSocketProvider } from "web3";
import { HammerIcon } from "lucide-react";
import { BidModal } from "./BidModal";
import dayjs from "dayjs";

const Page = () => {
  const params = useParams();
  const address = params.id as string;

  const [auction, setAuction] = useState<Aunction | null>(null);

  const { provider, account } = useSDK();

  const [ isOwned, setIsOwned ] = useState(false);

  const columns = [
    {
      key: "bidder",
      label: "BIDDER",
    },
    {
      key: "amount",
      label: "AMOUNT",
    },
    {
      key: "timestamp",
      label: "TIMESTAMP",
    },
  ];

  interface Bid {
        bidder: string;
        amount: bigint;
        timestamp: bigint;
  }

  const [bids, setBids] = useState<Array<Bid>>([])

  useEffect(() => {
    if (!account) return;
    const intervalId = setInterval(async () => {
        const contract = new AuctionContract(address, provider, account);
        const bids = await contract.getAllBids()
        const _mapped = bids.map(({amount, bidder, timestamp}) => ({
            bidder,
            amount: BigInt(amount),
            timestamp: BigInt(timestamp)
        }))
        setBids(_mapped)
    }, 2000);
    return () => clearInterval(intervalId);
  }, [account])

  useEffect(() => {
    if (!account) return;
    const handleEffect = async () => {
      const contract = new AuctionContract(address, provider, account);
      const tokenId = Number(await contract.tokenId());
      const isTerminated = await contract.isTerminated();
      const initialAmount = await contract.initialAmount();
      const owner = await contract.owner();
      console.log(owner)
      if (Web3.utils.toChecksumAddress(owner) === Web3.utils.toChecksumAddress(account)) setIsOwned(true)
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

  return (
    <div className="max-w-[1024px] m-auto gap-12 grid grid-cols-3 w-full mt-6">
      <div>
        <Card>
          <CardHeader className="p-0">
          <Image src={auction?.info.imageUrl} className="rounded-b-none"/>
          </CardHeader>
          <CardBody className="p-4">
          <div className="text-3xl font-bold"> {auction?.info.name} #{auction?.tokenId} </div>
          <div className="flex gap-2">Description: {auction?.info.description} </div>
          <div className="flex gap-2">Color: {auction?.info.color} </div>
          <div className="flex gap-2">Species: {auction?.info.species} </div>
          {
            auction?.isTerminated ?
            <div className="text-danger">Terminated </div>
            : null
          }
         
        </CardBody>
        </Card>
        <Spacer y={12} />
        <div> Initital Amount: {auction?.initialAmount} KLAY </div>
        <div> Current Price: {auction?.currentAmount} KLAY </div>
        <Spacer y={4} />
        <BidModal isDisabled={auction?.isTerminated ?? false} address={address} />
        <Spacer y={2} />
        {
            isOwned ? (
                <Button fullWidth isDisabled={auction?.isTerminated} onPress={
                    async () => {
                        const contract = new AuctionContract(address, provider, account);
                        await contract.endAuction()
                }}> End auction </Button>
            ) : null
        }
       
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
          <TableBody items={bids}>
            {(item) => (
              <TableRow key={uuidv4()}>
                  <TableCell>{`${item.bidder.slice(0, 4)}...${item.bidder.slice(-2)}`}</TableCell>
                  <TableCell>
                    {`${(Number((item.amount * BigInt(100000)) / BigInt(10e17)) / 100000).toString()} KLAY`}
                    </TableCell>
                    <TableCell>
                    {dayjs(Number(item.timestamp) * 1000).format("DD/MM/YYYY HH:mm:ss")}
                    </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default Page;
