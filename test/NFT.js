const { expect } = require('chai');
const { ethers }= require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('NFT', () => {
    let deployer, user1, user2
    let nft
   
    const NAME = "AI Generated NFT";
    const SYMBOL = "AINFT";
    const COST = tokens(1) // 1 ETH

    beforeEach(async () => {
        //Setup Accounts
        [deployer, user1, user2] = await ethers.getSigners()

        //Deploy Contract      
        const NFT = await ethers.getContractFactory('NFT')
        nft = await NFT.deploy(NAME, SYMBOL, COST)
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
        expect(cost).to.be.equal(COST)
    })
})

describe('Mint And Burn', () => {
    // Define a variable to store the initial total supply before testing
    let initialTotalSupply

    // Before each test, store the initial total supply
    beforeEach(async () => {
        initialTotalSupply = (await nft.totalSupply()).toNumber()
    })

    //Correctly Check for Mint and Burn Function
    it("TotalSupply Mint And Burn", async () => {
        //Mint an NFT for user1
        const uri1 = "METADATA_URI_1"
        const mintTx = await nft.connect(user1).mint(uri1, { value: COST })
        const mintReceipt = await mintTx.wait()

        // Get the emitted Mint event from the logs
        const mintEvent = mintReceipt.events.find((event) => event.event === "Mint")

        // Extract the tokenId from the event
        const tokenId = mintEvent.args.tokenId

        // Check the TotalSupply After Minting
        const totalSupplyAfterMinting = (await nft.totalSupply()).toNumber()
        expect(totalSupplyAfterMinting).to.equal(initialTotalSupply + 1)

        // Burn the NFT
        const burnTx = await nft.connect(user1).burn(tokenId)
        const burnReceipt = await burnTx.wait()

        // Wait for the burn transaction to be mined and confirmed
        await ethers.provider.waitForTransaction(burnReceipt.transactionHash)

        // Check the TotalSupply After Burning
        const totalSupplyAfterBurning = (await nft.totalSupply()).toNumber()
        expect(totalSupplyAfterBurning).to.equal(initialTotalSupply)

        //Check That The NFT Is No Longer Owned By User1
        let isOwned = true
        try {
            await nft.ownerOf(tokenId)
        } catch (error) {
            isOwned = false
        }
        expect(isOwned).to.be.false
    })

    //Check For Failed Burn Attempts of NFTs Not Owned By User
    it("Can't Burn NFTs Owned By Others", async () => {
        // Mint an NFT for user1
        const uri1 = "METADATA_URI_1";
        const mintTx = await nft.connect(user1).mint(uri1, { value: COST });
        const mintReceipt = await mintTx.wait();

        // Get the emitted Mint event from the logs
        const mintEvent = mintReceipt.events.find((event) => event.event === "Mint");

        // Extract the tokenId from the event
        const tokenId = mintEvent.args.tokenId;

        // Try to burn the NFT as user2 (who doesn't own the NFT)
        try {
            const burnTx = await nft.connect(user2).burn(tokenId);
            await burnTx.wait();
            // If the transaction doesn't revert, fail the test
            assert.fail("Expected transaction to revert");
        } catch (error) {
            // Check that the error message matches the expected error message
            expect(error.message).to.include("Caller is not owner");
        }

        // Check that the NFT is still owned by user1
        expect(await nft.ownerOf(tokenId)).to.equal(user1.address)
    })
})

describe('MetaDataURI', () => {
    it("Retrieve Metadata URI For A Given Token ID", async () => {
        const uri = "METADATA_URI_1"
        const tokenId = 1

        //Mint An NFT For User1
        await nft.connect(user1).mint(uri, { value: COST })

        //Retrieve The MetaData URI For The Minted NFT
        const metadataURI = await nft.getTokenURI(tokenId)
        expect(metadataURI).to.equal(uri);
    })
})

describe('Withdraw', () => {
    it("Withdraw Contracts Balance By The Contract Owner", async () => {
        //Mint An NFT For User1
        const uri1 = "METADATA_URI_1"
        await nft.connect(user1).mint(uri1, { value: COST })

        //Check The Contracts Initial Balance
        expect(await ethers.provider.getBalance(nft.address)).to.equal(COST)

        //Withdraw The Contracts Balance By The Ownre (deployer)
        await nft.withdraw()

        //Check The Contracts Balance After Withdrawal
        expect(await ethers.provider.getBalance(nft.address)).to.equal(0)
    })
})
})
