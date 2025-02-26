const AMLContract = artifacts.require("AMLContract");

module.exports = function (deployer) {
  deployer.deploy(AMLContract);
};
