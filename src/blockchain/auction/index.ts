import Web3, { Address, Contract, EthExecutionAPI, SupportedProviders } from "web3"
import abi from "./abi"
import axios from "axios"
import { initialize } from "next/dist/server/lib/render-server"
import { GAS_LIMIT, GAS_PRICE } from "@/utils/const"

export class AuctionContract {
    account?: string
    contract: Contract<typeof abi>

    constructor(address: string, provider?: SupportedProviders<EthExecutionAPI>, account?: string) {
        const web3 = new Web3(provider)
        this.contract = new web3.eth.Contract(abi, address, web3)
        this.account = account
    }

    async isTerminated() {
        return await this.contract.methods._isTerminated().call()
    }

    async owner() {
        return await this.contract.methods.owner().call()
    }

    async initialAmount() {
        return await this.contract.methods._initialAmount().call()
    }

    async tokenId() {
        return await this.contract.methods._tokenId().call()
    }

    async orchidNFTCollectible() {
        return await this.contract.methods._orchidNFTCollectible().call()
    }

    async currentAmount() {
        return await this.contract.methods._currentAmount().call()
    }

    async bid(amount: BigInt) {
        return await this.contract.methods.bid(amount).send({ from: this.account, value: amount.toString(), gas: GAS_LIMIT, gasPrice: GAS_PRICE})
    }

    async endAuction() {
        await this.contract.methods.endAuction().send({ from: this.account, gas: GAS_LIMIT, gasPrice: GAS_PRICE})
    }

    async getAllBids() {
        return await this.contract.methods.getAllBids().call()
    }
}