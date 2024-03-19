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
  };
  return (
    <>
      <Button onPress={onOpen} color="primary">Initialze Auction</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Initialze Auction
              </ModalHeader>
              <ModalBody>
                <Input
                  type="number"
                  label="Amount"
                  className="w"
                  labelPlacement="outside"
                  placeholder="Input amount here"
                  value={amount.toString()}
                  onValueChange={(value) => setAmount(Number.parseFloat(value))}
                  endContent={<div className="text-sm text-foreground-500"> KLAY</div>}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onPress}>
                Initialze
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
