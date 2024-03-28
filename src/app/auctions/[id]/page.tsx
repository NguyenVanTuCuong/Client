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
  Chip,
  Image,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  Link,
} from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";
import Web3, { WebSocketProvider } from "web3";
import { HammerIcon } from "lucide-react";
import { BidModal } from "./BidModal";
import dayjs from "dayjs";

const Page = () => {
  const params = useParams();
  const address = params.id as string;

  const [auction, setAuction] = useState<Aunction | null>(null);

  const { provider, account } = useSDK();

  const [isOwned, setIsOwned] = useState(false);

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

  const [bids, setBids] = useState<Array<Bid>>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (!account) return;

      const contract = new AuctionContract(address, provider, account);
      const bids = await contract.getAllBids();
      const _mapped = bids.map(({ amount, bidder, timestamp }) => ({
        bidder,
        amount: BigInt(amount),
        timestamp: BigInt(timestamp),
      }));
      setBids(_mapped);

      const tokenId = Number(await contract.tokenId());
      const isTerminated = await contract.isTerminated();
      const initialAmount = await contract.initialAmount();
      const owner = await contract.owner();
      console.log(owner);
      if (
        Web3.utils.toChecksumAddress(owner) ===
        Web3.utils.toChecksumAddress(account)
      )
        setIsOwned(true);
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

    // Call the fetchData function immediately
    fetchData();

    // Set up the interval to fetch data every 2 seconds
    const intervalId = setInterval(fetchData, 2000);

    // Clean up the interval
    return () => clearInterval(intervalId);
  }, [account]);
  return (
    <div className="max-w-[1024px] px-6 m-auto gap-12 grid grid-cols-3 w-full mt-6">
      <div>
        <Card shadow="none" className="border border-divider">
          <CardHeader className="p-0">
            <Image
              src={auction?.info.imageUrl}
              classNames={{
                wrapper:
                  "aspect-video overflow-hidden place-content-center grid rounded-b-none",
              }}
            />
          </CardHeader>
          <CardBody className="p-4">
            <div className="text-lg font-bold">
              {auction?.info.name} #{auction?.tokenId}
            </div>
            <div className="text-sm text-foreground-500">
              {auction?.info.description}
            </div>
          </CardBody>
        </Card>
        <Spacer y={6} />
        <div className="flex justify-between items-center">
          <div>Initital amount: </div>
          <Chip variant="flat">{auction?.initialAmount} KLAY </Chip>
        </div>
        <Spacer y={2} />
        <div className="flex justify-between items-center">
          <div>Current amount: </div>
          <Chip variant="flat"> {auction?.currentAmount} KLAY </Chip>
        </div>
        <Spacer y={6} />
        {auction?.isTerminated ? (
          <Button color="danger" isDisabled className="w-full">
            {" "}
            Terminated{" "}
          </Button>
        ) : (
          <>
            {isOwned ? (
              <Button
                fullWidth
                color="primary"
                isDisabled={auction?.isTerminated}
                onPress={async () => {
                  const contract = new AuctionContract(
                    address,
                    provider,
                    account
                  );
                  await contract.endAuction();
                }}
              >
                End auction
              </Button>
            ) : (
              <BidModal
                isDisabled={auction?.isTerminated ?? false}
                address={address}
                orchidId={auction?.info.orchidId as string}
              />
            )}
          </>
        )}
      </div>

      <div className="col-span-2">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-semibold"> Transactions </div>
          <Link
            size="sm"
            href={`https://baobab.klaytnscope.com/account/${address}`}
            showAnchorIcon
          >
            View on chain
          </Link>
        </div>

        <Spacer y={4} />
        <Table removeWrapper aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={bids}>
            {(item) => (
              <TableRow key={uuidv4()}>
                <TableCell>{`${item.bidder.slice(0, 4)}...${item.bidder.slice(
                  -2
                )}`}</TableCell>
                <TableCell>
                  {`${(
                    Number((item.amount * BigInt(100000)) / BigInt(10e17)) /
                    100000
                  ).toString()} KLAY`}
                </TableCell>
                <TableCell>
                  {dayjs(Number(item.timestamp) * 1000).format(
                    "DD/MM/YYYY HH:mm:ss"
                  )}
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
