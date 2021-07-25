const Mayor = artifacts.require("Mayor");
const SULToken = artifacts.require("SULToken");

function write_contract_addresses(mayor, sul) {
  const fs = require("fs");

  const user = {
    mayor: mayor,
    sul: sul,
  };

  // write JSON string to a file
  fs.writeFile("../addresses.json", JSON.stringify(user), (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
}

module.exports = async function (deployer, network, accounts) {
  // Deploy contracts
  const initialCoins = 100000;
  const candidates = [accounts[0], accounts[1]];
  const escrow = accounts[9];

  await deployer.deploy(SULToken, initialCoins);
  const SULTokenIstance = await SULToken.deployed();

  await deployer.deploy(Mayor, candidates, escrow, 3, SULTokenIstance.address);
  const MayorInstance = await Mayor.deployed();

  // Move minted coin over the Mayor contract
  await SULTokenIstance.transfer(MayorInstance.address, initialCoins);

  write_contract_addresses(MayorInstance.address, SULTokenIstance.address);
};
