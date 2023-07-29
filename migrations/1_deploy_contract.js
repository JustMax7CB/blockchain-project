const BiddingContract = artifacts.require("BiddingContract");

module.exports = function (deployer) {
    const initialFundingAmount = web3.utils.toWei("1", "ether"); // Adjust the initial funding amount as needed

    deployer.deploy(BiddingContract, { value: initialFundingAmount });
};
