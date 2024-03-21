import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { NftContract } from "@/blockchain/nft";
import { useSDK } from "@metamask/sdk-react";
import { FactoryContract } from "@/blockchain/factory";

interface InitializeAuctionModalProps {
  tokenId: BigInt;
}

export const InitializeAuctionModal = (props: InitializeAuctionModalProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { provider, account } = useSDK();

  const [amount, setAmount] = useState(0);
  const { tokenId } = props;

  const onPress = async () => {
    const nftContract = new NftContract(provider, account);
    await nftContract.approve(tokenId);
    const factoryContract = new FactoryContract(provider, account);
    await factoryContract.initializeAuction(tokenId, BigInt(amount * 10e17));
    onClose()
  };
  return (
    <>
      <Button fullWidth onPress={onOpen} color="primary">
        Initialze Auction
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="p-6 pb-0">
            Initialize Auction
          </ModalHeader>
          <ModalBody className="p-6">
            <Input
              type="number"
              label="Amount"
              variant="bordered"
              classNames={{
                inputWrapper: "!border !border-divider !shadow-none"
              }}
              labelPlacement="outside"
              placeholder="Input amount here"
              value={amount.toString()}
              onValueChange={(value) => setAmount(Number.parseFloat(value))}
              endContent={
                <div className="text-sm text-foreground-500"> KLAY</div>
              }
            />
          </ModalBody>
          <ModalFooter className="p-6 pt-0">
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" onPress={onPress}>
              Initialize Auction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
