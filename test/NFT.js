

const { expect, assert } = require('chai');
const { ethers }= require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('NFT', () => {
    let deployer, user1, user2
    let tokenId
    let initialTotalSupply
    const NAME = "AI Generated NFT";
    const SYMBOL = "AINFT";
    const COST = tokens(1) // 1 ETH

    // Separate contract instances for each inner describe block
    let nftDeployer // For the deployment and basic checks
    let nftMintAndBurn // For minting and burning tests
    let nftMetaDataURI // For metadata URI test
    let nftWithdraw // For withdraw test
    let nftTradeNFTs // For trade NFTs test

    beforeEach(async () => {
        //Setup Accounts
        [deployer, user1, user2] = await ethers.getSigners()
        
        //Set tokenId counter to 0 before each test
        tokenId = 0

        // Set the initialTotalSupply to 0 before each test
        initialTotalSupply = 0;
    })

describe('Deployment', () => {
    beforeEach( async () => {
        //Deploy Contract      
        const NFT = await ethers.getContractFactory('NFT')
        nftDeployer = await NFT.deploy(NAME, SYMBOL, COST)
    })
    //Check For Correct Name And Symbol
    it("Correct Name and Symbol", async () => {
        expect(await nftDeployer.name()).to.equal("AI Generated NFT")
        expect(await nftDeployer.symbol()).to.equal("AINFT")
    })

    //Check For Correct Deployer Address
    it("Returns Contract Developer", async () => {
        const result = await nftDeployer.owner()
        expect(result).to.be.equal(deployer.address)
    })

    //Check For Correct COST Of NFT Mint
    it("Returns The Cost", async () => {
        const cost = await nftDeployer.cost()
        expect(cost).to.be.equal(COST)
    })
})

describe('Mint And Burn', () => {
    beforeEach(async () => {
        //Deploy Contract      
        const NFT = await ethers.getContractFactory('NFT')
        nftMintAndBurn = await NFT.deploy(NAME, SYMBOL, COST)

        // Get a new instance of Counters.Counter and set it as tokenIds
        const Counters = await ethers.getContractFactory('Counters')
        const countersContract = await Counters.deploy()
        nftMintAndBurn.tokenIds = countersContract
    })

    //Correctly Check for Mint and Burn Function
    it("TotalSupply Mint And Burn", async () => {
        // Check the initial total supply (should be 0)
        let initialTotalSupply = (await nftMintAndBurn.totalSupply()).toNumber()
        expect(initialTotalSupply).to.equal(0)

        //Mint an NFT for user1
        const uri1 = "METADATA_URI_1"
        const mintTx = await nftMintAndBurn.connect(user1).mint(uri1, { value: COST })
        const mintReceipt = await mintTx.wait()

        // Get the emitted Mint event from the logs
        const mintEvent = mintReceipt.events.find((event) => event.event === "Mint")

        // Extract the tokenId from the event
        tokenId = mintEvent.args.tokenId.toNumber()

        // Check the TotalSupply After Minting
        const totalSupplyAfterMinting = (await nftMintAndBurn.totalSupply()).toNumber()
        expect(totalSupplyAfterMinting).to.equal(initialTotalSupply + 1)
        initialTotalSupply = totalSupplyAfterMinting

        // Burn the NFT
        const burnTx = await nftMintAndBurn.connect(user1).burn(tokenId)
        const burnReceipt = await burnTx.wait()

        // Wait for the burn transaction to be mined and confirmed
        await ethers.provider.waitForTransaction(burnReceipt.transactionHash)

        // Check the TotalSupply After Burning
        const totalSupplyAfterBurning = (await nftMintAndBurn.totalSupply()).toNumber()
        expect(totalSupplyAfterBurning).to.equal(initialTotalSupply) // After burning, total supply should be 0

        //Check That The NFT Is No Longer Owned By User1
        await expect(nftMintAndBurn.ownerOf(tokenId)).to.be.reverted;
    })

    //Check For Failed Burn Attempts of NFTs Not Owned By User
    it("Can't Burn NFTs Owned By Others", async () => {
        // Mint an NFT for user1
        const uri1 = "METADATA_URI_1";
        const mintTx = await nftMintAndBurn.connect(user1).mint(uri1, { value: COST });
        const mintReceipt = await mintTx.wait();

        // Get the emitted Mint event from the logs
        const mintEvent = mintReceipt.events.find((event) => event.event === "Mint");

        // Extract the tokenId from the event
        tokenId = mintEvent.args.tokenId.toNumber()

        // Try to burn the NFT as user2 (who doesn't own the NFT)
        await expect(nftMintAndBurn.connect(user2).burn(tokenId)).to.be.revertedWith("Caller is not owner")

        // Check that the NFT is still owned by user1
        expect(await nftMintAndBurn.ownerOf(tokenId)).to.equal(user1.address)
    })
})

describe('MetaDataURI', () => {
    beforeEach(async () => {
        //Deploy Contract      
        const NFT = await ethers.getContractFactory('NFT')
        nftMetaDataURI = await NFT.deploy(NAME, SYMBOL, COST)
    })
    it("Retrieve Metadata URI For A Given Token ID", async () => {
        const uri1 = "METADATA_URI_1";
        const mintTx = await nftMetaDataURI.connect(user1).mint(uri1, { value: COST })
        const mintReceipt = await mintTx.wait()

        // Get the emitted Mint event from the logs
        const mintEvent = mintReceipt.events.find((event) => event.event === "Mint")

        // Extract the tokenId from the event
        tokenId = mintEvent.args.tokenId.toNumber();

        //Retrieve The MetaData URI For The Minted NFT
        const metadataURI = await nftMetaDataURI.getTokenURI(tokenId)
        expect(metadataURI).to.equal(uri1)
    })
})

describe('Withdraw', () => {
    beforeEach(async () => {
        //Deploy Contract      
        const NFT = await ethers.getContractFactory('NFT')
        nftWithdraw = await NFT.deploy(NAME, SYMBOL, COST)
    })
    it("Withdraw Contracts Balance By The Contract Owner", async () => {
        //Mint An NFT For User1
        const uri1 = "METADATA_URI_1"
        await nftWithdraw.connect(user1).mint(uri1, { value: COST })

        //Check The Contracts Initial Balance
        expect(await ethers.provider.getBalance(nftWithdraw.address)).to.equal(COST)

        //Withdraw The Contracts Balance By The Owner (deployer)
        await nftWithdraw.withdraw()

        //Check The Contracts Balance After Withdrawal
        expect(await ethers.provider.getBalance(nftWithdraw.address)).to.equal(0)
    })
})

describe('Trade NFTs', () => {
    beforeEach(async () => {
        //Deploy Contract      
        const NFT = await ethers.getContractFactory('NFT')
        nftTradeNFTs = await NFT.deploy(NAME, SYMBOL, COST)
    })
    it("Send 1 NFT from User1 to User2", async () => {

        //User1 Mints 1 NFT
        const uri1 = "METADATA_URI_1"
        const mintTx = await nftTradeNFTs.connect(user1).mint(uri1, { value: COST })
        const mintReceipt = await mintTx.wait()

        // Get the emitted Mint event from the logs
         const mintEvent = mintReceipt.events.find((event) => event.event === "Mint")

        // Extract the tokenId from the event
        tokenId = mintEvent.args.tokenId.toNumber()

        // Verify token existence before transfer
        let tokenExists = true
        try {
            await nftTradeNFTs.ownerOf(tokenId)
        } catch (error) {
            tokenExists = false
        }
        expect(tokenExists).to.be.true // Use expect instead of assert

        //Check that User1 owns the NFT before transfer
        const ownerBeforeTransfer = await nftTradeNFTs.ownerOf(tokenId)
        expect(ownerBeforeTransfer).to.equal(user1.address, "User1 should own the NFT before transfer")

        //User1 Sends NFT To User2
        await nftTradeNFTs.connect(user1).transferFrom(user1.address, user2.address, tokenId)

        //Check To See If User2 Now Owns User1's NFT
        const ownerAfterTransfer = await nftTradeNFTs.ownerOf(tokenId)
        expect(ownerAfterTransfer).to.equal(user2.address, "User2 should own the NFT after transfer")
    })
})
})
