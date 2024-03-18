"use client"

import { Tabs, Tab, Card, CardBody } from "@nextui-org/react"
import React, { useState } from "react"

interface NFT {
    tokenId: BigInt,
    imageUrl: string,
    name: string, 
    description: string,     
}
export const AllTabs = () => {
    const [NFTs, setNFTs] = useState<Array<NFT>>([])
    
    return (
        <Tabs variant="underlined" aria-label="Options">
        <Tab key="photos" title="Profile">
          <Card>
            <CardBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </CardBody>
          </Card>  
        </Tab>
        <Tab key="music" title="NFTs"> 
        </Tab>
        <Tab key="videos" title="Videos">
          <Card>
            <CardBody>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </CardBody>
          </Card>  
        </Tab>
      </Tabs>
    )
}