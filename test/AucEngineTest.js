const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AucEngine", function () {
    let owner;
    let seller;
    let buyer;
    let auct;

    beforeEach(async function () {
        [owner, seller, buyer] = await ethers.getSigners();

        const AucEngine = await ethers.getContractFactory("AucEngine", owner)
        auct = await AucEngine.deploy()
        await auct.deployed()
    })

    it("sets owner", async function() {
        const currentOwner = await auct.owner()
        console.log(currentOwner)

        expect(currentOwner).to.eq(owner.address)
    })

    async function getTimestamp(bn) {
        return (
            await ethers.provider.getBlock(bn)
        ).timestamp;
    }

    describe("createAuction", function () {
        it("creates auction correctly", async function() {
            const tx = await auct.createAuction(
                ethers.utils.parseEther("0.0001"),
                3,
                "fake item",
                60
            );

            const cAuction = await auct.auctions(0);
            //console.log(cAuction)
            expect(cAuction.item).to.eq("fake item");   
            //console.log(tx)
            const ts = await getTimestamp(tx.blockNumber);

            expect(cAuction.endsAt).to.eq.apply(ts + duration);
        });  
    });

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    describe("buy", function () {
        it("allow to buy", async function () {
            await auct.createAuction(
                ethers.utils.parseEther("0.0001"),
                3,
                "fake item",
                60
            );

            this.timeout(5000);

            await delay(1000);

            const buyTx = await auct.connect(buyer)
            .buy(0, {value: ethers.utils.parseEther("0.0001")})
            
            const cAuction = await auct.auctions(0);
            const finalPrice = cAuction.finalPrice;

            await expect(() => buyTx).
                to.changeEtherBalance(
                    seller, finalPrice - Math.floor((finalPrice * 10) / 100)
                )

            await expect(buyTx)
                .to.emit(token, 'AuctionEnded')
                .withArgs(0, finalPrice, buyer.address);

            await expect(
                auct.connect(buyer).
                    buy(0, {value: ethers.utils.parseEther("0.0001")})
            ).to.be.reverztedWith('stopped!');
        })
    })
});

