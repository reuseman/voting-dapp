const Mayor = artifacts.require("Mayor");
const SULToken = artifacts.require("SULToken");
const fs = require("fs");

function write_contract_addresses(mayor, sul) {
  const user = {
    mayor: mayor,
    sul: sul,
  };

  // write JSON string to a file
  fs.writeFile(
    "../frontend/contracts/addresses.json",
    JSON.stringify(user),
    (err) => {
      if (err) {
        throw err;
      }
      console.log("Contract addresses are saved.");
    }
  );
}

function copy_contracts_to_frontend() {
  fs.copyFile(
    "./build/contracts/Mayor.json",
    "../frontend/contracts/Mayor.json",
    (err) => {
      if (err) {
        console.log("Error while copying Mayor.json");
        console.log(err);
      } else {
        console.log("Mayor contract is saved");
      }
    }
  );
  fs.copyFile(
    "./build/contracts/SULToken.json",
    "../frontend/contracts/SULToken.json",
    (err) => {
      if (err) {
        console.log("Error while copying SULToken.json");
        console.log(err);
      } else {
        console.log("SULToken contract is saved");
      }
    }
  );
}

module.exports = async function (deployer, network, accounts) {
  // Deploy contracts
  const initialCoins = 100000;
  const candidates = [accounts[0], accounts[1], accounts[2]];
  const escrow = accounts[9];

  await deployer.deploy(SULToken, initialCoins);
  const SULTokenIstance = await SULToken.deployed();

  await deployer.deploy(Mayor, candidates, escrow, 2, SULTokenIstance.address);
  const MayorInstance = await Mayor.deployed();

  // Move minted coin over the Mayor contract
  await SULTokenIstance.transfer(MayorInstance.address, initialCoins);

  write_contract_addresses(MayorInstance.address, SULTokenIstance.address);
  copy_contracts_to_frontend();
};
