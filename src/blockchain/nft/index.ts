import Web3, { Contract, EthExecutionAPI, SupportedProviders } from "web3"
import abi from "./abi"
import axios from "axios"
import { GAS_LIMIT, GAS_PRICE } from "@/utils/const"

export interface NFT {
    tokenId: BigInt,
    imageUrl: string,
    name: string,
    description: string,
    color: string;
    species: string;
}

export class NftContract {
    account?: string
    contract: Contract<typeof abi>

    constructor(provider?: SupportedProviders<EthExecutionAPI>, account?: string) {
        const web3 = new Web3(provider)
        this.contract = new web3.eth.Contract(abi, process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS, web3)
        this.account = account
    }

    async approve(tokenId: BigInt) {
        await this.contract.methods.approve(process.env.NEXT_PUBLIC_FACTORY_ADDRESS, tokenId).send({
            from: this.account, gas: GAS_LIMIT, gasPrice: GAS_PRICE
        })
    }

    async getNFTInfo(i: BigInt): Promise<NFT> {
        const cid = await this.contract.methods._tokenURIs(i).call()
        const data = (await axios.get(`https://ipfs.io/ipfs/${cid}`)).data
        return {
            tokenId: i,
                name: data.name,
                description: data.description,
                imageUrl: `https://ipfs.io/ipfs/${data.imageCid}`,
                color: data.color,
                species: data.species
            }
    }

    async getAllNfts(): Promise<NFT[]> {
        const results: NFT[] = []
        const tokenIdNext = await this.contract.methods.tokenIdNext().call()
        console.log(tokenIdNext)
        if (Number(tokenIdNext) === 0) return []
        const promises: Array<Promise<void>> = []
        for (let i = 0; i < Number(tokenIdNext); i++) {
            promises.push(
                (async () => {
                    try{
                        const owner = await this.contract.methods.ownerOf(BigInt(i)).call()
                        if (Web3.utils.toChecksumAddress(owner) !== Web3.utils.toChecksumAddress(this.account ?? "")) return
                        const cid = await this.contract.methods._tokenURIs(BigInt(i)).call()
                        const data = (await axios.get(`https://ipfs.io/ipfs/${cid}`)).data
                        results.push(
                            {
                                tokenId: BigInt(i),
                                name: data.name,
                                description: data.description,
                                imageUrl: `https://ipfs.io/ipfs/${data.imageCid}`,
                                color: data.color,
                                species: data.species
                            }
                        )
                    } catch (ex) {
                        
                    }
                   
                })()
            )
        }
        await Promise.all(promises)
        return results
    }
}