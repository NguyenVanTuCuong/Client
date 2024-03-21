import { useSDK } from "@metamask/sdk-react";
import {
  useDisclosure,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spacer,
} from "@nextui-org/react";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { MetamaskLogoIcon } from "./MetamaskLogoIcon";
import { DollarSignIcon } from "lucide-react";
import Web3 from "web3";

export interface WalletModalRefSelectors {
  onOpen: () => void;
}

export const WalletModalRef = forwardRef<WalletModalRefSelectors>((_, ref) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useImperativeHandle(ref, () => ({
    onOpen,
  }));

  const { account, sdk, provider } = useSDK();

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const handeEffect = async () => {
      const web3 = new Web3(provider);
      if (!account) return;
      const _balance = await web3.eth.getBalance(account);
      const __balance =
        Number((_balance * BigInt(100000)) / BigInt(10e17)) / 100000;
      setBalance(__balance);
    };
    handeEffect();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="p-6 pb-0">Wallet</ModalHeader>
        <ModalBody className="p-6">
          <div className="h-[300px] max-h-[300px]  grid place-items-center">
            {!account ? (
              <div>
                <Button
                  onPress={() => sdk?.connect()}
                  variant="flat"
                  startContent={<MetamaskLogoIcon size={20} />}
                >
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div className="h-[300px] max-h-[300px]  grid place-content-center">
                <div className="text-center">
                  {`${account?.slice(0, 4)}...${account.slice(-2)}`}
                </div>
                <Spacer y={4} />
                <div className="text-3xl font-semibold text-center">
                  {balance.toString()} KLAY
                </div>
                <Spacer y={4} />
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    color="primary"
                    onPress={() => {
                      window.open(
                        "https://baobab.wallet.klaytn.foundation/faucet"
                      );
                    }}
                  >
                    Buy more
                  </Button>
                  <Button
                    className="flex-1"
                    variant="light"
                    onPress={() => {
                      sdk?.terminate();
                    }}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
