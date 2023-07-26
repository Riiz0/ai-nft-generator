const { expect } = require('chai');
const { ethers }= require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('NFT', () => {
    let deployer, user1, user2
    let nft
   
    beforeEach(async () => {
        //Deploy Contract
        const NAME = "AI Generated NFT";
        const SYMBOL = "AINFT";
        const COST = tokens(1) // 1 ETH
      
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST)

        //Setup Accounts
        [deployer, user1, user2] = await ethers.getSigners()
    })

describe('Deployment', () => {
    //Check For Correct Name And Symbol
    it("Correct Name and Symbol", async () => {
        expect(await nft.name()).to.equal("AI Generated NFT")
        expect(await nft.symbol()).to.equal("AINFT")
    })

    //Check For Correct Deployer Address
    it("Returns Contract Developer", async () => {
        const result = await nft.owner()
        expect(result).to.be.equal(deployer.address)
    })

    //Check For Correct COST Of NFT Mint
    it("Returns The Cost", async () => {
        const cost = await nft.cost()
        expect(cost).to.equal(COST)
    })
})

    //Correctly Check for Mint and Burn Function
    it("Mint and Burn NFT's Correctly", async () => {
        //Mint an NFT for user1
        const uri1 = "METADATA_URI_1";
        const mintTx = await nft.connect(user1).mint(uri1, { value: COST });
        const receipt = await mintTx.wait();
        const tokenId = receipt.events[0].args.tokenId;

        //Check The TotalSupply
        expect(await nft.ownerOf(tokenId)).to.equal(user1.address)

        //Burn the NFT
        await nft.connect(user1).burn(tokenId);

        //Check the TotalSupply After Burning
        expect(await nft.totalSupply()).to.equal(0)

        //Check That The NFT Is No Longer Owned By User1
        let isOwned = true;
        try {
            await nft.ownerOf(tokenId)
        } catch (error) {
            isOwned = false
        }
        expect(isOwned).to.be.false;
    })

    //Check For Failed Burn Attempts of NFTs Not Owned By User
    it("Can't Burn NFTs Owned By Others", async () => {
        //Mint NFTs For User1 And User2
        const uri1 = "METADATA_URI_1"
        await nft.connect(user1).mint(uri1, { value: COST })
        const uri2 = "METADATA_URI_2"
        await nft.connect(user2).mint(uri2, { value: COST })

        //Get Token ID Of User1 Minted NFT
        const tokenId = 1

        //Try Burning The NFT as user2 (who doesn't own user1 NFT)
        try {
            await nft.connect(user2).burn(tokenId)

            //If The Burn Is Successful, Fail The Test
            expect.fail("User2 Should Not Be Able To Burn NFT Owned By User1")
        } catch (error) {
            //Expect An Error To be Thrown (burn should fail)
            expect(error.message).to.contain("You Are Not The Owner Of This NFT")
        }
    })

    it("Retrieve Metadata URI For A Given Token ID", async () => {
        const uri = "METADATA_URI_1"
        const tokenId = 1;

        //Mint an NFT for user1
        await nft.connect(user1).mint(uri, { value: COST })

        //Retrieve The MetaData URI For The Minted NFT
    })

})