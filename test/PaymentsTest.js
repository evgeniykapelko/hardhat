const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payments", function () {
    let acc1
    let acc2
    let payments

    beforeEach(async function() {
        [acc1, acc2] = await ethers.getSigners()
        const Payments = await ethers.getContractFactory("Payments", acc1)
        payments = await Payments.deploy()
        await payments.deployed
        console.log(payments.address)
    })

    it("should be deployed", async function() {
        // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#proper-address
        expect(payments.address).to.be.properAddress;
    })


    it("Should have 0 ether by default", async function() {
        const balance = await payments.currentBalance()

        expect(balance).to.eq(0)
    })

    it("Should be possible to send funds", async function() {
        const msg = "hello from hardhat";
        const amount = 100;
        const tx = await payments.connect(acc2).pay(msg, { value: amount})
        
        await expect(() => tx)
        .to.changeEtherBalances(
            [acc2, payments],
             [-amount, amount]
             )
        await tx.wait()

        const balance = await payments.currentBalance()

        console.log(balance)

        const newPayment = await await payments.getPayemtn(acc2.address, 0)

        expect(newPayment.message).to.eq(msg)
        expect(newPayment.amount).to.eq(amount)
        expect(newPayment.from).to.eq(acc2.address)

        console.log(newPayment)
    })
})