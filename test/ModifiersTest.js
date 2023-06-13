const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Modifiers", function () {
    let owner
    let other_addr
    let modifier

    beforeEach(async function() {
        [owner, other_addr] = await ethers.getSigners()

        const Modifiers = await ethers.getContractFactory("Modifiers", owner)
        modifier = await Modifiers.deploy()
        await modifier.deployed()
    })

    async function sendMoney(sender) {
        const amount = 100;
        const txData = {
            to: modifier.address,
            value: amount
        }

        const tx = await sender.sendTransaction(txData)
        await tx.wait();

        return [tx, amount]
    }
    it("Should allow to send money", async function() {
        const [sendMoneyTx, amount] = await sendMoney(other_addr)
        
        await expect(() => sendMoneyTx)
            .to.changeEtherBalance(modifier, amount);

        const timestamp = (
            await ethers.provider.getBlock(sendMoneyTx.blockNumber)
        ).timestamp;

        await expect(sendMoneyTx).to.emit(modifier, "Paid")
        .withArgs(other_addr.address, amount, timestamp)    
        console.log(sendMoneyTx)
    })

    it("Should allow owner to withdraw funds", async function() {
        const [_, amount] = await sendMoney(other_addr)

        const tx = await modifier.withdraw(owner.address)

        await expect(() => tx).to.changeEtherBalance([modifier, owner], [-amount, amount])
    });

    it("Should not allow other accounts to withdraw funds", async function() {
        await sendMoney(other_addr)
        
        await expect(
            modifier.connect(other_addr).withdraw(other_addr.address)
        ).to.be.revertedWith("you are not an owner!");

    });
})