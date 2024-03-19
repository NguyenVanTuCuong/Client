import Web3, { Address, Contract, EthExecutionAPI, SupportedProviders } from "web3"
import abi from "./abi"
import axios from "axios"
import { initialize } from "next/dist/server/lib/render-server"
import { GAS_LIMIT, GAS_PRICE } from "@/utils/const"

export interface NFT {
    tokenId: BigInt,
    imageUrl: string,
    name: string, 
    description: string,     
}

export class FactoryContract {
    account?: string
    contract: Contract<typeof abi>

    constructor(provider?: SupportedProviders<EthExecutionAPI>, account?: string) {
        const web3 = new Web3(provider)
        this.contract = new web3.eth.Contract(abi, process.env.NEXT_PUBLIC_FACTORY_ADDRESS, web3)
        this.account = account
    }

    async initializeAuction(tokenId: BigInt, amount: BigInt) {
        await this.contract.methods.initializeAuction(tokenId, amount).send({ from: this.account, value: "100000000000000000", gas: GAS_LIMIT, gasPrice: GAS_PRICE})
    }

    async getAllOwnedAuctionContracts(owned: Address) {
        return await this.contract.methods.getAllOwnedAuctionContracts(owned).call()
    }

    async getAllAuctionContracts() {
        return await this.contract.methods.getAllAuctionContracts().call()
    }
}