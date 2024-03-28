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
import { HammerIcon } from "lucide-react";
import { AuctionContract } from "@/blockchain/auction";

interface BidModalProps {
  address: string;
  isDisabled: boolean;
}

export const BidModal = (props: BidModalProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { provider, account } = useSDK();

  const [amount, setAmount] = useState(0);
  const { address } = props;

  const onPress = async () => {
    const nftContract = new AuctionContract(address, provider, account);
    const transaction = await nftContract.bid(BigInt(amount * 10e17));
    //transaction.transactionHash
    
    onClose()
  };
  return (
    <>
      <Button isDisabled={props.isDisabled} color="primary" onPress={onOpen} fullWidth startContent={<HammerIcon size={20} strokeWidth={3/2}/>}> Bid </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Bid
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
                <div className="text-sm text-foreground-500"> Please provide a number larger than current price, otherwise the transaction is reverted</div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onPress}>
                Bid
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
