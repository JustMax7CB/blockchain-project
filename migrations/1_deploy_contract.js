const Demo_Contract = artifacts.require("biddingContract");

module.exports = (deployer) => {
  deployer.deploy(Demo_Contract);
};
